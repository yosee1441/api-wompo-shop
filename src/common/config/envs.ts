import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  URL_BASE: string;
  API_KEY_PUB_WOMPO: string;
  API_KEY_PRV_WOMPO: string;
  API_KEY_EVENTS_WOMPO: string;
  API_KEY_INTEGRITY_WOMPO: string;
}

const envsSchema = joi
  .object<EnvVars>({
    PORT: joi.number().required(),
    URL_BASE: joi.string().required(),
    API_KEY_PUB_WOMPO: joi.string().required(),
    API_KEY_PRV_WOMPO: joi.string().required(),
    API_KEY_EVENTS_WOMPO: joi.string().required(),
    API_KEY_INTEGRITY_WOMPO: joi.string().required(),
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
};
