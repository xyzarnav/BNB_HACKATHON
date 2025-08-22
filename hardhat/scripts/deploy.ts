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

  // Define both frontend contract directories
  const frontendPaths = [
    path.join(__dirname, "../../frontend/src/contracts"),  // bnb/frontend/src/contracts
    path.join(__dirname, "../frontend/src/contracts"),     // hardhat/frontend/src/contracts
  ];

  // Create directories and save files in both locations
  frontendPaths.forEach(contractsDir => {
    try {
      // Create directory if it doesn't exist
      if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir, { recursive: true });
        console.log(`Created directory: ${contractsDir}`);
      }

      // Write JSON file
      const jsonPath = path.join(contractsDir, "deployedContracts.json");
      fs.writeFileSync(
        jsonPath,
        JSON.stringify(deploymentInfo, null, 2)
      );
      console.log(`✅ Saved JSON to: ${jsonPath}`);

      // Write TypeScript file
      const tsContent = `
// Auto-generated file - do not edit manually
export const deployedContracts = ${JSON.stringify(deploymentInfo, null, 2)} as const;

export type ContractNames = keyof typeof deployedContracts;
export type ContractAddresses = typeof deployedContracts[ContractNames]['address'];
`;
      const tsPath = path.join(contractsDir, "deployedContracts.ts");
      fs.writeFileSync(tsPath, tsContent);
      console.log(`✅ Saved TypeScript to: ${tsPath}`);
    } catch (error) {
      console.error(`Error saving to ${contractsDir}:`, error);
    }
  });

  console.log("\n✨ Deployment Summary:");
  console.log("Contract Address:", trustChainAddress);
  console.log("Contract files updated in both frontend locations");
  console.log("\n📝 Next steps:");
  console.log("1. Verify your contract on the block explorer");
  console.log("2. Start your frontend with: cd ../frontend && npm run dev");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });