import { Module } from '@nestjs/common';
import { SentryService } from './sentry.service';
import { MonarchModule } from '../../monarch/monarch.module';
import { RecoveryModule } from '../../monarch/recovery/recovery.module';
import { SystemConfigModule } from '../config/config.module';

@Module({
    imports: [MonarchModule, RecoveryModule, SystemConfigModule],
    providers: [SentryService],
    exports: [SentryService]
})
export class SentryModule { }
