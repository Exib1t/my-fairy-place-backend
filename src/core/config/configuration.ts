import { ConfigService as NestConfigService } from '@nestjs/config';

const configuration = () => ({
  port: parseInt(process.env.PORT ?? '', 10),
  keyCrmApi: process.env.KEYCRM_API?.toString() ?? '',
  adminApiKey: process.env.ADMIN_API_KEY?.toString() ?? '',
  managerApiKey: process.env.MANAGER_API_KEY?.toString() ?? '',
});

export type Configuration = ReturnType<typeof configuration>;

export type ConfigService = NestConfigService<Configuration>;

export default configuration;
