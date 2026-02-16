import { IsString, IsOptional, MaxLength, IsArray, IsNumber } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  goals?: string;

  @IsOptional()
  @IsString()
  developmentProcess?: string;

  @IsOptional()
  @IsString()
  challenges?: string;

  @IsOptional()
  @IsString()
  outcomes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  projectUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  repoUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  thumbnailUrl?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  techStackIds?: number[];
}
