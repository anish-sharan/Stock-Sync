import { DataSource } from 'typeorm';
import { ConfigService } from '@core/config/config';

const config = new ConfigService();

export const AppDataSource = new DataSource({
	type: 'postgres',
	...config.getDatabaseConfig()
});
