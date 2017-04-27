import * as Joi from 'joi';

// require and configure dotenv, will load vars in .env in PROCESS.ENV
import * as dotenv from 'dotenv';
dotenv.config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  JWT_SECRET: Joi.string().required()
    .description('JWT Secret required to sign'),
  MONGOOSE_DEBUG: Joi.boolean()
    .when('NODE_ENV', {
      is: Joi.string().equal('development'),
      otherwise: Joi.boolean().default(false),
      then: Joi.boolean().default(true),
    }),
  MONGO_HOST: Joi.string().required()
    .description('Mongo DB host url'),
  MONGO_PORT: Joi.number()
    .default(27017),
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number()
    .default(4040),
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  jwtSecret: envVars.JWT_SECRET,
  mongo: {
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT,
  },
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  port: envVars.PORT,
};

export default config;
