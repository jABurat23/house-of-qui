import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PulseMonitorService } from './pulse.service';
import { PluginModule } from '../plugins/plugin.module';

@Global()
@Module({
  imports: [
    TypeOrmModule,
    PluginModule
  ],
  providers: [PulseMonitorService],
  exports: [PulseMonitorService],
})
export class SystemMonitorModule {}
