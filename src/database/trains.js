import 'dotenv/config';
import { createDatabasePool } from './connection.js';

export const trainsPool = createDatabasePool(
  process.env.TRAINS_JDBC_CONNECTION_STRING,
  'Trains database',
);
