import fs from 'fs';
import path from 'path';
import { artifacts } from "hardhat";

async function main() {
  // Get the deployment data
  const deploymentPath = path.join(__dirname, '../deployments');
  const networks = fs.readdirSync(deploymentPath);
  
  const deployedContracts: any = {};

  // Read deployment data for each network
  for (const network of networks) {
    const networkPath = path.join(deploymentPath, network);
    const files = fs.readdirSync(networkPath);

    for (const file of files) {
      if (file.endsWith('.json')) {
        const contractName = file.replace('.json', '');
        const deploymentFile = path.join(networkPath, file);
        const deploymentData = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));

        // Get the contract artifact for ABI
        const artifact = await artifacts.readArtifact(contractName);

        if (!deployedContracts[contractName]) {
          deployedContracts[contractName] = {
            address: deploymentData.address,
            abi: artifact.abi
          };
        }
      }
    }
  }

  // Frontend paths
  const frontendContractsPath = path.join(__dirname, '../../frontend/src/contracts');
  
  // Ensure the directory exists
  if (!fs.existsSync(frontendContractsPath)) {
    fs.mkdirSync(frontendContractsPath, { recursive: true });
  }

  // Write JSON file
  fs.writeFileSync(
    path.join(frontendContractsPath, 'deployedContracts.json'),
    JSON.stringify(deployedContracts, null, 2)
  );

  // Write TypeScript file
  const tsContent = `// Auto-generated file - do not edit manually
export const deployedContracts = ${JSON.stringify(deployedContracts, null, 2)} as const;

export type ContractNames = keyof typeof deployedContracts;
export type ContractAddresses = typeof deployedContracts[ContractNames]['address'];
`;

  fs.writeFileSync(
    path.join(frontendContractsPath, 'deployedContracts.ts'),
    tsContent
  );

  console.log('✅ Frontend contract files updated!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error updating frontend contracts:', error);
    process.exit(1);
  });
