import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from '../entities/auditLog.entity';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { AuditGateway } from './audit.gateway';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([AuditLog])],
    providers: [AuditService, AuditGateway],
    controllers: [AuditController],
    exports: [AuditService, AuditGateway],
})
export class AuditModule { }
