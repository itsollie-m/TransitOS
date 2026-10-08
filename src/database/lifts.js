import 'dotenv/config';
import { createDatabasePool } from './connection.js';

export const liftsPool = createDatabasePool(
  process.env.LIFTS_JDBC_CONNECTION_STRING,
  'Lifts database',
);
