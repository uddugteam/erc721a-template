import "@nomicfoundation/hardhat-toolbox";
import { deploy, getName, verify } from "./scripts/scripts";
import { task } from "hardhat/config";

task("deploy", "Deploy contract").setAction(async (args, hre) => {
  await hre.run("compile");
  await deploy(hre);
});

task("verifyContract", "Verify deployed contract").setAction(async (args, hre) => {
  await verify(hre);
});

task("getName", "Get deployed contract name").setAction(async (args, hre) => {
  const name = await getName(hre);
  console.log(`Contract name: ${name}`);
});

module.exports = {
  solidity: "0.8.18",
  mocha: {
    timeout: 200000,
  },
  networks: {
    deployNet: {
      url: process.env.PROVIDER_URL,
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY as string,
  },
};
