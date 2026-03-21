import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsaService } from './isa.service';
import { AuditModule } from '../audit/audit.module';

@Global()
@Module({
  imports: [
    AuditModule,
  ],
  providers: [IsaService],
  exports: [IsaService],
})
export class GlobalSecurityModule {}
