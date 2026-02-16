import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @OneToMany('Project', 'user')
  projects: any[];
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'full_name', length: 150 })
  fullName: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ type: 'varchar', default: 'developer' })
  role: 'developer' | 'recruiter';

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ name: 'avatar_url', nullable: true, length: 500 })
  avatarUrl: string;

  @Column({ nullable: true, length: 150 })
  location: string;

  @Column({ name: 'website_url', nullable: true, length: 500 })
  websiteUrl: string;

  @Column({ name: 'github_url', nullable: true, length: 500 })
  githubUrl: string;

  @Column({ name: 'linkedin_url', nullable: true, length: 500 })
  linkedinUrl: string;

  @Column({ name: 'twitter_url', nullable: true, length: 500 })
  twitterUrl: string;

  @Column({ name: 'company_name', nullable: true, length: 200 })
  companyName: string;

  @Column({ name: 'company_url', nullable: true, length: 500 })
  companyUrl: string;

  @Column({ nullable: true, length: 150 })
  industry: string;

  @Column({ name: 'work_email', nullable: true })
  workEmail: string;

  @Column({ name: 'is_work_email_verified', default: false })
  isWorkEmailVerified: boolean;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'email_verification_code', type: 'varchar', nullable: true, length: 6 })
  emailVerificationCode: string | null;

  @Column({ name: 'email_verification_expiry', type: 'datetime', nullable: true })
  emailVerificationExpiry: Date | null;

  @Column({ name: 'work_email_verification_code', type: 'varchar', nullable: true, length: 6 })
  workEmailVerificationCode: string | null;

  @Column({ name: 'work_email_verification_expiry', type: 'datetime', nullable: true })
  workEmailVerificationExpiry: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
