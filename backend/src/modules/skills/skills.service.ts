import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Skill } from './entities/skill.entity.js';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillsRepository: Repository<Skill>,
  ) {}

  async findAll(search?: string, category?: string): Promise<Skill[]> {
    const where: any = {};
    if (search) where.name = Like(`%${search}%`);
    if (category) where.category = category;
    return this.skillsRepository.find({ where, order: { name: 'ASC' } });
  }
}
