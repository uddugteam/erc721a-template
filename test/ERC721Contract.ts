import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC721Contract unit tests", function () {
  const MName = "Name";
  const MSymbol = "Symbol";

  async function deployMetazokuFixture() {
    const [owner, address1, address2, address3] = await ethers.getSigners();

    const ERC721Contract = await ethers.getContractFactory("ERC721Contract");
    const contract = await ERC721Contract.deploy(MName, MSymbol);

    return { contract, owner, address1, address2, address3 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { contract, owner } = await loadFixture(deployMetazokuFixture);

      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should deploy with proper address", async function () {
      const { contract } = await loadFixture(deployMetazokuFixture);

      expect(contract.address).to.be.properAddress;
    });

    it("Should have right name", async function () {
      const { contract } = await loadFixture(deployMetazokuFixture);

      expect(await contract.name()).to.equal(MName);
    });

    it("Should have right symbol", async function () {
      const { contract } = await loadFixture(deployMetazokuFixture);

      expect(await contract.symbol()).to.equal(MSymbol);
    });

    it("Should have 0 total supply", async function () {
      const { contract } = await loadFixture(deployMetazokuFixture);
      expect(await contract.totalSupply()).to.equal(0);
    });
  });
});
