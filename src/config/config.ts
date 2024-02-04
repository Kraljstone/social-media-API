import { ConfigProps } from './config.interface';

export const config = (): ConfigProps => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  mongodb: {
    database: {
      connectionString:
        process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017',
      databaseName: process.env.NODE_ENV || 'local',
    },
  },
});
