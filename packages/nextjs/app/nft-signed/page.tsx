"use client";

import { AddressInput, IntegerInput } from "~~/components/scaffold-eth";
import { getTokenPrice, multiplyTo1e18 } from "~~/utils/scaffold-eth/priceInWei";
import {
  useDeployedContractInfo,
  useScaffoldContractRead,
  useScaffoldContractWrite,
} from "~~/hooks/scaffold-eth";

import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
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
        <IntegerInput value={tokenId} onChange={setTokenId} placeholder="Token ID" />
        <button className="btn btn-primary" onClick={() => lockCollateral()}>
          Lock Collateral
        </button>
        <button className="btn btn-secondary" onClick={() => releaseCollateral()}>
          Release Collateral
        </button>
      </div>

      <div>
        <h2 className="text-xl">Update Loan Conditions</h2>
        <IntegerInput value={loanAmount} onChange={setLoanAmount} placeholder="Loan Amount (wei)" />
        <IntegerInput value={interestRate} onChange={setInterestRate} placeholder="Interest Rate (basis points)" />
        <IntegerInput value={loanDuration} onChange={setLoanDuration} placeholder="Loan Duration (seconds)" />
        <button className="btn btn-primary" onClick={() => updateLoanAmount()}>
          Update Loan Amount
        </button>
        <button className="btn btn-primary" onClick={() => updateInterestRate()}>
          Update Interest Rate
        </button>
        <button className="btn btn-primary" onClick={() => updateLoanDuration()}>
          Update Loan Duration
        </button>
      </div>
    </div>
  );
};

export default SignedAgreement;
