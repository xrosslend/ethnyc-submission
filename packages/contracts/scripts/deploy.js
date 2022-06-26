const fs = require("fs");
const path = require("path");

const hre = require("hardhat");
const networks = require("../networks.json");
const zeroAddress = "0x0000000000000000000000000000000000000000";

async function main() {
  const { usdc, finder } = networks[hre.network.name].contracts;
  const Source = await hre.ethers.getContractFactory("Source");
  const source = await Source.deploy();
  await source.deployed();
  const Target = await hre.ethers.getContractFactory("Target");
  const target = await Target.deploy(usdc, finder, zeroAddress);
  await target.deployed();
  console.log("souce:", source.address);
  console.log("target:", target.address, usdc, finder, zeroAddress);
  networks[hre.network.name].contracts.source = source.address;
  networks[hre.network.name].contracts.target = target.address;
  fs.writeFileSync(path.join(__dirname, "../networks.json"), JSON.stringify(networks));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
