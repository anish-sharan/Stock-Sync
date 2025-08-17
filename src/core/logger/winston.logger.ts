import { ConfigService } from '@core/config/config';
import TYPES from '@core/types';
import { inject, injectable } from 'inversify';
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import { ILogger } from './logger.interface';

@injectable()
export class Logger implements ILogger {
	private logger: WinstonLogger;

	constructor(@inject(TYPES.Config) private readonly config: ConfigService) {
		this.logger = createLogger({
			level: this.config.getServerConfig().logLevel,
			format: format.combine(format.timestamp(), format.json()),
			defaultMeta: { service: 'user-api' },
			transports: [
				new transports.Console({
					format: format.combine(format.colorize(), format.simple())
				})
			]
		});
	}

	debug(message: string, meta?: Record<string, any>): void {
		this.logger.debug(message, meta);
	}

	info(message: string, meta?: Record<string, any>): void {
		this.logger.info(message, meta);
	}

	warn(message: string, meta?: Record<string, any>): void {
		this.logger.warn(message, meta);
	}

	error(message: string, error?: Error, meta?: Record<string, any>): void {
		this.logger.error(message, {
			error: error
				? {
						message: error.message,
						stack: error.stack
					}
				: undefined,
			...meta
		});
	}
}
