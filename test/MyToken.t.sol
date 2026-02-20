// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {MyToken} from "../src/MyToken.sol";

contract MyTokenTest is Test {
    MyToken public token;

    address public owner;
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10 ** 18;

    function setUp() public {
        owner = address(this);
        token = new MyToken("My Token", "MTK");
    }

    function test_OwnerGetsInitialSupply() public view {
        assertEq(token.balanceOf(owner), INITIAL_SUPPLY, "Owner should have initial supply");
        assertEq(token.totalSupply(), INITIAL_SUPPLY, "Total supply should equal initial supply");
    }
}
