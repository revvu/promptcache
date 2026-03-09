import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

export const databaseConfigured = Boolean(connectionString);

export const sql = connectionString
  ? postgres(connectionString, {
      ssl: 'require',
      max: 1,
      idle_timeout: 5,
      connect_timeout: 5,
      prepare: false
    })
  : null;
