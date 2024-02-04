interface MongodbConfigProps {
  connectionString: string;
  databaseName: string;
}

export interface ConfigProps {
  port: number;
  mongodb: {
    database: MongodbConfigProps;
  };
}
