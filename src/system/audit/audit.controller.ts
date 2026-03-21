import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('system/audit')
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Get('recent')
    async getRecent(@Query('limit') limit?: string) {
        return this.auditService.getLogs(limit ? parseInt(limit, 10) : 50);
    }

    @Get()
    async getLogs(@Query('limit') limit?: string) {
        return this.auditService.getLogs(limit ? parseInt(limit, 10) : 100);
    }
}
