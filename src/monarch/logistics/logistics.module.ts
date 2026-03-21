import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { ResourceQuota } from '../entities/quota.entity';
import { LogisticsService } from './logistics.service';
import { LogisticsController } from './logistics.controller';
import { MonarchModule } from '../monarch.module';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Project, ResourceQuota]),
        MonarchModule
    ],
    providers: [LogisticsService],
    controllers: [LogisticsController],
    exports: [LogisticsService]
})
export class LogisticsModule { }
