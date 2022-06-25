const { interfaceName, TokenRolesEnum } = require("@uma/common");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bridge Unit Test", function () {
  let timer;
  let optimisticOracle;
  let mockNFT;
  let bridge;
  let deployer, proposer;

  const utf8ToHex = (input) => ethers.utils.formatBytes32String(input);
  const identifier = utf8ToHex("YES_OR_NO_QUERY");
  const zeroRawValue = { rawValue: "0" };
  const proposalLiveness = 7200;

  beforeEach(async function () {
    [deployer, proposer] = await ethers.getSigners();

    const Timer = await ethers.getContractFactory("Timer");
    timer = await Timer.deploy();
    await timer.deployed();

    const Finder = await ethers.getContractFactory("Finder");
    const finder = await Finder.deploy();
    await finder.deployed();

    const CollateralWhitelist = await ethers.getContractFactory("AddressWhitelist");
    const collateralWhitelist = await CollateralWhitelist.deploy();
    await collateralWhitelist.deployed();

    const IdentifierWhitelist = await ethers.getContractFactory("IdentifierWhitelist");
    const identifierWhitelist = await IdentifierWhitelist.deploy();
    await identifierWhitelist.deployed();

    const USDC = await ethers.getContractFactory("ExpandedERC20");
    const usdc = await USDC.deploy("USD Coin", "USDC", 6);
    await usdc.deployed();

    const Store = await ethers.getContractFactory("Store");

    const store = await Store.deploy(zeroRawValue, zeroRawValue, timer.address);
    await store.deployed();

    const MockOracle = await ethers.getContractFactory("MockOracleAncillary");
    const mockOracle = await MockOracle.deploy(finder.address, timer.address);
    await mockOracle.deployed();

    const OptimisticOracle = await ethers.getContractFactory("OptimisticOracleV2");
    optimisticOracle = await OptimisticOracle.deploy(proposalLiveness, finder.address, timer.address);
    await optimisticOracle.deployed();

    await finder.changeImplementationAddress(utf8ToHex(interfaceName.CollateralWhitelist), collateralWhitelist.address);
    await finder.changeImplementationAddress(utf8ToHex(interfaceName.IdentifierWhitelist), identifierWhitelist.address);
    await finder.changeImplementationAddress(utf8ToHex(interfaceName.Store), store.address);
    await finder.changeImplementationAddress(utf8ToHex("OptimisticOracleV2"), optimisticOracle.address); // TODO interfaceName.OptimisticOracleV2
    await finder.changeImplementationAddress(utf8ToHex(interfaceName.Oracle), mockOracle.address);

    await identifierWhitelist.addSupportedIdentifier(identifier);

    await usdc.addMember(TokenRolesEnum.MINTER, deployer.address);
    await collateralWhitelist.addToWhitelist(usdc.address);

    const MockNFT = await ethers.getContractFactory("MockNFT");
    mockNFT = await MockNFT.deploy();
    await mockNFT.deployed();

    const Bridge = await ethers.getContractFactory("Bridge");
    bridge = await Bridge.deploy(usdc.address, finder.address, timer.address);
    await bridge.deployed();
  });

  it("deposit", async function () {
    const tokenId = 0;
    await mockNFT.mint(deployer.address);
    await mockNFT.setApprovalForAll(bridge.address, true);
    const relay = {
      nftContractAddress: mockNFT.address,
      from: deployer.address,
      to: deployer.address,
      tokenId,
      sourceChainId: 31337,
      targetChainId: 4,
      tokenURI: "",
    };
    await expect(bridge.deposit(relay)).to.emit(bridge, "Deposit");
  });

  it("propose", async function () {
    const tokenId = 0;
    const relay = {
      nftContractAddress: mockNFT.address,
      from: deployer.address,
      to: deployer.address,
      tokenId,
      sourceChainId: 4,
      targetChainId: 31337,
      tokenURI: "",
    };
    await expect(bridge.propose(relay)).to.emit(bridge, "Propose");
  });

  it("withdraw", async function () {
    const tokenId = 0;
    const relay = {
      nftContractAddress: mockNFT.address,
      from: deployer.address,
      to: deployer.address,
      tokenId,
      sourceChainId: 4,
      targetChainId: 31337,
      tokenURI: "",
    };
    await bridge.propose(relay);
    const requestTimestamp = await bridge.getCurrentTime();
    const message = await bridge.encodeRelay(relay);
    await optimisticOracle.proposePriceFor(proposer.address, bridge.address, identifier, requestTimestamp, message, 0);
    await timer.setCurrentTime(Number(await timer.getCurrentTime()) + proposalLiveness + 1);
    await expect(bridge.withdraw(relay)).to.emit(bridge, "Withdraw");
  });
});
