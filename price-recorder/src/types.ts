import DatabaseClient from "./infrastructure/DatabaseClient";
import TzktProvider from "./infrastructure/TzktProvider";

export interface Config {
  heartbeatURL: string;
  tzktURL: string;
  port: string;
  tzktLimit: number;
  tzktOffset: number;
  sharedDirectory: string;
  postgres: {
    username: string;
    database: string;
    password: string;
    host: string;
  };
}

export interface Contracts {
  amm: {
    [key: string]: {
      token1: string;
      token2: string;
    };
  };
  tokens: {
    [key: string]: {
      decimals: number;
      priceDepth: number;
    };
  };
}

export interface Dependecies {
  config: Config;
  dbClient: DatabaseClient;
  tzktProvider: TzktProvider;
  contracts: Contracts;
}

export interface BlockData {
  hash: string;
  timestamp: string;
}

export interface DatabaseGetParams {
  table: string;
  select: string;
  where: string;
}

export interface DatabaseInsertParams {
  table: string;
  columns: string;
  values: string;
}

export interface DatabaseUpdateParams {
  table: string;
  set: string;
  where: string;
}

export interface AMMStorage {
  token1Id: string;
  token2Id: string;
  token1_pool: string;
  token2_pool: string;
  token1Address: string;
  token2Address: string;
}

export interface GetTransactionParameters {
  contract: string;
  entrypoint: string[];
  firstLevel: number;
  lastLevel: number;
  limit: number;
  offset: number;
  select: string;
}

export interface Transaction {
  id: number;
  level: number;
  hash: number;
  timestamp: string;
  sender: {
    address: string;
  };
  target:
    | {
        address: string;
      }
    | undefined;
  initiator:
    | {
        address: string;
      }
    | undefined;
  amount: number;
  parameter:
    | {
        entrypoint: string;
        value: any;
      }
    | undefined;
  storage: any;
}
