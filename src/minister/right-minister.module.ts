import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { RightMinisterService } from './right-minister.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [RightMinisterService],
  exports: [RightMinisterService]
})
export class RightMinisterModule {}