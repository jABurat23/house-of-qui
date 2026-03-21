import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImperialCommand } from './entities/command.entity';
import { CommunicationService } from '../communication/communication.service';
import { AuditService } from '../../system/audit/audit.service';
import { getIoInstance } from '../../server/server';

@Injectable()
export class CommandService {
  constructor(
    @InjectRepository(ImperialCommand)
    private commandRepository: Repository<ImperialCommand>,
    private communicationService: CommunicationService,
    private auditService: AuditService,
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
    const io = getIoInstance();
    if (io) {
        io.emit('command_output', { commandId, chunk });
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
