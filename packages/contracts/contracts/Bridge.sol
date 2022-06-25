//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@uma/core/contracts/oracle/interfaces/FinderInterface.sol";
import "@uma/core/contracts/oracle/interfaces/OptimisticOracleV2Interface.sol";

import "@uma/core/contracts/common/implementation/AddressWhitelist.sol";
import "@uma/core/contracts/common/implementation/ExpandedERC20.sol";
import "@uma/core/contracts/common/implementation/Timer.sol";
import "@uma/core/contracts/common/implementation/Testable.sol";
import "@uma/core/contracts/oracle/implementation/IdentifierWhitelist.sol";
import "@uma/core/contracts/oracle/implementation/Store.sol";
import "@uma/core/contracts/oracle/implementation/Finder.sol";
import "@uma/core/contracts/oracle/implementation/OptimisticOracleV2.sol";
import "@uma/core/contracts/oracle/test/MockOracleAncillary.sol";

import "@openzeppelin/contracts/interfaces/IERC721.sol";

import "./WrappedERC721.sol";

import "hardhat/console.sol";

contract Bridge is Testable {
  event Deposit(bytes32 indexed hash, bytes message);
  event Lock(bytes32 indexed hash, bytes message);
  event Confirm(bytes32 indexed hash, bytes message);
  event Withdraw(bytes32 indexed hash, bytes message);

  struct Relay {
    address nftContractAddress;
    address from;
    address to;
    uint256 tokenId;
    uint256 sourceChainId;
    uint256 targetChainId;
    uint256 salt;
    string tokenURI;
  }

  mapping(bytes32 => bool) private _confirmed;

  FinderInterface private _finder;
  IERC20 private _collateralCurrency;
  WrappedERC721 private _wrappedERC721;

  bytes32 private _priceIdentifier = "YES_OR_NO_QUERY";
  uint256 private _requested;

  constructor(
    address collateralAddress,
    address finderAddress,
    address timerAddress
  ) Testable(timerAddress) {
    _finder = FinderInterface(finderAddress);
    _collateralCurrency = IERC20(collateralAddress);
    _wrappedERC721 = new WrappedERC721();
    _wrappedERC721.initialize();
  }

  // This is called in source chain
  function deposit(Relay memory relay) public {
    require(relay.sourceChainId == block.chainid, "Bridge: chain id invalid");
    require(relay.from == IERC721(relay.nftContractAddress).ownerOf(relay.tokenId), "Bridge: from invalid");
    bytes memory message = encodeRelay(relay);
    bytes32 hash = keccak256(message);
    IERC721(relay.nftContractAddress).transferFrom(relay.from, address(this), relay.tokenId);
    emit Deposit(hash, message);
  }

  // This is called in target chain
  function lock(Relay memory relay) public {
    require(relay.targetChainId == block.chainid, "Bridge: chain id invalid");
    bytes memory message = encodeRelay(relay);
    bytes32 hash = keccak256(message);
    require(!_confirmed[hash], "Bridge: relay confirmed");
    _requested = getCurrentTime();
    _requestOraclePrice(_requested, message);
    emit Lock(hash, message);
  }

  // This is called in target chain
  function confirm(Relay memory relay) public {
    bytes memory message = encodeRelay(relay);
    bytes32 hash = keccak256(message);
    require(!_confirmed[hash], "Bridge: relay confirmed");
    _confirmed[hash] = true;
    _getOraclePrice(_requested, message);
    _requested = getCurrentTime();
    _requestOraclePrice(_requested, message);
    emit Confirm(hash, message);
  }

  // This is called in target chain
  function withdraw(Relay memory relay) public {
    bytes memory message = encodeRelay(relay);
    bytes32 hash = keccak256(message);
    require(_confirmed[hash], "Bridge: relay is not confirmed");
    _getOraclePrice(_requested, message);
    _wrappedERC721.mint(relay.to, uint256(hash), relay.tokenURI);
    emit Withdraw(hash, message);
  }

  function encodeRelay(Relay memory relay) public pure returns (bytes memory) {
    return abi.encode(relay);
  }

  function _requestOraclePrice(uint256 requestedTime, bytes memory message) internal {
    OptimisticOracleV2Interface oracle = _getOptimisticOracle();
    oracle.requestPrice(_priceIdentifier, requestedTime, message, _collateralCurrency, 0);
  }

  function _getOraclePrice(uint256 withdrawalRequestTimestamp, bytes memory message) internal returns (uint256) {
    OptimisticOracleV2Interface oracle = _getOptimisticOracle();
    require(
      oracle.hasPrice(address(this), _priceIdentifier, withdrawalRequestTimestamp, message),
      "Unresolved oracle price"
    );
    int256 oraclePrice = oracle.settleAndGetPrice(_priceIdentifier, withdrawalRequestTimestamp, message);
    if (oraclePrice < 0) {
      oraclePrice = 0;
    }
    return uint256(oraclePrice);
  }

  function _getOptimisticOracle() internal view returns (OptimisticOracleV2Interface) {
    return OptimisticOracleV2Interface(_finder.getImplementationAddress("OptimisticOracleV2"));
  }
}
