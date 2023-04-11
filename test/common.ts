import dotEnvExtended from 'dotenv-extended';

const env = process.env.NODE_ENV;
const envFile = process.env.NODE_ENV ? `.env.${env}` : '.env';
/**
 * Assigns environment variables based on environment.
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
dotEnvExtended.load({
  silent: false,
  defaults: '.env.defaults',
  schema: '.env.schema',
  errorOnMissing: false,
  errorOnExtra: true,
  path: envFile,
});
