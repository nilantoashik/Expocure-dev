import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

@Entity('saved_developers')
@Unique(['recruiterId', 'developerId'])
export class SavedDeveloper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'recruiter_id' })
  recruiterId: string;

  @Column({ name: 'developer_id' })
  developerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recruiter_id' })
  recruiter: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'developer_id' })
  developer: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
