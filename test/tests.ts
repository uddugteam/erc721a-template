import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

// RENAME!
describe("ERC721Contract unit tests", function () {
  const Name = "Name"; // RENAME!
  const Symbol = "Symbol"; // RENAME!

  async function deployFixture() {
    const [owner, address1, address2, address3] = await ethers.getSigners();

    // RENAME!
    const contract = await ethers.deployContract("ERC721Contract", [Name, Symbol]);
    await contract.waitForDeployment();

    return { contract, owner, address1, address2, address3 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { contract, owner } = await loadFixture(deployFixture);

      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should deploy with proper address", async function () {
      const { contract } = await loadFixture(deployFixture);

      expect(contract.target).to.be.properAddress;
    });

    it("Should have right name", async function () {
      const { contract } = await loadFixture(deployFixture);

      expect(await contract.name()).to.equal(Name);
    });

    it("Should have right symbol", async function () {
      const { contract } = await loadFixture(deployFixture);

      expect(await contract.symbol()).to.equal(Symbol);
    });

    it("Should have 0 total supply", async function () {
      const { contract } = await loadFixture(deployFixture);
      expect(await contract.totalSupply()).to.equal(0);
    });
  });
});
