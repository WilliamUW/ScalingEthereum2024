// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SignedNFTAgreement is ERC721Holder, ReentrancyGuard, Ownable {
    // NFT collateral details
    address public nftAddress;
    uint256 public tokenId;
    bool public isLocked;

    // Optional RWA collateral agreement signed via ETHSign
    string public rwaCollateralAgreementHash;

    // Loan conditions specified at deployment
    uint256 public loanAmount;
    uint256 public interestRate; // in basis points to allow decimals
    uint256 public loanDuration; // in seconds

    // Events for locking and releasing NFTs
    event CollateralLocked(address indexed nftAddress, uint256 indexed tokenId);
    event CollateralReleased(address indexed nftAddress, uint256 indexed tokenId);
    event RWACollateralAgreementAdded(string agreementHash);

    constructor(
        address _initialOwner,
        uint256 _loanAmount,
        uint256 _interestRate,
        uint256 _loanDuration,
        string memory _rwaCollateralAgreementHash
    )  Ownable(_initialOwner) {
        loanAmount = _loanAmount;
        interestRate = _interestRate;
        loanDuration = _loanDuration;
        rwaCollateralAgreementHash = _rwaCollateralAgreementHash;
    }

    // Function to udpdate loan amout 
    function updateLoanAmount(uint256 _loanAmount) external onlyOwner {
        loanAmount = _loanAmount;
    }

    // Function to update interest rate
    function updateInterestRate(uint256 _interestRate) external onlyOwner {
        interestRate = _interestRate;
    }

    // Function to update loan duration
    function updateLoanDuration(uint256 _loanDuration) external onlyOwner {
        loanDuration = _loanDuration;
    }

    // Function to lock collateral
    function lockCollateral() external nonReentrant onlyOwner {
        require(!isLocked, "NFT is already locked as collateral");

        IERC721 nft = IERC721(nftAddress);
        require(nft.ownerOf(tokenId) == owner(), "Contract owner does not own the NFT");

        nft.safeTransferFrom(owner(), address(this), tokenId);
        isLocked = true;

        emit CollateralLocked(nftAddress, tokenId);
    }

    // Function to release collateral
    function releaseCollateral() external nonReentrant onlyOwner {
        require(isLocked, "NFT is not locked as collateral");

        IERC721 nft = IERC721(nftAddress);
        nft.safeTransferFrom(address(this), owner(), tokenId);
        isLocked = false;

        emit CollateralReleased(nftAddress, tokenId);
    }
}
