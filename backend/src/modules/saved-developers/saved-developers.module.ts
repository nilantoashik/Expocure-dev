import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedDeveloper } from './entities/saved-developer.entity.js';
import { User } from '../users/entities/user.entity.js';
import { SavedDevelopersService } from './saved-developers.service.js';
import { SavedDevelopersController } from './saved-developers.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([SavedDeveloper, User])],
  controllers: [SavedDevelopersController],
  providers: [SavedDevelopersService],
})
export class SavedDevelopersModule {}
