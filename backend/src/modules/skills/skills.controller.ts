import { Controller, Get, Query } from '@nestjs/common';
import { SkillsService } from './skills.service.js';
import { Public } from '../../common/decorators/public.decorator.js';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Public()
  @Get()
  findAll(@Query('search') search?: string, @Query('category') category?: string) {
    return this.skillsService.findAll(search, category);
  }
}
