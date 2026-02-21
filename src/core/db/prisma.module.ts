import { Global, Module } from '@nestjs/common';
import {
  ConfigModule,
  ConfigService as NestConfigService,
} from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
import { Pool } from 'pg';
import { ConfigService } from '../config/configuration';

@Global()
@Module({
  imports: [ConfigModule], // Импортируем ConfigModule
  providers: [
    {
      provide: 'PrismaService',
      useFactory: async (configService: ConfigService) => {
        // Получаем DATABASE_URL из конфига
        const database = configService.get<{ url: string }>('database');

        // Создаем Pool для pg adapter
        const pool = new Pool({
          connectionString: database?.url ?? '',
        });

        // Создаем adapter с pool
        const adapter = new PrismaPg(pool);

        // Создаем Prisma Client с adapter
        const prisma = new PrismaClient({ adapter });

        await prisma.$connect();

        return prisma;
      },
      inject: [NestConfigService],
    },
  ],
  exports: ['PrismaService'],
})
export class PrismaModule {}
