import { ethers } from "hardhat";

// Types
import { IsERC20 } from "../typechain-types";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

// Whitelisted addresses
import { whitelisted } from "../utils/whitelisted";

async function main() {
    let contract: IsERC20
    let merkleTree: StandardMerkleTree<string[]>
    merkleTree = StandardMerkleTree.of(whitelisted, ["address"], { sortLeaves: true })
    const [owner] = await ethers.getSigners()
    contract = await ethers.deployContract("IsERC20", [owner.address, merkleTree.root])

    await contract.waitForDeployment()

    console.log(`IsERC20 deployed to ${contract.target} with merkleRoot ${merkleTree.root}`)
}