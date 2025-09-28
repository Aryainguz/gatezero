import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.GATEWAY_PORT, 10) || 3000,
  environment: process.env.NODE_ENV || 'development',
}));