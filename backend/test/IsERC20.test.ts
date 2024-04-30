import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
import { ethers } from "hardhat";

// Types
import { IsERC20 } from "../typechain-types";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree"

// Whitelisted addresses
import { whitelisted } from "../utils/whitelisted";

describe("IsERC20 Tests", function() {
  let contract: IsERC20;

  let owner: SignerWithAddress // Whitelisted
  let addr1: SignerWithAddress // Whitelisted
  let addr2: SignerWithAddress // Not Whitelisted

  let merkleTree: StandardMerkleTree<string[]>

  async function deployContractFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners()

    merkleTree = StandardMerkleTree.of(whitelisted, ["address"], { sortLeaves: true })

    const contractFactory = await ethers.getContractFactory("IsERC20")
    const contract = await contractFactory.deploy(owner.address, merkleTree.root)

    return {contract, merkleTree, owner, addr1, addr2}
  }

  // Deployment
  describe('Deployment', function() {
    it('should deploy the smart contract', async function() {
      const { contract, merkleTree, owner, addr1, addr2 } = await loadFixture(deployContractFixture)
      let contractMerkleTreeRoot = await contract.merkleRoot()
      assert(contractMerkleTreeRoot === merkleTree.root)
      let contractOwner = await contract.owner()
      assert(contractOwner === owner.address)
    })
  })
})