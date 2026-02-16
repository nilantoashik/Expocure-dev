import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  useFactory: (configService: ConfigService) => {
    const dbType = configService.get<string>('DB_TYPE', 'sqlite');

    if (dbType === 'postgres') {
      return {
        type: 'postgres' as const,
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get<string>('DATABASE_USER', 'postgres'),
        password: configService.get<string>('DATABASE_PASSWORD', 'postgres'),
        database: configService.get<string>('DATABASE_NAME', 'expocure_db'),
        autoLoadEntities: true,
        synchronize: true,
      };
    }

    return {
      type: 'better-sqlite3' as const,
      database: join(__dirname, '..', '..', 'expocure.db'),
      autoLoadEntities: true,
      synchronize: true,
    };
  },
  inject: [ConfigService],
};
