import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/auditLog.entity';

import { AuditGateway } from './audit.gateway';

@Injectable()
export class AuditService {
    constructor(
        @InjectRepository(AuditLog)
        private auditRepository: Repository<AuditLog>,
        private auditGateway: AuditGateway,
    ) { }

    async recordAction(params: {
        action: string;
        actor?: string;
        targetId?: string;
        metadata?: any;
        level?: 'info' | 'warning' | 'error' | 'critical';
        ipAddress?: string;
    }) {
        const log = this.auditRepository.create({
            action: params.action,
            actor: params.actor,
            targetId: params.targetId,
            metadata: params.metadata,
            level: params.level || 'info',
            ipAddress: params.ipAddress,
        });

        const savedLog = await this.auditRepository.save(log);
        this.auditGateway.broadcastLog(savedLog);
        return savedLog;
    }

    async getLogs(limit = 100) {
        return this.auditRepository.find({
            order: { timestamp: 'DESC' },
            take: limit,
        });
    }
}
