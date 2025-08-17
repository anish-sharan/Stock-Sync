import { ILogger } from '@core/logger/logger.interface';
import TYPES from '@core/types';
import { inject, injectable } from 'inversify';
import { DataSource } from 'typeorm';
import { AppDataSource } from './database.config';

@injectable()
export class DatabaseService {
	private dataSource: DataSource;

	constructor(@inject(TYPES.Logger) private readonly logger: ILogger) {
		this.dataSource = AppDataSource;
	}

	async initialize(): Promise<DataSource> {
		try {
			if (!this.dataSource.isInitialized) {
				await this.dataSource.initialize();
				this.logger.info('Database connection established');
			}
			return this.dataSource;
		} catch (error) {
			this.logger.error('Database connection failed', error as Error);
			throw error;
		}
	}

	getDataSource(): DataSource {
		return this.dataSource;
	}
}
