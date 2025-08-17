import { config } from 'dotenv';
import { injectable } from 'inversify';
import { z } from 'zod';
import { ApiLimiterConfig, CorsConfig, DatabaseConfig, ServerConfig } from './config.types';

config();

const envSchema = z.object({
	NODE_ENV: z.enum(['local', 'development', 'test', 'production']).default('development'),
	APP_PORT: z.string().transform(Number).pipe(z.number().positive()).default('8080'),
	SERVER_HOST: z.string().default('localhost'),
	SERVER_URL: z.string().url().default('http://localhost:8080'),
	FE_APP_URL: z.string().default('http://localhost:5173'),
	SERVER_LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('silly'),
	// Database Config
	PG_HOST: z.string().default('localhost'),
	PG_PORT: z.coerce.number().positive().default(5432),
	PG_USER: z.string().default('postgres'),
	PG_PASSWORD: z.string().default('postgres'),
	PG_DATABASE_NAME: z.string().default('postgres'),
	PG_LOGGING: z.coerce.boolean().default(false),
	// Rate Limiter Config
	RATE_LIMIT_MAX: z.string().transform(Number).pipe(z.number().positive()).default('200'),
	RATE_LIMIT_WINDOW_MS: z.string().transform(Number).pipe(z.number().positive()).default('900000')
});

const parsedEnv = envSchema.safeParse(process.env);

type ValidatedEnvironment = z.infer<typeof envSchema>;

if (!parsedEnv.success) {
	console.error('❌ Invalid environment variables:', parsedEnv.error.format());
	throw new Error('Invalid environment variables');
}

const validatedEnv = parsedEnv.data;



@injectable()
export class ConfigService {
	private readonly env: ValidatedEnvironment;

	constructor() {
		this.env = validatedEnv;
	}

	getServerConfig(): ServerConfig {
		return {
			port: this.env.APP_PORT,
			host: this.env.SERVER_HOST,
			url: this.env.SERVER_URL,
			logLevel: this.env.SERVER_LOG_LEVEL,
			environment: this.env.NODE_ENV,
			isProduction: () => this.env.NODE_ENV === 'production',
			frontendUrl: this.env.FE_APP_URL,
			logoUrl: this.env.FE_APP_URL.replace('login', '') + '/assets/ReboundLogo-TvE3DlJl.svg'
		};
	}

	getDatabaseConfig(): DatabaseConfig {
		const entities = ['src/features/**/entities/*.entity.ts'];

		return {
			port: this.env.PG_PORT,
			host: this.env.PG_HOST,
			username: this.env.PG_USER,
			password: this.env.PG_PASSWORD,
			database: this.env.PG_DATABASE_NAME,
			logging: false,//this.env.PG_LOGGING,
			entities,
			ssl: { rejectUnauthorized: false },
			synchronize: true
		};
	}

	getCorsConfig(): CorsConfig {
		const allowedOrigins = ['http://localhost:5173', this.env.FE_APP_URL, this.env.SERVER_URL];

		return {
			origin: allowedOrigins,
			methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
			credentials: true,
			maxAge: 3600 // 1 hour
		};
	}

	getApiLimiterConfig(): ApiLimiterConfig {
		return {
			max: this.env.RATE_LIMIT_MAX,
			windowMs: this.env.RATE_LIMIT_WINDOW_MS,
			legacyHeaders: false,
			standardHeaders: false,
			message: 'Too many requests, please try again later.',
			statusCode: 429
		};
	}

	get<K extends keyof ValidatedEnvironment>(key: K): ValidatedEnvironment[K] {
		return this.env[key];
	}
}
