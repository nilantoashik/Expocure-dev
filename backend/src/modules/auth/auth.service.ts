import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { SignupDto } from './dto/signup.dto.js';
import { SigninDto } from './dto/signin.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { User } from '../users/entities/user.entity.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async signup(dto: SignupDto) {
    const existingEmail = await this.usersService.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    const existingUsername = await this.usersService.findByUsername(dto.username);
    if (existingUsername) {
      throw new ConflictException('Username already taken');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const verificationCode = this.generateVerificationCode();
    const verificationExpiry = new Date(Date.now() + 15 * 60 * 1000);

    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      username: dto.username,
      role: dto.role || 'developer',
      companyName: dto.companyName || null,
      emailVerificationCode: verificationCode,
      emailVerificationExpiry: verificationExpiry,
    });

    console.log(`[EMAIL VERIFICATION] Code for ${dto.email}: ${verificationCode}`);

    const tokens = this.generateTokens(user.id, user.email);
    return {
      ...tokens,
      user: this.sanitizeUser(user),
    };
  }

  async verifyEmail(userId: string, code: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.isEmailVerified) {
      return { message: 'Email already verified' };
    }

    if (!user.emailVerificationCode || !user.emailVerificationExpiry) {
      throw new BadRequestException('No verification code pending. Request a new one.');
    }

    if (new Date() > new Date(user.emailVerificationExpiry)) {
      throw new BadRequestException('Verification code expired. Request a new one.');
    }

    if (user.emailVerificationCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.usersService.update(userId, {
      isEmailVerified: true,
      emailVerificationCode: null,
      emailVerificationExpiry: null,
    } as any);

    return { message: 'Email verified successfully' };
  }

  async resendVerification(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.isEmailVerified) {
      return { message: 'Email already verified' };
    }

    const verificationCode = this.generateVerificationCode();
    const verificationExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await this.usersService.update(userId, {
      emailVerificationCode: verificationCode,
      emailVerificationExpiry: verificationExpiry,
    } as any);

    console.log(`[EMAIL VERIFICATION] New code for ${user.email}: ${verificationCode}`);

    return { message: 'Verification code resent' };
  }

  async signin(dto: SigninDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokens(user.id, user.email);
    return {
      ...tokens,
      user: this.sanitizeUser(user),
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return this.generateTokens(payload.sub, payload.email || '');
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  logout() {
    return { message: 'Logged out successfully' };
  }

  private generateTokens(userId: string, email: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId, email },
      { expiresIn: this.configService.get<string>('JWT_EXPIRATION', '1d') as any },
    );
    const refreshToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d') as any },
    );
    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: User) {
    const {
      passwordHash,
      emailVerificationCode,
      emailVerificationExpiry,
      workEmailVerificationCode,
      workEmailVerificationExpiry,
      ...sanitized
    } = user;
    return sanitized;
  }
}
