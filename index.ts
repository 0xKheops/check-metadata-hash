import { getAccount, trump } from "./src/accounts";
import { checkNetwork } from "./src/checkNetwork";
import { NETWORKS } from "./src/networks";

// Set MNEMONIC and DERIVATION_PATH environment variables to use a real account, although it's not necessary and takes longer to run
const account = process.env.MNEMONIC
  ? getAccount(process.env.MNEMONIC, process.env.DERIVATION_PATH ?? "")
  : trump;

console.log("Using account", account.address);
console.log();

// check all networks
const networksWithIssue: string[] = [];
for (const network of Object.values(NETWORKS))
  if (!(await checkNetwork(network, account.signer)))
    networksWithIssue.push(network.name);

// output summary
if (networksWithIssue.length === 0) {
  console.log("CheckMetadataHash works fine on all networks");
} else {
  console.log("Networks with broken CheckMetadataHash:");
  for (const networkName of networksWithIssue) console.log("- " + networkName);
}
