import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Deploying contracts...");

  // Deploy TrustChain contract
  const TrustChain = await ethers.getContractFactory("TrustChain");
  const trustChain = await TrustChain.deploy();
  await trustChain.waitForDeployment();

  const trustChainAddress = await trustChain.getAddress();
  console.log("TrustChain deployed to:", trustChainAddress);

  // Save deployment info to a JSON file
  const deploymentInfo = {
    TrustChain: {
      address: trustChainAddress,
      abi: JSON.parse(trustChain.interface.formatJson()),
    },
  };

  // Create contracts directory in frontend if it doesn't exist
  const frontendContractsDir = path.join(__dirname, "../frontend/src/contracts");
  if (!fs.existsSync(frontendContractsDir)) {
    fs.mkdirSync(frontendContractsDir, { recursive: true });
  }

  // Write deployment info to frontend
  fs.writeFileSync(
    path.join(frontendContractsDir, "deployedContracts.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Also write as TypeScript for better type safety
  const tsContent = `
// Auto-generated file - do not edit manually
export const deployedContracts = ${JSON.stringify(deploymentInfo, null, 2)} as const;

export type ContractNames = keyof typeof deployedContracts;
export type ContractAddresses = typeof deployedContracts[ContractNames]['address'];
`;

  fs.writeFileSync(
    path.join(frontendContractsDir, "deployedContracts.ts"),
    tsContent
  );

  console.log("✅ Contract addresses saved to frontend/src/contracts/");
  console.log("📝 You can now start your frontend with: npm run frontend:dev");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

