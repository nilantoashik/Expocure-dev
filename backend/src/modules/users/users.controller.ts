import { Controller, Get, Post, Patch, Body, Param, Query, UseInterceptors, UploadedFile, NotFoundException, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() currentUser: { id: string }) {
    const user = await this.usersService.findById(currentUser.id);
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash, emailVerificationCode, emailVerificationExpiry, workEmailVerificationCode, workEmailVerificationExpiry, ...profile } = user;
    return profile;
  }

  @Patch('me')
  async updateMe(
    @CurrentUser() currentUser: { id: string },
    @Body() dto: UpdateProfileDto,
  ) {
    const user = await this.usersService.update(currentUser.id, dto);
    const { passwordHash, emailVerificationCode, emailVerificationExpiry, workEmailVerificationCode, workEmailVerificationExpiry, ...profile } = user;
    return profile;
  }

  @Post('me/send-work-email-code')
  @HttpCode(HttpStatus.OK)
  async sendWorkEmailCode(@CurrentUser() currentUser: { id: string }) {
    const user = await this.usersService.findById(currentUser.id);
    if (!user) throw new NotFoundException('User not found');
    if (!user.workEmail) throw new BadRequestException('Set a work email first');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await this.usersService.update(currentUser.id, {
      workEmailVerificationCode: code,
      workEmailVerificationExpiry: expiry,
    } as any);

    console.log(`[WORK EMAIL VERIFICATION] Code for ${user.workEmail}: ${code}`);
    return { message: 'Verification code sent to work email' };
  }

  @Post('me/verify-work-email')
  @HttpCode(HttpStatus.OK)
  async verifyWorkEmail(
    @CurrentUser() currentUser: { id: string },
    @Body() body: { code: string },
  ) {
    const user = await this.usersService.findById(currentUser.id);
    if (!user) throw new NotFoundException('User not found');

    if (!user.workEmailVerificationCode || !user.workEmailVerificationExpiry) {
      throw new BadRequestException('No verification code pending');
    }

    if (new Date() > new Date(user.workEmailVerificationExpiry)) {
      throw new BadRequestException('Verification code expired');
    }

    if (user.workEmailVerificationCode !== body.code) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.usersService.update(currentUser.id, {
      isWorkEmailVerified: true,
      workEmailVerificationCode: null,
      workEmailVerificationExpiry: null,
    } as any);

    return { message: 'Work email verified successfully' };
  }

  @Patch('me/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (_req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(new Error('Only image files are allowed'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async updateAvatar(
    @CurrentUser() currentUser: { id: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const avatarUrl = `/uploads/avatars/${file.filename}`;
    await this.usersService.update(currentUser.id, { avatarUrl } as any);
    return { avatarUrl };
  }

  @Public()
  @Get('developers')
  async getDevelopers(@Query('search') search?: string) {
    return this.usersService.findDevelopers(search);
  }

  @Public()
  @Get(':username')
  async getPublicProfile(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash, emailVerificationCode, emailVerificationExpiry, workEmailVerificationCode, workEmailVerificationExpiry, ...profile } = user;
    return profile;
  }
}
