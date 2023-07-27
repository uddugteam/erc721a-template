import path from "path";
import fs from "fs";
import { Addressable } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const addressesDir = path.join(__dirname, "..", "addresses");

// RENAME!
const contractName = "ERC721Contract";

export async function deploy(hre: HardhatRuntimeEnvironment) {
  const [deployer] = await hre.ethers.getSigners();
  const name = _getName();
  const symbol = _getSymbol();

  if (name === "") {
    throw new Error("Name not found in env var, deploy reverted");
  }

  if (symbol === "") {
    throw new Error("Symbol not found in env var, deploy reverted");
  }

  console.log(`Deploying with name ${name} and symbol ${symbol}`);

  console.log(`Deploying contract with address ${deployer.address}`);

  const artifact = await hre.artifacts.readArtifact(contractName);
  const Contract = await hre.ethers.getContractFactoryFromArtifact(artifact);
  const deploymentData = Contract.interface.encodeDeploy([name, symbol]);

  if (Contract.runner && Contract.runner.estimateGas && Contract.runner.provider) {
    const gas = await Contract.runner.estimateGas({ data: deploymentData });

    console.log(`Deployment estimation gas ${gas.toString()}`);

    const deployerBalance = await Contract.runner.provider.getBalance(deployer.address);

    console.log(`Caller balance ${deployerBalance.toString()}`);

    const contract = await hre.ethers.deployContract(contractName, [name, symbol]);
    await contract.waitForDeployment();

    console.log(`Contract deployed to address ${contract.target}`);

    if (hre.network.name == "deployNet") {
      await _saveContractAddresses({ address: contract.target });

      console.log("Waiting 30 seconds before etherscan verification...");
      await new Promise(f => setTimeout(f, 30000));

      await hre.run("verify:verify", {
        address: contract.target,
        constructorArguments: [name, symbol],
      });
    }
  } else {
    throw new Error("Bas contract instance");
  }
}

export async function verify(hre: HardhatRuntimeEnvironment) {
  let address;

  try {
    address = JSON.parse(
      fs.readFileSync(path.join(addressesDir, "/", contractName + "-contractAddress.json")).toString(),
    )[contractName];
  } catch (e) {
    throw new Error(`Error parsing address ${e}`);
  }

  const name = _getName();
  const symbol = _getSymbol();

  if (name === "") {
    throw new Error("Name not found in env var, deploy reverted");
  }

  if (symbol === "") {
    throw new Error("Symbol not found in env var, deploy reverted");
  }

  await hre.run("verify:verify", {
    address: address,
    constructorArguments: [name, symbol],
  });
}

export async function getName(hre: HardhatRuntimeEnvironment) {
  const contract = await _getContract(hre);
  return await contract.name();
}

const _getContract = async (hre: HardhatRuntimeEnvironment) => {
  let address;

  try {
    address = JSON.parse(
      fs.readFileSync(path.join(addressesDir, "/", contractName + "-contractAddress.json")).toString(),
    )[contractName];
  } catch (e) {
    throw new Error(`Error parsing address ${e}`);
  }

  try {
    return await hre.ethers.getContractAt(contractName, address);
  } catch (e) {
    throw new Error(`Error getting address ${e}`);
  }
};

const _getName = () => {
  return process.env.NAME;
};

const _getSymbol = () => {
  return process.env.SYMBOL;
};

const _saveContractAddresses = async (addresses: { address: string | Addressable }) => {
  const { address } = addresses;

  if (!fs.existsSync(addressesDir)) {
    fs.mkdirSync(addressesDir);
  }

  fs.writeFileSync(
    path.join(addressesDir, "/", contractName + "-contractAddress.json"),
    JSON.stringify({ [contractName]: address }),
  );
};
