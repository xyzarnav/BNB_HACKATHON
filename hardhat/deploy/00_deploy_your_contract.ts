import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Deploys a contract named "TrustChain" using the deployer account and updates frontend files
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployTrustChain: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy the contract
  const trustChain = await deploy("TrustChain", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Verify the contract if we're on a network that supports it
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    try {
      console.log("Verifying contract on explorer...");
      await hre.run("verify:verify", {
        address: trustChain.address,
        constructorArguments: [],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.log("Error verifying contract:", error);
    }
  }

  // Update frontend contract files
  try {
    console.log("Updating frontend contract files...");
    await execAsync("npx hardhat run scripts/updateFrontend.ts");
    console.log("Frontend contract files updated successfully");
  } catch (error) {
    console.error("Error updating frontend files:", error);
  }

  // Log deployment info
  console.log("\n📝 Contract Deployment Summary:");
  console.log("===============================");
  console.log(`🔥 TrustChain deployed to: ${trustChain.address}`);
  console.log(`🌍 Network: ${hre.network.name}`);
  console.log(`👤 Deployer: ${deployer}`);
  console.log("===============================\n");
};

export default deployTrustChain;

// Tags are useful if you have multiple deploy files and only want to run one of them.
deployTrustChain.tags = ["TrustChain"];