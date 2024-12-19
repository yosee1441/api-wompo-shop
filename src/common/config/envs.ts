import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  URL_BASE: string;
  API_KEY_PUB_WOMPO: string;
  API_KEY_PRV_WOMPO: string;
  API_KEY_EVENTS_WOMPO: string;
  API_KEY_INTEGRITY_WOMPO: string;
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_DB: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
}

const envsSchema = joi
  .object<EnvVars>({
    PORT: joi.number().required(),
    URL_BASE: joi.string().required(),
    API_KEY_PUB_WOMPO: joi.string().required(),
    API_KEY_PRV_WOMPO: joi.string().required(),
    API_KEY_EVENTS_WOMPO: joi.string().required(),
    API_KEY_INTEGRITY_WOMPO: joi.string().required(),
    POSTGRES_HOST: joi.string().required(),
    POSTGRES_PORT: joi.number().required(),
    POSTGRES_DB: joi.string().required(),
    POSTGRES_USER: joi.string().required(),
    POSTGRES_PASSWORD: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  urlBase: envVars.URL_BASE,
  apiKeyPubWompo: envVars.API_KEY_PUB_WOMPO,
  apiKeyPrvWompo: envVars.API_KEY_PRV_WOMPO,
  apiKeyEventsWompo: envVars.API_KEY_EVENTS_WOMPO,
  apiKeyIntegrityWompo: envVars.API_KEY_INTEGRITY_WOMPO,
  postGresHost: envVars.POSTGRES_HOST,
  postGresPort: envVars.POSTGRES_PORT,
  postGresDb: envVars.POSTGRES_DB,
  postGresUser: envVars.POSTGRES_USER,
  postGresPassword: envVars.POSTGRES_PASSWORD,
};
