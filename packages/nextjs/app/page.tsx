"use client";

import { Button, Col, Modal, Row } from "antd";

import { Address } from "~~/components/scaffold-eth";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import type { NextPage } from "next";
import Typography from "@mui/material/Typography";
import { useAccount } from "wagmi";
import { useState } from "react";

const baseURL = "https://eth-mainnet.g.alchemy.com/v2/374l9-eucheJf7r_lvnEZbEJ3dmtKRqn";

const requestOptions: RequestInit = {
  method: "GET",
  redirect: "follow" as RequestRedirect | undefined,
};

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const [nfts, setNfts] = useState([]);

  const info = (nft: any) => {
    Modal.info({
      title: nft.title,
      content: (
        <div>
          <p>
            <b>Contract:</b> {nft.contract.address}
          </p>
          <p>
            <b>Name:</b> {nft.contractMetadata.name} ({nft.contractMetadata.symbol})
          </p>
          <p>
            <b>Token ID:</b> {nft.id.tokenId}
          </p>
          <p>
            <b>Description:</b> {nft.description.slice(0, 100) || "No description"}
          </p>
          <p>
            <b>Last Updated:</b> {nft.timeLastUpdated}
          </p>
          <p>
            <a href={nft.tokenUri.gateway} target="_blank" rel="noopener noreferrer">
              View on IPFS
            </a>
          </p>
        </div>
      ),
      onOk() {},
    });
  };
  const { Meta } = Card;

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">NectarFinance!</span>
          </h1>
          <p className="text-center">Connect your wallet to get started!</p>
          {connectedAddress && (
            <div className="flex justify-center items-center space-x-2">
              <p className="my-2 font-medium">Connected Address:</p>
              <br />
              <Address address={connectedAddress} />
              <br />
              <Button
                onClick={() => {
                  const url = `${baseURL}/getNFTs/?owner=${connectedAddress}`;

                  fetch(url, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                      console.log(result);
                      setNfts(result.ownedNfts);
                    })
                    .catch(error => console.log("error", error));
                }}
              >
                Fetch NFTs
              </Button>
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
            {nfts.length > 0 &&
              nfts.map((nft: any, index) => (
                <>
                  {/* <Card
                  key={index}
                    style={{ width: 200 }}
                  >
                    <img style={{ height: 200, objectFit: "cover", borderBottomRightRadius: "1em",borderBottomLeftRadius: "1em" }} alt="example" src={nft.media[0].gateway} />
                    <Meta title={nft.title} description={nft.description.slice(0,50)} />
                    <br />
                    <Button onClick={() => info(nft)}>More Info</Button>
                  </Card> */}
                  <Card sx={{ width: 250, borderRadius: "1em" }} align="center">
                    <CardMedia
                      sx={{
                        height: 250,
                        objectFit: "cover",
                        borderBottomRightRadius: "1em",
                        borderBottomLeftRadius: "1em",
                      }}
                      image={nft.media[0].gateway}
                      title="green iguana"
                    />
                    <CardContent >
                      <Typography gutterBottom variant="h6" component="div">
                        {nft.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {nft.description.slice(0, 50)}
                      </Typography>
                      <br />
                      <Button onClick={() => info(nft)}>More Info</Button>
                    </CardContent>
                  </Card>
                </>
              ))}
          </div>
        </div>

        {/* <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Home;
