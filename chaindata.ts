import { trump, getAccount } from "./src/accounts";
import { checkNetwork } from "./src/checkNetwork";
import { getChaindataNetworks } from "./src/getChaindataNetworks";

// Set MNEMONIC and DERIVATION_PATH environment variables to use a real account, although it's not necessary
const account = process.env.MNEMONIC
  ? getAccount(process.env.MNEMONIC, process.env.DERIVATION_PATH ?? "")
  : trump;

console.log("Using account", account.address);
console.log();

const networks = await getChaindataNetworks();
console.log("Checking", networks.length, "networks from chaindata");
console.log();

// check all networks
const networksWithIssue: string[] = [];
for (const network of networks) {
  if (!(await checkNetwork(network, account.signer)))
    networksWithIssue.push(network.name);
}
// output summary
console.log("Networks with broken CheckMetadataHash:");
for (const networkName of networksWithIssue) console.log("- " + networkName);
