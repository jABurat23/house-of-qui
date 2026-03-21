import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemConfig } from '../entities/systemConfig.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class SystemConfigService implements OnModuleInit {
    constructor(
        @InjectRepository(SystemConfig)
        private configRepository: Repository<SystemConfig>,
        private auditService: AuditService,
    ) { }

    async onModuleInit() {
        await this.seedDefaults();
    }

    async set(key: string, value: any, category = 'general', description?: string) {
        let type: 'string' | 'number' | 'boolean' | 'json' = 'string';
        let valStr = String(value);

        if (typeof value === 'number') type = 'number';
        else if (typeof value === 'boolean') {
            type = 'boolean';
            valStr = value ? 'true' : 'false';
        } else if (typeof value === 'object') {
            type = 'json';
            valStr = JSON.stringify(value);
        }

        const config = await this.configRepository.save({
            key,
            value: valStr,
            type,
            category,
            description,
        });

        await this.auditService.recordAction({
            action: 'SYSTEM_CONFIG_UPDATED',
            targetId: key,
            metadata: { value, type },
            level: 'warning',
        });

        return config;
    }

    async get<T = any>(key: string, defaultValue?: T): Promise<T> {
        const config = await this.configRepository.findOneBy({ key });
        if (!config) return defaultValue as T;

        switch (config.type) {
            case 'number': return Number(config.value) as any;
            case 'boolean': return (config.value === 'true') as any;
            case 'json': return JSON.parse(config.value);
            default: return config.value as any;
        }
    }

    async getAll(): Promise<SystemConfig[]> {
        return this.configRepository.find({ order: { category: 'ASC', key: 'ASC' } });
    }

    private async seedDefaults() {
        const defaults = [
            { key: 'imperial_title', value: 'House of Qui', category: 'branding', description: 'The official name of the empire' },
            { key: 'maintenance_mode', value: false, category: 'security', description: 'Locks down all project actions' },
            { key: 'registration_open', value: true, category: 'security', description: 'Whether new projects can register' },
            { key: 'observatory_refresh_ms', value: 5000, category: 'performance', description: 'Refresh rate for dashboard metrics' },
            { key: 'seal_enforcement', value: false, category: 'security', description: 'If true, reject all unsigned project registrations' },
            { key: 'auto_recovery_enabled', value: true, category: 'security', description: 'Enable Imperial Sentry auto-rollback on failure' },
        ];

        for (const d of defaults) {
            const existing = await this.configRepository.findOneBy({ key: d.key });
            if (!existing) {
                await this.set(d.key, d.value, d.category, d.description);
            }
        }
    }
}
