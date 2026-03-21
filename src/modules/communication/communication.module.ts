import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImperialEvent } from './entities/event.entity';
import { CommunicationService } from './communication.service';
import { CommunicationController } from './communication.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ImperialEvent])],
    providers: [CommunicationService],
    controllers: [CommunicationController],
    exports: [CommunicationService]
})
export class CommunicationModule { }
