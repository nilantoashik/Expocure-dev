import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedDeveloper } from './entities/saved-developer.entity.js';
import { User } from '../users/entities/user.entity.js';

@Injectable()
export class SavedDevelopersService {
  constructor(
    @InjectRepository(SavedDeveloper)
    private readonly savedDevRepo: Repository<SavedDeveloper>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async save(recruiterId: string, developerId: string) {
    const developer = await this.usersRepo.findOne({ where: { id: developerId, role: 'developer' as const } });
    if (!developer) throw new NotFoundException('Developer not found');

    const existing = await this.savedDevRepo.findOne({ where: { recruiterId, developerId } });
    if (existing) throw new ConflictException('Developer already saved');

    const saved = this.savedDevRepo.create({ recruiterId, developerId });
    return this.savedDevRepo.save(saved);
  }

  async unsave(recruiterId: string, developerId: string) {
    const record = await this.savedDevRepo.findOne({ where: { recruiterId, developerId } });
    if (!record) throw new NotFoundException('Saved developer not found');
    await this.savedDevRepo.remove(record);
    return { message: 'Developer unsaved' };
  }

  async findAllByRecruiter(recruiterId: string) {
    const saved = await this.savedDevRepo.find({
      where: { recruiterId },
      relations: ['developer'],
      order: { createdAt: 'DESC' },
    });

    return saved.map((s) => {
      const { passwordHash, emailVerificationCode, emailVerificationExpiry, workEmailVerificationCode, workEmailVerificationExpiry, ...dev } = s.developer;
      return {
        id: s.id,
        savedAt: s.createdAt,
        developer: dev,
      };
    });
  }

  async isSaved(recruiterId: string, developerId: string): Promise<boolean> {
    const record = await this.savedDevRepo.findOne({ where: { recruiterId, developerId } });
    return !!record;
  }
}
