import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImperialEvent } from './entities/event.entity';
import { AuditGateway } from '../../system/audit/audit.gateway';
import { AuditService } from '../../system/audit/audit.service';

@Injectable()
export class CommunicationService {
    constructor(
        @InjectRepository(ImperialEvent)
        private eventRepository: Repository<ImperialEvent>,
        private auditService: AuditService,
        private auditGateway: AuditGateway,
    ) { }

    async emitEvent(sourceId: string, type: string, payload: any, targetId?: string): Promise<ImperialEvent> {
        const event = this.eventRepository.create({
            sourceProjectId: sourceId,
            eventType: type,
            payload,
            targetProjectId: targetId,
            targetType: targetId ? 'direct' : 'broadcast'
        });

        const saved = await this.eventRepository.save(event);

        // Dispatch via Socket.io
        if (this.auditGateway.server) {
            const socketPayload = {
                id: saved.id,
                source: sourceId,
                type,
                payload,
                timestamp: saved.createdAt
            };

            if (targetId) {
                // Direct event - in a real system we'd use rooms/socket IDs
                this.auditGateway.server.to(`project_${targetId}`).emit('imperial_event', socketPayload);
            } else {
                // Broadcast to all
                this.auditGateway.server.emit('imperial_event', socketPayload);
            }
        }

        await this.auditService.recordAction({
            action: 'EVENT_EMITTED',
            actor: sourceId,
            targetId: saved.id,
            metadata: { type, hasTarget: !!targetId },
            level: 'info'
        });

        return saved;
    }

    async getRecentEvents(limit = 50): Promise<ImperialEvent[]> {
        return this.eventRepository.find({
            order: { createdAt: 'DESC' },
            take: limit
        });
    }
}
