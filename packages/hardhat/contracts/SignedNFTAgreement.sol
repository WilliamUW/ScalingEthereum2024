// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SignedNFTAgreement is ERC721Holder, ReentrancyGuard, Ownable {

    // Mapping from token ID to whether it is locked as collateral
    mapping(address => mapping(uint256 => bool)) public isLocked;
    // Mapping to store optional RWA collateral agreements signed via ETHSign
    mapping(uint256 => string) public rwaCollateralAgreements;

    // Loan condition struct
    struct LoanCondition {
        uint256 loanAmount;
        uint256 interestRate; // in basis points to allow decimals
        uint256 loanDuration; // in seconds
    }
    // Mapping from NFT (address and tokenId) to their loan conditions
    mapping(address => mapping(uint256 => LoanCondition)) public loanConditions;

    // Events for locking and releasing NFTs and managing loan conditions
    event CollateralLocked(address indexed nftAddress, uint256 indexed tokenId, address indexed locker, string rwaAgreementHash, LoanCondition conditions);
    event CollateralReleased(address indexed nftAddress, uint256 indexed tokenId, address indexed releaser);
    event LoanConditionsSet(address indexed nftAddress, uint256 indexed tokenId, LoanCondition conditions);

    constructor(address lender) {
        transferOwnership(lender);
    }

    // Function to set loan conditions for an NFT
    function setLoanConditions(address nftAddress, uint256 tokenId, uint256 amount, uint256 rate, uint256 duration) public onlyOwner {
        LoanCondition memory conditions = LoanCondition({
            loanAmount: amount,
            interestRate: rate,
            loanDuration: duration
        });
        loanConditions[nftAddress][tokenId] = conditions;
        emit LoanConditionsSet(nftAddress, tokenId, conditions);
    }

    // Function to lock collateral with loan conditions
    function lockCollateral(address nftAddress, uint256 tokenId, string memory rwaAgreementHash) external nonReentrant {
        require(!isLocked[nftAddress][tokenId], "NFT is already locked as collateral");
        require(loanConditions[nftAddress][tokenId].loanAmount > 0, "Loan conditions must be set before locking");

        IERC721 nft = IERC721(nftAddress);
        require(nft.ownerOf(tokenId) == msg.sender || nft.getApproved(tokenId) == address(this), "Caller is not owner nor approved");

        nft.safeTransferFrom(msg.sender, address(this), tokenId);
        isLocked[nftAddress][tokenId] = true;

        if(bytes(rwaAgreementHash).length > 0) {
            rwaCollateralAgreements[tokenId] = rwaAgreementHash;
            emit RWACollateralAgreementAdded(tokenId, rwaAgreementHash);
        }

        emit CollateralLocked(nftAddress, tokenId, msg.sender, rwaAgreementHash, loanConditions[nftAddress][tokenId]);
    }

    /**
     * @notice Releases the NFT from being used as collateral.
     * @param nftAddress The address of the NFT contract.
     * @param tokenId The token ID of the NFT.
     * Requirements:
     * - The NFT must be locked as collateral.
     * - Only the contract owner or authorized entity can release the NFT.
     */
    function releaseCollateral(address nftAddress, uint256 tokenId) external nonReentrant onlyOwner {
        require(isLocked[nftAddress][tokenId], "NFT is not locked as collateral");

        IERC721 nft = IERC721(nftAddress);
        nft.safeTransferFrom(address(this), msg.sender, tokenId);
        isLocked[nftAddress][tokenId] = false;

        if(bytes(rwaCollateralAgreements[tokenId]).length > 0) {
            delete rwaCollateralAgreements[tokenId];
        }

        emit CollateralReleased(nftAddress, tokenId, msg.sender);
    }
}
