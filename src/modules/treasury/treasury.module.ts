import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { CreditTransaction } from './entities/transaction.entity';
import { Project } from '../../monarch/entities/project.entity';
import { TreasuryService } from './treasury.service';
import { TreasuryController } from './treasury.controller';
import { MonarchModule } from '../../monarch/monarch.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, CreditTransaction, Project]),
    MonarchModule
  ],
  providers: [TreasuryService],
  controllers: [TreasuryController],
  exports: [TreasuryService]
})
export class TreasuryModule {}
