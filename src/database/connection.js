import mysql from 'mysql2/promise';

function parseJdbcConnectionString(connectionString, databaseLabel) {
  if (!connectionString) {
    throw new Error(`${databaseLabel} JDBC connection string is not configured.`);
  }

  const jdbcPrefix = 'jdbc:';
  if (!connectionString.startsWith(jdbcPrefix)) {
    throw new Error(`${databaseLabel} connection string must start with jdbc:.`);
  }

  const mysqlUrl = connectionString.slice(jdbcPrefix.length);
  const url = new URL(mysqlUrl);

  if (url.protocol !== 'mysql:') {
    throw new Error(`${databaseLabel} connection string must use the mysql protocol.`);
  }

  const connectionConfig = {
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    database: decodeURIComponent(url.pathname.replace(/^\/+/, '')),
  };

  if (url.username) {
    connectionConfig.user = decodeURIComponent(url.username);
  }

  if (url.password) {
    connectionConfig.password = decodeURIComponent(url.password);
  }

  for (const [key, value] of url.searchParams) {
    if (key === 'user' || key === 'username') {
      connectionConfig.user = value;
    } else if (key === 'password') {
      connectionConfig.password = value;
    }
  }

  if (!connectionConfig.host || !connectionConfig.database) {
    throw new Error(`${databaseLabel} connection string is missing a host or database.`);
  }

  return connectionConfig;
}

export function createDatabasePool(connectionString, databaseLabel) {
  return mysql.createPool({
    ...parseJdbcConnectionString(connectionString, databaseLabel),
    waitForConnections: true,
    connectionLimit: 5,
    enableKeepAlive: true,
  });
}
