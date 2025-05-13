import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

export type ConfigType = {
  API_PORT: number;
  BOT_TOKEN: string;
  DB_URI: string;
  NODE_ENV: string;
  BOT_USERNAME: string;
  PUBLIC_URL: string;
};
const requiredVariables = [
  'API_PORT',
  'BOT_TOKEN',
  'NODE_ENV',
  'DEV_DB_URL',
  'BOT_USERNAME',
  'PROD_DB_URL',
  'PUBLIC_URL',
];
const missingVariables = requiredVariables.filter((variable) => {
  const value = process.env[variable];
  return !value || value.trim() === '';
});
if (missingVariables.length > 0) {
  Logger.error(
    `Missing or empty required enviroment variables: ${missingVariables.join(',')}`,
  );
  process.exit(1);
}
export const config: ConfigType = {
  API_PORT: parseInt(process.env.API_PORT as string, 10),
  BOT_TOKEN: process.env.BOT_TOKEN as string,
  NODE_ENV: process.env.NODE_ENV as string,
  BOT_USERNAME: process.env.BOT_USERNAME as string,
  PUBLIC_URL: process.env.PUBLIC_URL as string,
  DB_URI:
    process.env.NODE_ENV == 'dev'
      ? (process.env.DEV_DB_URL as string)
      : (process.env.PROD_DB_URL as string),
};
export * from './telegram.config';
