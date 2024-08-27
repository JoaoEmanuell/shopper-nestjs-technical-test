import { registerAs } from '@nestjs/config';
import { Measure } from '../app.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

const config = {
  type: 'sqlite',
  database: './src/database/db.sqlite',
  entities: [Measure],
  autoLoadEntities: true,
  migrations: ['./src/migrations/*.ts'],
  migrationsRun: true,
  synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
