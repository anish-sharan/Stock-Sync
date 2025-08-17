import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@core/config/config';

const config = new ConfigService();
const dbConfig: DataSourceOptions = {
	type: 'postgres',
	...config.getDatabaseConfig(),
	entities: []
};

export default new DataSource(dbConfig);
