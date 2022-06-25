//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@uma/core/contracts/oracle/interfaces/FinderInterface.sol";
import "@uma/core/contracts/oracle/interfaces/OptimisticOracleV2Interface.sol";

import "@uma/core/contracts/common/implementation/Timer.sol";
import "@uma/core/contracts/common/implementation/Testable.sol";
import "@uma/core/contracts/oracle/implementation/Finder.sol";

import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC721Metadata.sol";

import "./WrappedERC721.sol";

contract Bridge is Testable {
  event Deposit(bytes32 indexed hash);
  event Propose(bytes32 indexed hash);
  event Dispute(bytes32 indexed hash);
  event Withdraw(bytes32 indexed hash);

  struct Relay {
    address nftContractAddress;
    address from;
    address to;
    uint256 tokenId;
    uint256 sourceChainId;
    uint256 targetChainId;
    uint256 finalizedAt;
    string tokenURI;
    bool isTokenURIIncluded;
    bool isWrappedERC721;
  }

  mapping(bytes32 => Relay) private _relays;
  mapping(bytes32 => bool) private _exists;
  mapping(bytes32 => bool) private _filled;
  mapping(bytes32 => bool) private _disputed;

  FinderInterface private _finder;
  WrappedERC721 private _wrappedERC721;

  constructor(address finderAddress, address timerAddress) Testable(timerAddress) {
    _finder = FinderInterface(finderAddress);
    _wrappedERC721 = new WrappedERC721();
    _wrappedERC721.initialize();
  }

  // This is called in source chain
  function deposit(Relay memory relay) public {
    relay.tokenURI = relay.isTokenURIIncluded ? IERC721Metadata(relay.nftContractAddress).tokenURI(relay.tokenId) : "";

    if (relay.nftContractAddress == address(_wrappedERC721)) {
      _wrappedERC721.burn(relay.tokenId);
      relay.isWrappedERC721 = true;
    } else {
      IERC721(relay.nftContractAddress).transferFrom(relay.from, address(this), relay.tokenId);
      relay.isWrappedERC721 = false;
    }

    bytes32 hash = _hashRelay(relay);
    emit Deposit(hash);
  }

  // This is called in target chain
  function propose(Relay memory relay) public {
    bytes32 hash = _hashRelay(relay);
    require(!_exists[hash], "Bridge: relay does not exist");
    _exists[hash] = true;
    _relays[hash] = relay;
    emit Propose(hash);
  }

  //TODO: implement this
  // This is called in target chain
  function dispute(Relay memory relay) public {
    bytes32 hash = _hashRelay(relay);
    require(_exists[hash], "Bridge: relay does not exist");
    require(!_filled[hash], "Bridge: relay already filled");
    _disputed[hash] = true;
    emit Dispute(hash);
  }

  // This is called in target chain
  function withdraw(Relay memory relay) public {
    bytes32 hash = _hashRelay(relay);

    require(_exists[hash], "Bridge: relay does not exist");
    require(!_filled[hash], "Bridge: relay already filled");
    require(!_disputed[hash], "Bridge: relay is disputed");

    require(block.timestamp >= relay.finalizedAt, "Bridge: relay is not yet finalized");

    if (relay.isWrappedERC721) {
      IERC721(relay.nftContractAddress).transferFrom(address(this), relay.to, relay.tokenId);
    } else {
      _wrappedERC721.mint(relay.to, relay.tokenId, relay.tokenURI);
    }

    emit Withdraw(hash);
  }

  function _requestOracle() internal {
    OptimisticOracleV2Interface optimisticOracle = _getOptimisticOracle();
  }

  function _getOptimisticOracle() internal view returns (OptimisticOracleV2Interface) {
    return OptimisticOracleV2Interface(_finder.getImplementationAddress("OptimisticOracleV2"));
  }

  function _hashRelay(Relay memory relay) internal pure returns (bytes32) {
    return keccak256(abi.encode(relay));
  }
}
