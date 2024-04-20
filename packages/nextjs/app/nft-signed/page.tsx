"use client";

import { AddressInput, IntegerInput } from "~~/components/scaffold-eth";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useState } from "react";

const SignedAgreement: NextPage = () => {
  const { address } = useAccount();
  const [nftAddress, setNftAddress] = useState("");
  const [tokenId, setTokenId] = useState("");

  // For updating loan conditions
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanDuration, setLoanDuration] = useState("");

  // Lock Collateral
  const { writeAsync: lockCollateral } = useScaffoldContractWrite({
    contractName: "SignedNFTAgreement",
    functionName: "lockCollateral",
    args: [nftAddress, tokenId],
  });

  // Release Collateral
  const { writeAsync: releaseCollateral } = useScaffoldContractWrite({
    contractName: "SignedNFTAgreement",
    functionName: "releaseCollateral",
  });

  // Update Loan Amount
  const { writeAsync: updateLoanAmount } = useScaffoldContractWrite({
    contractName: "SignedNFTAgreement",
    functionName: "updateLoanAmount",
    args: [loanAmount],
  });

  // Update Interest Rate
  const { writeAsync: updateInterestRate } = useScaffoldContractWrite({
    contractName: "SignedNFTAgreement",
    functionName: "updateInterestRate",
    args: [interestRate],
  });

  // Update Loan Duration
  const { writeAsync: updateLoanDuration } = useScaffoldContractWrite({
    contractName: "SignedNFTAgreement",
    functionName: "updateLoanDuration",
    args: [loanDuration],
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage NFT Collateral</h1>

      <div>
        <h2 className="text-xl">Lock / Release Collateral</h2>
        <AddressInput value={nftAddress} onChange={setNftAddress} placeholder="NFT Address" />
        <IntegerInput
          value={tokenId}
          onChange={(newValue: string | bigint) => setTokenId(newValue.toString())}
          placeholder="Token ID"
        />
        <button className="btn btn-primary" onClick={() => lockCollateral()}>
          Lock Collateral
        </button>
        <button className="btn btn-secondary" onClick={() => releaseCollateral()}>
          Release Collateral
        </button>
      </div>

      <IntegerInput
        value={loanAmount}
        onChange={(newValue: string | bigint) => setLoanAmount(newValue.toString())}
        placeholder="Loan Amount (wei)"
      />
    </div>
  );
};

export default SignedAgreement;
