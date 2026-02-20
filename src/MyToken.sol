// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MyToken
 * @author
 * @notice ERC-20 token with initial supply minted to the deployer (owner).
 * @dev Uses OpenZeppelin ERC20; follows CEI and uses immutable for constructor-set values.
 */
contract MyToken is ERC20 {
    /// @notice Initial supply minted to the deployer.
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10 ** 18;

    /// @notice Deployer address; receives INITIAL_SUPPLY.
    address public immutable owner;

    /**
     * @notice Deploys the token and mints INITIAL_SUPPLY to the deployer.
     * @param name_ Token name (e.g. "My Token").
     * @param symbol_ Token symbol (e.g. "MTK").
     */
    constructor(
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) {
        owner = msg.sender;
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
