// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract GM_Contract {
    event NewGM(address indexed from, uint256 timestamp, string message);
    struct GM { address gmr; uint256 timestamp; string message; }
    GM[] gms;

    constructor(){}

    function gm(string memory _message) public {
        gms.push(GM(msg.sender, block.timestamp, _message));
        emit NewGM(msg.sender, block.timestamp, _message);
    }

    function getAllGMs() public view returns (GM[] memory) { return gms; }
}

contract GN_Contract {
    event NewGN(address indexed from, uint256 timestamp, string message);
    struct GN { address gnr; uint256 timestamp; string message; }
    GN[] gns;

    constructor(){}

    function gn(string memory _message) public {
        gns.push(GN(msg.sender, block.timestamp, _message));
        emit NewGN(msg.sender, block.timestamp, _message);
    }

    function getAllGNs() public view returns (GN[] memory) { return gns; }
}