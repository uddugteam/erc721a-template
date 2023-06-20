// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC721Contract is ERC721A, Ownable {
    constructor(string memory name_, string memory symbol_) ERC721A(name_, symbol_) {}
}
