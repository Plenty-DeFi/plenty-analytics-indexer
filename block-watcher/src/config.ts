import { Config } from "./types";

export const config: Config = {
  heartbeatURL: process.env.HEARTBEAT || "https://cronitor.link/p/f2b147ded5de476180d0eac01c1502f6/KY9GM7",
  tezosRpcURL: process.env.TEZOS_RPC_URL || "https://mainnet.smartpy.io",
  broadcastAddress: process.env.BROADCAST_ADDRESS || "255.255.255.255",
  ports: process.env.PORTS || "6024",
};
