import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImperialUser } from './entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SealChallengeService } from './challenge.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImperialUser])
  ],
  providers: [AuthService, SealChallengeService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
