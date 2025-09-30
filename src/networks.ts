export type SubstrateNetwork = {
  name: string;
  rpcUrl: string;
  tokenInfo: {
    tokenSymbol: string;
    decimals: number;
  };
};

export const NETWORKS: Record<string, SubstrateNetwork> = {
  polkadot: {
    name: "Polkadot",
    rpcUrl: "wss://rpc.ibp.network/polkadot",
    tokenInfo: {
      tokenSymbol: "DOT",
      decimals: 10,
    },
  },
  polkadotAssetHub: {
    name: "Polkadot Asset Hub",
    // rpcUrl: "ws://localhost:8001", // chopsticks
    rpcUrl: "wss://sys.ibp.network/statemint",
    tokenInfo: {
      tokenSymbol: "DOT",
      decimals: 10,
    },
  },
  kusama: {
    name: "Kusama",
    rpcUrl: "wss://rpc.ibp.network/kusama",
    tokenInfo: {
      tokenSymbol: "KSM",
      decimals: 12,
    },
  },
  kusamaAssetHub: {
    name: "Kusama Asset Hub",
    // rpcUrl: "ws://localhost:8000", // chopsticks
    rpcUrl: "wss://sys.ibp.network/asset-hub-kusama",
    tokenInfo: {
      tokenSymbol: "KSM",
      decimals: 12,
    },
  },
  paseo: {
    name: "Paseo",
    rpcUrl: "wss://rpc.ibp.network/paseo",
    tokenInfo: {
      tokenSymbol: "PAS",
      decimals: 12,
    },
  },
  passetHub: {
    name: "Passet Hub",
    rpcUrl: "wss://sys.ibp.network/asset-hub-paseo",
    tokenInfo: {
      tokenSymbol: "PASET",
      decimals: 12,
    },
  },
};
