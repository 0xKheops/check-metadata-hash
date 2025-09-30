import type { SubstrateNetwork } from "./networks";

type ChaindataNetwork = {
  name: string;
  hasCheckMetadataHash?: boolean;
  platform: string;
  nativeCurrency: { decimals: number; symbol: string };
  rpcs: string[];
};

const toSubstrateNetwork = (network: ChaindataNetwork): SubstrateNetwork => {
  return {
    name: network.name,
    rpcUrl: network.rpcs,
    tokenInfo: {
      tokenSymbol: network.nativeCurrency.symbol,
      decimals: network.nativeCurrency.decimals,
    },
  };
};

export const getChaindataNetworks = async () => {
  const res = await fetch(
    "https://raw.githubusercontent.com/TalismanSociety/chaindata/main/pub/v5/chaindata.min.json"
  );
  if (!res.ok) throw new Error("failed to fetch chaindata");
  const chaindata = (await res.json()) as {
    networks: ChaindataNetwork[];
  };
  return chaindata.networks
    .filter((n) => n.platform === "polkadot" && !!n.hasCheckMetadataHash)
    .map(toSubstrateNetwork);
};
