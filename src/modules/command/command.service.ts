import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImperialCommand } from './entities/command.entity';
import { CommunicationService } from '../communication/communication.service';
import { AuditService } from '../../system/audit/audit.service';
import { AuditGateway } from '../../system/audit/audit.gateway';

@Injectable()
export class CommandService {
  constructor(
    @InjectRepository(ImperialCommand)
    private commandRepository: Repository<ImperialCommand>,
    private communicationService: CommunicationService,
    private auditService: AuditService,
    private auditGateway: AuditGateway,
  ) {}

  async executeRemoteCommand(projectId: string, command: string, args: any = {}) {
    // Create command record
    const cmdRecord = this.commandRepository.create({
      targetProjectId: projectId,
      command,
      args,
      status: 'pending'
    });

    const saved = await this.commandRepository.save(cmdRecord);

    // Emit event to the Imperial Bus
    await this.communicationService.emitEvent('IMPERIAL_COMMAND_CENTER', 'REMOTE_TASK', {
      commandId: saved.id,
      command,
      args
    }, projectId);

    await this.auditService.recordAction({
      action: 'REMOTE_COMMAND_ISSUED',
      actor: 'IMPERIAL_COMMAND_CENTER',
      targetId: projectId,
      metadata: { command, commandId: saved.id },
      level: 'warning'
    });

    return saved;
  }

  private broadcastOutput(commandId: string, chunk: string) {
    if (this.auditGateway.server) {
        this.auditGateway.server.emit('command_output', { commandId, chunk });
    }
  }

  async getCommandHistory(projectId?: string) {
    const where = projectId ? { targetProjectId: projectId } : {};
    return this.commandRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: 20
    });
  }

  async getCommandById(id: string) {
    return this.commandRepository.findOneBy({ id });
  }
}
