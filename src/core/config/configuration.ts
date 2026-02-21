import { ConfigService as NestConfigService } from '@nestjs/config';

const configuration = () => ({
  port: parseInt(process.env.PORT ?? '', 10),
  database: {
    url: process.env.DATABASE_URL?.toString() ?? '',
  },
  keyCrmApi: process.env.KEYCRM_API?.toString() ?? '',
});

export type Configuration = ReturnType<typeof configuration>;

export type ConfigService = NestConfigService<Configuration>;

export default configuration;
