"use client";

import type { NextPage } from "next";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const Events: NextPage = () => {
  // BuyTokens Events
  const { data: buyTokenEvents, isLoading: isBuyEventsLoading } = useScaffoldEventHistory({
    contractName: "Vendor",
    eventName: "BuyTokens",
    fromBlock: 5649168n,
  });

  // CollateralLocked Events
  const { data: collateralLockedEvents, isLoading: isCollateralLockedLoading } = useScaffoldEventHistory({
    contractName: "SignedNFTAgreement",
    eventName: "CollateralLocked",
    fromBlock: 0n,
  });

  // CollateralReleased Events
  const { data: collateralReleasedEvents, isLoading: isCollateralReleasedLoading } = useScaffoldEventHistory({
    contractName: "SignedNFTAgreement",
    eventName: "CollateralReleased",
    fromBlock: 0n,
  });

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      {/* Existing BuyTokens Events section here */}
      
      {/* CollateralLocked Events */}
      <div className="mt-14">
        <div className="text-center mb-4">
          <span className="block text-2xl font-bold">Collateral Locked Events</span>
        </div>
        {isCollateralLockedLoading ? (
          <div className="flex justify-center items-center mt-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-lg">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th className="bg-primary">NFT Address</th>
                  <th className="bg-primary">Token ID</th>
                </tr>
              </thead>
              <tbody>
                {!collateralLockedEvents || collateralLockedEvents.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center">No events found</td>
                  </tr>
                ) : (
                  collateralLockedEvents?.map((event, index) => (
                    <tr key={index}>
                      <td className="text-center">
                        <Address address={event.args.nftAddress} />
                      </td>
                      <td>{event.args.tokenId.toString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CollateralReleased Events */}
      <div className="mt-14">
        <div className="text-center mb-4">
          <span className="block text-2xl font-bold">Collateral Released Events</span>
        </div>
        {isCollateralReleasedLoading ? (
          <div className="flex justify-center items-center mt-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-lg">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th className="bg-primary">NFT Address</th>
                  <th className="bg-primary">Token ID</th>
                </tr>
              </thead>
              <tbody>
                {!collateralReleasedEvents || collateralReleasedEvents.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center">No events found</td>
                  </tr>
                ) : (
                  collateralReleasedEvents?.map((event, index) => (
                    <tr key={index}>
                      <td className="text-center">
                        <Address address={event.args.nftAddress} />
                      </td>
                      <td>{event.args.tokenId.toString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
