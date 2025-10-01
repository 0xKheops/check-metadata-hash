import type { Polkadot } from "@polkadot-api/descriptors";
import { createClient, type UnsafeApi } from "polkadot-api";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";
import { toHex } from "polkadot-api/utils";
import { getWsProvider } from "polkadot-api/ws-provider";
import { getMetadataHash } from "./src/getMetadataHash";
import { NETWORKS, type SubstrateNetwork } from "./src/networks";

const tryHashWithMetadataVersion = async (
  api: UnsafeApi<Polkadot>,
  tokenInfo: SubstrateNetwork["tokenInfo"],
  version: number
) => {
  try {
    console.log(
      `metadataHash with v${version}`,
      toHex(await getMetadataHash(api, tokenInfo, version))
    );
  } catch (err) {
    console.error(
      `Failed to get hash with v${version}:`,
      (err as Error).message
    );
  }
};

// check all networks
for (const network of Object.values(NETWORKS)) {
  console.log("Checking", network.name);
  const client = createClient(
    withPolkadotSdkCompat(getWsProvider(network.rpcUrl))
  );

  try {
    const api = client.getUnsafeApi<Polkadot>();
    await tryHashWithMetadataVersion(api, network.tokenInfo, 15);
    await tryHashWithMetadataVersion(api, network.tokenInfo, 16);
  } catch (err) {
    console.error("Failed to process network", err);
  } finally {
    client.destroy();
    console.log();
  }
}
