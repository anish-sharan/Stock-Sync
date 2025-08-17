import 'reflect-metadata';
import AuthProvider from '@core/auth/auth-provider';
import { ConfigService } from '@core/config/config';
import { DatabaseService } from '@core/database/database.service';
import container from '@core/di/inversify.config';
import { ErrorHandlerMiddleware } from '@core/error/errorHandling.middleware';
import TYPES from '@core/types';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { inject, injectable } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Logger } from 'winston';
import { HttpContextMiddleware } from '@core/context/http-context.middleware';
import { EventHandlerLoaderService } from '@core/eventBus/service/event.handler.loader.service';

@injectable()
export class Application {
	private app: express.Application | undefined;
	private server: InversifyExpressServer;

	constructor(
		@inject(TYPES.Logger) private logger: Logger,
		@inject(TYPES.Config) private configService: ConfigService,
		@inject(TYPES.Database) private databaseService: DatabaseService,
		@inject(TYPES.ErrorHandler) private errorHandler: ErrorHandlerMiddleware,
		@inject(HttpContextMiddleware) private httpContextImplantor: HttpContextMiddleware,
		@inject(TYPES.EventHandlerLoaderService) private eventHandlerLoader: EventHandlerLoaderService,
	) {
		this.server = new InversifyExpressServer(container, null, null, null, AuthProvider);
	}

	async initialize(): Promise<void> {
		this.server.setConfig(app => {
			app.set('trust proxy', 1); // Enable trusting 'X-Forwarded-For' headers for AWS
			app.use(express.json());
			app.use(express.urlencoded({ extended: true }));
			app.use(helmet());
			app.use(compression());
			app.use(cors(this.configService.getCorsConfig()));
			app.use('/api/', rateLimit(this.configService.getApiLimiterConfig()));
			app.use(this.httpContextImplantor.handler.bind(this.httpContextImplantor));

			app.use((req, res, next) => {
				this.logger.debug(`${req.method} ${req.url}`, {
					body: req.body,
					query: req.query,
					params: req.params
				});
				next();
			});
		});

		this.server.setErrorConfig(app => {
			app.use(this.errorHandler.handle.bind(this.errorHandler));
		});
	}

	async start(): Promise<void> {
		// Initialize the server
		this.app = this.server.build();
		const serverConfig = this.configService.getServerConfig();
		this.app.get('/health', (req, res) => {
			res.status(200).send(`BE is running!`);
		});

		return new Promise(resolve => {
			// Initialize database connection
			this.databaseService.initialize();
			// Initialize event handlers
			this.eventHandlerLoader.loadEventHandlers();
			// Start the server
			this.app?.listen(serverConfig.port, () => {
				this.logger.info(`Server running in ${serverConfig.environment} mode on port ${serverConfig.port}`);
				resolve();
			});
		});
	}

	getExpressApp(): express.Application | undefined {
		return this.app;
	}
}
