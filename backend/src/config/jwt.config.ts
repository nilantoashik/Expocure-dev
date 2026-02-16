import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET', 'expocure-dev-secret'),
    signOptions: {
      expiresIn: configService.get<string>('JWT_EXPIRATION', '1d') as any,
    },
  }),
  inject: [ConfigService],
};
