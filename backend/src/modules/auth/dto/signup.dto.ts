import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional, IsIn } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(150)
  fullName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, {
    message: 'Username must be lowercase alphanumeric with optional hyphens',
  })
  username: string;

  @IsOptional()
  @IsIn(['developer', 'recruiter'])
  role?: 'developer' | 'recruiter';

  @IsOptional()
  @IsString()
  @MaxLength(200)
  companyName?: string;
}
