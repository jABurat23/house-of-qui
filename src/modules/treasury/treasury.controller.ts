import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TreasuryService } from './treasury.service';

@Controller('monarch/treasury')
export class TreasuryController {
  constructor(private readonly treasuryService: TreasuryService) {}

  @Get('wallet/:projectId')
  async getWallet(@Param('projectId') projectId: string) {
    return this.treasuryService.getWallet(projectId);
  }

  @Get('transactions/:projectId')
  async getTransactions(@Param('projectId') projectId: string, @Query('limit') limit?: number) {
    return this.treasuryService.getTransactions(projectId, limit);
  }

  @Get('summary')
  async getSummary() {
    const wallets = await this.treasuryService.getWallets();
    const totalBalance = wallets.reduce((acc, w) => acc + Number(w.balance), 0);
    return {
       wallets,
       totalBalance,
       activeValuations: wallets.length,
       timestamp: new Date()
    };
  }
}
