import type { Polkadot } from "@polkadot-api/descriptors";
import type { Binary, UnsafeApi } from "polkadot-api";
import type { SubstrateNetwork } from "./networks";
import { merkleizeMetadata } from "@polkadot-api/merkleize-metadata";
import {
  getDynamicBuilder,
  getLookupFn,
} from "@polkadot-api/metadata-builders";
import {
  decAnyMetadata,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings";

export const parseMetadataRpc = (metadataRpc: `0x${string}` | Uint8Array) => {
  const metadata = decAnyMetadata(metadataRpc);
  const unifiedMetadata = unifyMetadata(metadata);
  const lookupFn = getLookupFn(unifiedMetadata);
  const builder = getDynamicBuilder(lookupFn);

  const version = unifiedMetadata.pallets
    .find((x) => x.name === "System")
    ?.constants.find((x) => x.name === "Version");
  if (version == null) throw new Error("System.Version constant not found");
  const { spec_name: specName, spec_version: specVersion } = builder
    .buildDefinition(version.type)
    .dec(version.value);
  if (typeof specName !== "string" || typeof specVersion !== "number")
    throw new Error("Spec name or spec version not found");

  return {
    metadata,
    unifiedMetadata,
    lookupFn,
    builder,
    ss58Prefix: builder.ss58Prefix,
    specName,
    specVersion,
  };
};

export const getMetadataHash = async (
  api: UnsafeApi<Polkadot>,
  tokenInfo: SubstrateNetwork["tokenInfo"],
  version: number = 15
) => {
  const metadataRpc = await api.apis.Metadata.metadata_at_version(version);
  if (!metadataRpc) throw new Error(`Metadata v${version} is not available`);

  const { ss58Prefix, specName, specVersion } = parseMetadataRpc(
    metadataRpc.asBytes()
  );
  console.log(
    "ss58Prefix:%s, specName:%s, specVersion:%s",
    ss58Prefix,
    specName,
    specVersion
  );

  const metadataHash = merkleizeMetadata(
    metadataRpc.asBytes(),
    tokenInfo
  ).digest();

  return metadataHash;
};
