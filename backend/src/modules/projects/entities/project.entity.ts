import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, OneToMany, ManyToMany, JoinColumn, JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Skill } from '../../skills/entities/skill.entity.js';
import { ProjectImage } from './project-image.entity.js';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 200 })
  slug: string;

  @Column('text')
  description: string;

  @Column('text', { nullable: true })
  goals: string;

  @Column('text', { name: 'development_process', nullable: true })
  developmentProcess: string;

  @Column('text', { nullable: true })
  challenges: string;

  @Column('text', { nullable: true })
  outcomes: string;

  @Column({ name: 'project_url', nullable: true, length: 500 })
  projectUrl: string;

  @Column({ name: 'repo_url', nullable: true, length: 500 })
  repoUrl: string;

  @Column({ name: 'thumbnail_url', nullable: true, length: 500 })
  thumbnailUrl: string;

  @Column({ type: 'varchar', default: 'draft' })
  status: 'draft' | 'published';

  @Column({ name: 'published_at', type: 'datetime', nullable: true })
  publishedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => ProjectImage, (img) => img.project, { cascade: true, eager: true })
  images: ProjectImage[];

  @ManyToMany(() => Skill, { eager: true })
  @JoinTable({
    name: 'project_tech_stack',
    joinColumn: { name: 'project_id' },
    inverseJoinColumn: { name: 'skill_id' },
  })
  techStack: Skill[];
}
