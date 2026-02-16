import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(data: {
    email: string;
    passwordHash: string;
    fullName: string;
    username: string;
    role?: 'developer' | 'recruiter';
    companyName?: string | null;
    emailVerificationCode?: string;
    emailVerificationExpiry?: Date;
  }): Promise<User> {
    const user = this.usersRepository.create(data as any);
    return this.usersRepository.save(user) as any;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, data);
    return this.findById(id) as Promise<User>;
  }

  async findDevelopers(search?: string): Promise<any[]> {
    const qb = this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.projects', 'project', 'project.status = :status', { status: 'published' })
      .addSelect('COUNT(project.id)', 'projectCount')
      .where('user.role = :role', { role: 'developer' })
      .andWhere('user.isEmailVerified = :verified', { verified: true })
      .groupBy('user.id');

    if (search) {
      qb.andWhere(
        '(user.fullName LIKE :search OR user.username LIKE :search OR user.bio LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const results = await qb.getRawAndEntities();

    return results.entities.map((user, i) => {
      const { passwordHash, emailVerificationCode, emailVerificationExpiry, workEmailVerificationCode, workEmailVerificationExpiry, ...safe } = user;
      return {
        ...safe,
        projectCount: parseInt(results.raw[i].projectCount, 10) || 0,
      };
    });
  }
}
