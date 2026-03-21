import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonarchController } from './monarch.controller';
import { MonarchService } from './monarch.service';
import { Project } from './entities/project.entity';
import { Deployment } from './entities/deployment.entity';
import { TelemetryBroadcaster } from '../modules/observatory/telemetryBroadcaster';
import { PluginModule } from '../system/plugins/plugin.module';
import { ArchiveModule } from './archive/archive.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Deployment]),
    PluginModule,
    ArchiveModule
  ],
  controllers: [MonarchController],
  providers: [MonarchService, TelemetryBroadcaster],
  exports: [MonarchService, TelemetryBroadcaster]
})
export class MonarchModule { }