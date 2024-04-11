import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployInvoiceEscrow: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy InvoiceEscrow contract with constructor arguments
  await deploy("InvoiceEscrow", {
    from: deployer,
    args: [deployer, "0x1234567890123456789012345678901234567890", "0x0987654321098765432109876543210987654321"],
    log: true,
    autoMine: true,
  });

  // Get deployed contract instance
  const invoiceEscrow = await hre.ethers.getContract<Contract>("InvoiceEscrow", deployer);
  console.log("🛠️ InvoiceEscrow deployed at:", invoiceEscrow.address);
};

export default deployInvoiceEscrow;

// Set tags for deployment script
deployInvoiceEscrow.tags = ["InvoiceEscrow"];
