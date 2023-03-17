# ERC721A template

This is a template repository for ERC721A contract using ERC721A, Openzeppelin and Hardhat tools.

## Getting started

Start new repository using this one as a template. Cole repository and run `yarn install`. You are rady
to go!

## Contracts and addresses

Contracts are storing in `/contracts` directory. If you need to make test contracts please use `/contracts/test`
directory. Best practice is to name contract files the same as contracts.

When you will deploy your first contract, script will create `/addresses` directory where all contract addresses
will be stored in JSON files. This directory is added to `.gitigonre` file. You can use `_getContract`
script to access contract with deployer as signer.

## Scripts and tasks

All scripts should be used as hardhat tasks. This project already has standard deploy script written and corresponding
hardhat task. You can use it by `npx hardhat deploy` command.

Each file in `/scripts` directory is corresponding to each contract. You must use the same name for the scripts file
and for contract. If you have several contracts and you want to deploy them in certain way, you can use this logic
in the hardhat task which are located in `/hardhat.config.ts` file. For example:

```ts
task("deploy", "Deploy contacts").setAction(async (args, hre) => {
  await hre.run("compile");
  // Rename deploy function for certian contract
  const contract1Address = await deployContract1(hre);
  // Add new deploy script in `/scripts/Contract2.ts` script file
  await deployContract2(hre, contract1Address);
});
```

Remember to use `--network` flag argument. When you run hardhat task without it, they are running on hardhat (local) network
as default.

It is recommended to write tasks for each contract method that can be used during manual contract testing.

## Unit testing

TODO: add description

## Linters

### Prettier

This project use [prettier](https://prettier.io/) code formatter for solidity and typescript files.
Configuration and ignore list you can see in given `.prettierrc.yaml` and `.prettierignore` files. To
use it simply run:

To format code

```bash
npm run prettier
```

To check if code is format:

```bash
npm run prettier:check
```
