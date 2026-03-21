import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { ShadowService } from './shadow.service';
import { AuditModule } from '../../system/audit/audit.module';
import { MonarchModule } from '../monarch.module';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Project]),
        AuditModule,
        MonarchModule
    ],
    providers: [ShadowService],
    exports: [ShadowService]
})
export class ShadowModule { }
