import {
  Binary,
  createClient,
  InvalidTxError,
  type PolkadotSigner,
} from "polkadot-api";
import type { SubstrateNetwork } from "./networks";
import { getWsProvider } from "polkadot-api/ws-provider";
import type { Polkadot } from "@polkadot-api/descriptors";
import { getMetadataHash } from "./getMetadataHash";
import { getCheckMetadataHash } from "./getCheckMetadataHash";

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
  const client = createClient(getWsProvider(network.rpcUrl));

  try {
    const api = client.getUnsafeApi<Polkadot>();
    const extrinsic = api.tx.System.remark_with_event({
      remark: Binary.fromText("Expect Chaos"),
    });

    const metadataHash = await getMetadataHash(api, network.tokenInfo);

    console.log("Submitting tx without metadataHash", network.name);
    await canSubmit(extrinsic, signer, null);
    console.log("Submitting tx with metadataHash", network.name);
    return await canSubmit(extrinsic, signer, metadataHash);
  } catch (err) {
    console.error("Failed to process network", network.name, err);
    return true; // we don't know, so assume it's fine
  } finally {
    client.destroy();
  }
};

const canSubmit = async (
  extrinsic: any,
  signer: PolkadotSigner,
  metadataHash: Uint8Array | null
) => {
  try {
    const res = await extrinsic.signAndSubmit(signer, {
      customSignedExtensions: {
        CheckMetadataHash: getCheckMetadataHash(metadataHash),
      },
    });
    console.log(res.ok ? "tx success" : "tx failed (but was submitted)");
    return true; // if tx was submitted, there is no CheckMetadataHash issue
  } catch (err) {
    if (err instanceof InvalidTxError) {
      console.log("tx rejected:", err.error.value.type);
      if (err.error.value.type === "BadProof") return false;
    } else {
      console.log("tx rejected", { err });
    }
    return true; // we don't know why it failed, could be a balance issue => assume there is no CheckMetadataHash issue
  }
};
