import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonarchModule } from './monarch/monarch.module';
import { RightMinisterModule } from './minister/right-minister.module';
import { PluginModule } from './system/plugins/plugin.module';
import { PackagesModule } from './system/packages/packages.module';
import { AuditModule } from './system/audit/audit.module';
import { SystemConfigModule } from './system/config/config.module';
import { ArchiveModule } from './monarch/archive/archive.module';
import { RecoveryModule } from './monarch/recovery/recovery.module';
import { SentryModule } from './system/sentry/sentry.module';
import { CommunicationModule } from './modules/communication/communication.module';
import { ShadowModule } from './monarch/shadow/shadow.module';
import { LogisticsModule } from './monarch/logistics/logistics.module';
import { TreasuryModule } from './modules/treasury/treasury.module';
import { CommandModule } from './modules/command/command.module';
import { WatchtowerModule } from './system/watchtower/watchtower.module';
import { CartographerModule } from './monarch/cartographer/cartographer.module';
import { ScribeModule } from './monarch/scribe/scribe.module';
import { GlobalSecurityModule } from './system/security/security.module';
import { AuthModule } from './system/auth/auth.module';
import { SystemMonitorModule } from './system/monitor/monitor.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'qui_the_great',
      database: 'house_of_qui',
      autoLoadEntities: true,
      synchronize: true
    }),
    MonarchModule,
    RightMinisterModule,
    PluginModule,
    PackagesModule,
    AuditModule,
    SystemConfigModule,
    ArchiveModule,
    RecoveryModule,
    SentryModule,
    CommunicationModule,
    ShadowModule,
    LogisticsModule,
    TreasuryModule,
    CommandModule,
    WatchtowerModule,
    CartographerModule,
    ScribeModule,
    GlobalSecurityModule,
    AuthModule,
    SystemMonitorModule
  ],
})
export class AppModule { }