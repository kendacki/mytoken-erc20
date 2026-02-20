// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {MyToken} from "../src/MyToken.sol";

contract DeployScript is Script {
    function run() external returns (MyToken) {
        vm.startBroadcast();
        MyToken token = new MyToken("My Token", "MTK");
        console.log("MyToken deployed at", address(token));
        vm.stopBroadcast();
        return token;
    }
}
