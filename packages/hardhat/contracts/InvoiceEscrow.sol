// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing OpenZeppelin's ERC20 interface for token transactions.
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract InvoiceEscrow {
    // State variables
    address public seller; // Seller's address
    address public buyer; // Buyer's address
    IERC20 public token; // ERC20 token used for transactions

    struct Invoice {
        uint amount; // Amount of tokens to be paid
        bool signed; // Whether the invoice is signed by the seller
        bool paid; // Whether the invoice has been paid
    }

    mapping(uint256 => Invoice) public invoices;

    // Events
    event InvoiceCreated(uint256 indexed invoiceId, uint256 amount);
    event InvoiceSigned(uint256 indexed invoiceId);
    event PaymentMade(uint256 indexed invoiceId, uint256 amount);

    // Constructor to set the seller, buyer, and token addresses
    constructor(address _seller, address _buyer, address _tokenAddress) {
        seller = _seller;
        buyer = _buyer;
        token = IERC20(_tokenAddress);
    }

    // Function to create an invoice by the seller
    function createInvoice(uint256 invoiceId, uint256 amount) external {
        require(msg.sender == seller, "Only the seller can create an invoice.");
        require(invoices[invoiceId].amount == 0, "Invoice already exists.");

        invoices[invoiceId] = Invoice(amount, false, false);
        emit InvoiceCreated(invoiceId, amount);
    }

    // Function for the seller to sign the invoice
    function signInvoice(uint256 invoiceId) external {
        require(msg.sender == seller, "Only the seller can sign the invoice.");
        require(invoices[invoiceId].amount != 0, "Invoice does not exist.");
        require(!invoices[invoiceId].signed, "Invoice already signed.");

        invoices[invoiceId].signed = true;
        emit InvoiceSigned(invoiceId);
    }

    // Function for the buyer to pay the invoice
    function payInvoice(uint256 invoiceId) external {
        require(msg.sender == buyer, "Only the buyer can pay the invoice.");
        Invoice storage invoice = invoices[invoiceId];

        require(invoice.signed, "Invoice must be signed by the seller before paying.");
        require(!invoice.paid, "Invoice already paid.");
        require(token.allowance(buyer, address(this)) >= invoice.amount, "Insufficient allowance.");

        invoice.paid = true;
        token.transferFrom(buyer, seller, invoice.amount);
        emit PaymentMade(invoiceId, invoice.amount);
    }

    // Additional functions like withdrawing funds, disputing invoices, etc., can be added as per requirements.
}
