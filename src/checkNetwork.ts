import type { Polkadot } from "@polkadot-api/descriptors";
import {
  Binary,
  createClient,
  InvalidTxError,
  type PolkadotSigner,
} from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider/node";
import { getCheckMetadataHash } from "./getCheckMetadataHash";
import { getMetadataHash } from "./getMetadataHash";
import type { SubstrateNetwork } from "./networks";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";

/**
 *
 * @param network
 * @param signer
 * @returns true if the network accepts the extrinsic with or without metadataHash, false if it rejects it because of BadProof
 */
export const checkNetwork = async (
  network: SubstrateNetwork,
  signer: PolkadotSigner
) => {
  console.log("Checking", network.name);
  const client = createClient(
    withPolkadotSdkCompat(
      getWsProvider(
        Array.isArray(network.rpcUrl) ? network.rpcUrl : [network.rpcUrl]
      )
    )
  );

  try {
    const api = client.getUnsafeApi<Polkadot>();
    const extrinsic = api.tx.System.remark_with_event({
      remark: Binary.fromText("Expect Chaos"),
    });

    const metadataHash = await getMetadataHash(api, network.tokenInfo);
    console.log("Metadata hash:", `0x${metadataHash.toHex()}`);

    await isValidMetadataHash(extrinsic, signer, null);
    return await isValidMetadataHash(extrinsic, signer, metadataHash);
  } catch (err) {
    console.error("Failed to process network", err);
    return true; // we don't know, so assume it's fine
  } finally {
    client.destroy();
    console.log();
  }
};

const isValidMetadataHash = async (
  extrinsic: any,
  signer: PolkadotSigner,
  metadataHash: Uint8Array | null
) => {
  const label = metadataHash ? "with metadataHash:" : "without metadataHash:";
  try {
    const res = await extrinsic.signAndSubmit(signer, {
      customSignedExtensions: {
        CheckMetadataHash: getCheckMetadataHash(metadataHash),
      },
    });
    console.log(label, res.ok ? "tx success" : "tx failed (but was submitted)");
    return true; // if tx was submitted, there is no CheckMetadataHash issue
  } catch (err) {
    if (err instanceof InvalidTxError) {
      console.log(label, "tx rejected:", err.error.value.type);
      if (err.error.value.type === "BadProof") return false;
    } else {
      console.log(label, "tx rejected", { err });
    }
    return true; // we don't know why it failed, could be a balance issue => assume there is no CheckMetadataHash issue
  }
};
