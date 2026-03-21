import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemConfig } from '../entities/systemConfig.entity';
import { SystemConfigService } from './config.service';
import { SystemConfigController } from './config.controller';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([SystemConfig])],
    providers: [SystemConfigService],
    controllers: [SystemConfigController],
    exports: [SystemConfigService],
})
export class SystemConfigModule { }
