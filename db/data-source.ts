import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  migrationsTableName: 'migrations',
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Asdfasdf123',
  database: 'lidz',
  logging: false,
  synchronize: false,
  name: 'default',
  entities: ['dist/src/modules/**/**.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/**/*{.ts,.js}'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
