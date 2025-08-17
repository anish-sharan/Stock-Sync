export interface ServerConfig {
    port: number;
    host: string;
    url: string;
    logLevel: string;
    environment: string;
    frontendUrl: string;
    isProduction(): boolean;
    logoUrl?: string;
}


export interface DatabaseConfig {
    port: number;
    host: string;
    username: string;
    password: string;
    database: string;
    logging: boolean;
    entities: string[];
    ssl: false | { rejectUnauthorized: boolean };
    synchronize: boolean;
}

export interface CorsConfig {
    origin: string[];
    methods: string[];
    allowedHeaders: string[];
    credentials: boolean;
    maxAge: number;
}

export interface ApiLimiterConfig {
    max: number;
    windowMs: number;
    legacyHeaders: boolean;
    standardHeaders: boolean;
    message: string;
    statusCode: number;
}