import { DataSource, DataSourceOptions } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.ELEPHANT_URL,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  migrationsTransactionMode: 'each',
  synchronize: false,
  extra: {
    timezone: 'local',
  },
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
