import type { Polkadot } from "@polkadot-api/descriptors";
import type { UnsafeApi } from "polkadot-api";
import type { SubstrateNetwork } from "./networks";
import { merkleizeMetadata } from "@polkadot-api/merkleize-metadata";

export const getMetadataHash = async (
  api: UnsafeApi<Polkadot>,
  tokenInfo: SubstrateNetwork["tokenInfo"],
  version: number = 15
) => {
  const metadataRpc = await api.apis.Metadata.metadata_at_version(version);
  if (!metadataRpc) throw new Error(`Metadata v${version} is not available`);

  const metadataHash = merkleizeMetadata(
    metadataRpc.asBytes(),
    tokenInfo
  ).digest();

  return metadataHash;
};
