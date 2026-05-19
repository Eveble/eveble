// Only load dotenv if EVEBLE env vars are not already set (e.g. by CI/process env)
if (!process.env.EVEBLE_COMMITSTORE_MONGODB_URL) {
  const dotEnvExtended = require('dotenv-extended');
  const env = process.env.NODE_ENV || 'test';
  const envFile = `.env.${env}`;
  dotEnvExtended.load({
    silent: false,
    defaults: '.env.defaults',
    schema: '.env.schema',
    errorOnMissing: false,
    errorOnExtra: true,
    path: envFile,
  });
}
