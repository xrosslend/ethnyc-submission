//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "./RelayLib.sol";

contract Source {
  event Rent(bytes32 indexed hash, RelayLib.Relay reray);
  event Withdraw(bytes32 indexed hash, RelayLib.Relay reray);

  mapping(bytes32 => RelayLib.Relay) _rerays;

  function rent(RelayLib.Relay memory reray) public {
    require(reray.from == IERC721(reray.nftContractAddress).ownerOf(reray.tokenId), "Source: from invalid");
    IERC721(reray.nftContractAddress).transferFrom(reray.from, address(this), reray.tokenId);
    bytes32 hash = RelayLib.hashRelay(reray);
    _rerays[hash] = reray;
    emit Rent(hash, reray);
  }

  function withdraw(RelayLib.Relay memory reray) public {
    bytes32 hash = RelayLib.hashRelay(reray);
    require(_rerays[hash].expiration <= block.timestamp, "Source: too early");
    delete _rerays[hash];
    IERC721(reray.nftContractAddress).transferFrom(address(this), reray.from, reray.tokenId);
    emit Withdraw(hash, reray);
  }
}
