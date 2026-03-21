import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { CreditTransaction } from './entities/transaction.entity';
import { Project } from '../../monarch/entities/project.entity';
import { AuditService } from '../../system/audit/audit.service';
import { TelemetryBroadcaster } from '../observatory/telemetryBroadcaster';
import { logger } from '../../core/logger';

@Injectable()
export class TreasuryService implements OnModuleInit {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(CreditTransaction)
    private transactionRepository: Repository<CreditTransaction>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private auditService: AuditService,
    private telemetryBroadcaster: TelemetryBroadcaster
  ) {}

  async onModuleInit() {
    await this.seedWallets();
    // Manual billing cycle trigger only.
  }

  private async seedWallets() {
    const projects = await this.projectRepository.find();
    for (const p of projects) {
      const existing = await this.walletRepository.findOneBy({ project: { id: p.id } });
      if (!existing) {
        const wallet = this.walletRepository.create({ project: p });
        await this.walletRepository.save(wallet);
        logger.treasury(`Wallet initialized for ${p.name}`);
      }
    }
  }

  async getWallets() {
    return this.walletRepository.find({ relations: ['project'] });
  }

  async getWallet(projectId: string) {
    return this.walletRepository.findOne({
      where: { project: { id: projectId } },
      relations: ['project']
    });
  }

  async getTransactions(projectId: string, limit = 10) {
    const wallet = await this.getWallet(projectId);
    if (!wallet) return [];
    return this.transactionRepository.find({
      where: { wallet: { id: wallet.id } },
      order: { timestamp: 'DESC' },
      take: limit
    });
  }

  async runBillingCycle() {
    const wallets = await this.walletRepository.find({ relations: ['project'] });
    
    for (const wallet of wallets) {
      // Base cost 0.5 credits + random usage based cost
      const cost = 0.1 + (Math.random() * 0.4);
      await this.processTransaction(wallet.project.id, cost, 'debit', 'Imperial Resource Usage Fee');
    }
  }

  async processTransaction(projectId: string, amount: number, type: 'debit' | 'credit', description: string, resourceType?: string) {
    const wallet = await this.walletRepository.findOne({ where: { project: { id: projectId } }, relations: ['project'] });
    if (!wallet) return;

    if (type === 'debit') {
      wallet.balance = Number(wallet.balance) - amount;
    } else {
      wallet.balance = Number(wallet.balance) + amount;
    }

    await this.walletRepository.save(wallet);

    const tx = this.transactionRepository.create({
      wallet,
      amount,
      type,
      description,
      resourceType
    });
    await this.transactionRepository.save(tx);

    // Broadcast update
    this.telemetryBroadcaster.broadcastWalletUpdate(projectId, wallet.balance, {
        type,
        amount,
        description
    });

    if (wallet.balance < 100 && type === 'debit') {
        this.auditService.recordAction({
            action: 'TREASURY_LOW_BALANCE_WARNING',
            actor: 'SYSTEM',
            targetId: projectId,
            metadata: { balance: wallet.balance },
            level: 'warning'
        });
    }
  }

  async grantIncentive(projectId: string, amount: number, reason: string) {
    await this.processTransaction(projectId, amount, 'credit', `Imperial Incentive: ${reason}`);
    await this.auditService.recordAction({
        action: 'TREASURY_INCENTIVE_GRANTED',
        actor: 'IMPERIAL_TREASURY',
        targetId: projectId,
        metadata: { amount, reason },
        level: 'info'
    });
  }
}
