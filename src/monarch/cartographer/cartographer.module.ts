import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { ImperialEvent } from '../../modules/communication/entities/event.entity';
import { CartographerService } from './cartographer.service';
import { CartographerController } from './cartographer.controller';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ImperialEvent])
  ],
  providers: [CartographerService],
  controllers: [CartographerController],
  exports: [CartographerService]
})
export class CartographerModule {}
