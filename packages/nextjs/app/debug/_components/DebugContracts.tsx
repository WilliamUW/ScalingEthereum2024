"use client";

import { BarsArrowUpIcon } from "@heroicons/react/20/solid";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { ContractUI } from "~~/app/debug/_components/contract";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

const selectedContractStorageKey = "scaffoldEth2.selectedContract";
const contractsData = getAllContracts();
const contractNames = Object.keys(contractsData) as ContractName[];

export function DebugContracts() {
  const [selectedContract, setSelectedContract] = useLocalStorage<ContractName>(
    selectedContractStorageKey,
    contractNames[0],
    { initializeWithValue: false },
  );

  useEffect(() => {
    if (!contractNames.includes(selectedContract)) {
      setSelectedContract(contractNames[0]);
    }
  }, [selectedContract, setSelectedContract]);

  return (
    <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
      {contractNames.length === 0 ? (
        <p className="text-3xl mt-14">No contracts found!</p>
      ) : (
        <>
          {contractNames.length > 1 && (
            <div className="flex flex-row gap-2 w-full max-w-7xl pb-1 px-6 lg:px-10 flex-wrap">
              {contractNames.map(contractName => (
                <button
                  className={`btn btn-secondary btn-sm font-light hover:border-transparent ${
                    contractName === selectedContract
                      ? "bg-base-300 hover:bg-base-300 no-animation"
                      : "bg-base-100 hover:bg-secondary"
                  }`}
                  key={String(contractName)}
                  onClick={() => setSelectedContract(contractName)}
                >
                  {String(contractName)} // Convert contractName to string
                  {contractsData[String(contractName)].external && (
                    <span className="tooltip tooltip-top tooltip-accent" data-tip="External contract">
                      <BarsArrowUpIcon className="h-4 w-4 cursor-pointer" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
          {contractNames.map(contractName => (
            <ContractUI
              key={String(contractName)}
              contractName={contractName}
              className={contractName === selectedContract ? "" : "hidden"}
            />
          ))}
        </>
      )}
    </div>
  );
}
