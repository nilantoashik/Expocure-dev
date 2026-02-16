import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity.js';
import { ProjectImage } from './entities/project-image.entity.js';
import { Skill } from '../skills/entities/skill.entity.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(ProjectImage)
    private readonly imagesRepository: Repository<ProjectImage>,
    @InjectRepository(Skill)
    private readonly skillsRepository: Repository<Skill>,
  ) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 200);
  }

  private async generateUniqueSlug(title: string, userId: string): Promise<string> {
    let slug = this.slugify(title);
    let counter = 0;
    let candidate = slug;

    while (true) {
      const existing = await this.projectsRepository.findOne({
        where: { slug: candidate, userId },
      });
      if (!existing) return candidate;
      counter++;
      candidate = `${slug}-${counter}`;
    }
  }

  async create(userId: string, dto: CreateProjectDto): Promise<Project> {
    const slug = await this.generateUniqueSlug(dto.title, userId);

    let techStack: Skill[] = [];
    if (dto.techStackIds?.length) {
      techStack = await this.skillsRepository.findByIds(dto.techStackIds);
    }

    const project = this.projectsRepository.create({
      ...dto,
      slug,
      userId,
      techStack,
    });

    return this.projectsRepository.save(project);
  }

  async findAllByUser(userId: string, status?: string): Promise<Project[]> {
    const where: any = { userId };
    if (status) where.status = status;
    return this.projectsRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['user', 'images', 'techStack'],
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async findPublicBySlug(username: string, slug: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { slug, status: 'published', user: { username } },
      relations: ['user', 'images', 'techStack'],
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, userId: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.findById(id);
    if (project.userId !== userId) throw new ForbiddenException('Not your project');

    let techStack: Skill[] | undefined;
    if ((dto as any).techStackIds) {
      techStack = await this.skillsRepository.findByIds((dto as any).techStackIds);
    }

    const { techStackIds, ...updateData } = dto as any;
    Object.assign(project, updateData);
    if (techStack) project.techStack = techStack;

    return this.projectsRepository.save(project);
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.findById(id);
    if (project.userId !== userId) throw new ForbiddenException('Not your project');
    await this.projectsRepository.remove(project);
  }

  async publish(id: string, userId: string): Promise<Project> {
    const project = await this.findById(id);
    if (project.userId !== userId) throw new ForbiddenException('Not your project');
    project.status = 'published';
    project.publishedAt = new Date();
    return this.projectsRepository.save(project);
  }

  async unpublish(id: string, userId: string): Promise<Project> {
    const project = await this.findById(id);
    if (project.userId !== userId) throw new ForbiddenException('Not your project');
    project.status = 'draft';
    return this.projectsRepository.save(project);
  }

  async addImage(projectId: string, userId: string, imageUrl: string, caption?: string, sortOrder?: number): Promise<ProjectImage> {
    const project = await this.findById(projectId);
    if (project.userId !== userId) throw new ForbiddenException('Not your project');

    const image = this.imagesRepository.create({
      projectId,
      imageUrl,
      caption: caption ?? null,
      sortOrder: sortOrder ?? 0,
    } as Partial<ProjectImage>);
    return this.imagesRepository.save(image) as Promise<ProjectImage>;
  }

  async removeImage(projectId: string, imageId: string, userId: string): Promise<void> {
    const project = await this.findById(projectId);
    if (project.userId !== userId) throw new ForbiddenException('Not your project');

    const image = await this.imagesRepository.findOne({ where: { id: imageId, projectId } });
    if (!image) throw new NotFoundException('Image not found');
    await this.imagesRepository.remove(image);
  }
}
