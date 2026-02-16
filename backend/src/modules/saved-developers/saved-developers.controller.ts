import { Controller, Post, Delete, Get, Param, ForbiddenException } from '@nestjs/common';
import { SavedDevelopersService } from './saved-developers.service.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@Controller('saved-developers')
export class SavedDevelopersController {
  constructor(private readonly savedDevService: SavedDevelopersService) {}

  @Post(':developerId')
  async save(
    @CurrentUser() currentUser: { id: string; role?: string },
    @Param('developerId') developerId: string,
  ) {
    return this.savedDevService.save(currentUser.id, developerId);
  }

  @Delete(':developerId')
  async unsave(
    @CurrentUser() currentUser: { id: string; role?: string },
    @Param('developerId') developerId: string,
  ) {
    return this.savedDevService.unsave(currentUser.id, developerId);
  }

  @Get()
  async findAll(@CurrentUser() currentUser: { id: string; role?: string }) {
    return this.savedDevService.findAllByRecruiter(currentUser.id);
  }

  @Get(':developerId/status')
  async checkStatus(
    @CurrentUser() currentUser: { id: string },
    @Param('developerId') developerId: string,
  ) {
    const saved = await this.savedDevService.isSaved(currentUser.id, developerId);
    return { saved };
  }
}
