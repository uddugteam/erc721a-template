import "@nomicfoundation/hardhat-toolbox";
import {deploy, ping} from "./scripts/ERC721Contract";
import {task} from "hardhat/config";

task("deploy", "Deploy contact").setAction(async (args, hre) => {
  await hre.run("compile");
  await deploy(hre);
});

task("ping", "Ping contract by using name() method").setAction(async (args, hre) => {
  await ping(hre);
})

module.exports = {
  solidity: "0.8.18",
  networks: {
    mainnet: {
      url: process.env.PROVIDER_URL,
      accounts: [process.env.PRIVATE_KEY as string],
    },
    goerli: {
      url: process.env.PROVIDER_URL,
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY as string,
  }
}