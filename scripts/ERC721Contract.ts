import {HardhatRuntimeEnvironment} from "hardhat/types";
import path from "path";
import * as fs from "fs";

const contractName = "Name"; // RENAME!
const contractSymbol = "Symbol"; // RENAME!

const contractFileName = __filename.split('/').splice(-1)[0].split(".").splice(0)[0];
const addressesDir = path.join(__dirname, "..", "addresses");

export async function deploy(hre: HardhatRuntimeEnvironment) {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contract with the account:", deployer.address);

    // RENAME!
    const Contract = await hre.ethers.getContractFactory(contractFileName);
    const gasPrice = await Contract.signer.getGasPrice();
    console.log(`Current gas price: ${gasPrice}`);
    const estimatedGas = await Contract.signer.estimateGas(
        Contract.getDeployTransaction(contractName, contractSymbol),
    );
    console.log(`Estimated gas: ${estimatedGas}`);
    const deploymentPrice = gasPrice.mul(estimatedGas);
    const deployerBalance = await Contract.signer.getBalance();
    console.log(`Deployer balance:  ${hre.ethers.utils.formatEther(deployerBalance)}`);
    console.log(`Deployment price:  ${hre.ethers.utils.formatEther(deploymentPrice)}`);
    if (Number(deployerBalance) < Number(deploymentPrice)) {
        throw new Error("You dont have enough balance to deploy.");
    }

    const contract = await Contract.deploy(contractName, contractSymbol);

    await contract.deployed();

    console.log("Contract deployed to address:", contract.address);

    await _saveContractAddresses(
        {address: contract.address},
    )

    const check = await ping(hre);

    if (!check.ok) {
        console.error("---!!Deploy task error: contract did not return right name");
        return
    }

    if (hre.network.name === "mainnet" || hre.network.name === "goerli") {
        console.log("Waiting 30 seconds before hre.etherscan verification...");
        await new Promise(f => setTimeout(f, 30000));

        await hre.run("verify:verify", {
            address: contract.address,
            constructorArguments: [contractName, contractSymbol],
        });
    }
}

export async function ping(hre: HardhatRuntimeEnvironment) {
    const result = await _getContract(hre);

    if (result.contract) {
        try {
            const name = await result.contract.name();
            return name === contractName ? {ok: true} : {ok: false};
        } catch (e) {
            console.error(`Ping error: ${e}`)
            return {ok: false}
        }
    } else {
        return {ok: false};
    }
}

const _saveContractAddresses = async (addresses: { address: string }) => {
    const {address} = addresses;

    if (!fs.existsSync(addressesDir)) {
        fs.mkdirSync(addressesDir);
    }

    fs.writeFileSync(
        path.join(addressesDir, "/", contractFileName + '-contractAddress.json'),
        JSON.stringify({[contractFileName]: address})
    );

}

const _getContract = async (hre: HardhatRuntimeEnvironment) => {
    let address

    try {
        address = JSON.parse(fs.readFileSync(path.join(addressesDir, "/", contractFileName + '-contractAddress.json'))
            .toString())[contractFileName];
    } catch (e) {
        console.error("Get contract error: no address found");
        return {contract: null}
    }

    try {
        const Contract = await hre.ethers.getContractFactory(contractFileName);
        const contract = await Contract.attach(address)
        return {contract: contract};
    } catch (e) {
        console.error(`Get contract error: ${e}`)
        return {contract: null}
    }

}