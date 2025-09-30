import type { Polkadot } from "@polkadot-api/descriptors";
import type { UnsafeApi } from "polkadot-api";
import type { SubstrateNetwork } from "./networks";
import { merkleizeMetadata } from "@polkadot-api/merkleize-metadata";

export const getMetadataHash = async (
  api: UnsafeApi<Polkadot>,
  tokenInfo: SubstrateNetwork["tokenInfo"]
) => {
  const versions: number[] = await api.apis.Metadata.metadata_versions();
  const version = versions.filter((v) => v < 100).pop();
  if (!version) throw new Error("no valid metadata version found");

  const metadataRpc = await api.apis.Metadata.metadata_at_version(version);
  if (!metadataRpc) throw new Error("no metadata");

  const metadataHash = merkleizeMetadata(
    metadataRpc.asBytes(),
    tokenInfo
  ).digest();

  return metadataHash;
};
