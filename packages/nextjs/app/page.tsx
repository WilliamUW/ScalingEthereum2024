"use client";

import { Button, Col, Modal, Row } from "antd";

import { Address } from "~~/components/scaffold-eth";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import type { NextPage } from "next";
import Typography from "@mui/material/Typography";
import lighthouse from "@lighthouse-web3/sdk";
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
  const [selectedNft, setSelectedNft] = useState(null);
  const [loanRequested, setLoanRequested] = useState(false);
  const [contractSigned, setContractSigned] = useState(false);
  const [step, setStep] = useState(0);
  const [ipfsLink, setIpfsLink] = useState("");

  const requestLoan = (nft: any) => {};

  const storeWeb3FilesTest = async (address: string, nft: any) => {
    const currentTime = new Date().toISOString();
    const text = `Borrower: ${address}
    
    NFT Collateral: ${nft.title} - ${nft.description}

    Time: ${currentTime}
    
    Loan Amount: 100 USDC
    `;
    const apiKey = "13d44665.a912997a74e3434f8ce7a7ca7a2135f7";
    const name = `${currentTime} - Loan for ${address} with the NFT ${nft.title} as collateral.`; //Optional

    const response = await lighthouse.uploadText(text, apiKey, name);

    console.log(response);

    setIpfsLink("https://gateway.lighthouse.storage/ipfs/" + response.data.Hash);
  };

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

  const nftCard = (nft: any) => {
    <Card sx={{ width: 250, borderRadius: "1em" }}>
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
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {nft.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {nft.description.slice(0, 50)}
        </Typography>
        <br />
        <Button onClick={() => info(nft)}>More Info</Button>
        <Button onClick={() => setSelectedNft(nft)}>Request Loan</Button>
      </CardContent>
    </Card>;
  };
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
                      setStep(1);
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
              step === 1 &&
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
                  <Card sx={{ width: 250, borderRadius: "1em" }}>
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
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {nft.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {nft.description.slice(0, 50)}
                      </Typography>
                      <br />
                      <Button onClick={() => info(nft)}>More Info</Button>
                      <Button
                        onClick={() => {
                          setStep(2);
                          setSelectedNft(nft);
                        }}
                      >
                        Request Loan
                      </Button>
                    </CardContent>
                  </Card>
                </>
              ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {step === 2 &&
              [selectedNft].map((nft: any, index) => (
                <>
                  <p>You can receive a loan of 100 USDC with the following NFT as collateral.</p>
                  <Card sx={{ width: 250, borderRadius: "1em" }}>
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
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {nft.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {nft.description.slice(0, 50)}
                      </Typography>
                      <br />
                    </CardContent>

                    <strong>Do you want to proceed?</strong>
                    <Button
                      onClick={() => {
                        setStep(3);
                        setLoanRequested(true);
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      onClick={() => {
                        setStep(1);
                        setSelectedNft(null);
                      }}
                    >
                      No
                    </Button>
                  </Card>
                </>
              ))}
          </div>
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              Please sign the following ETHSign contract to complete the loan request.
              <div>
                <p>Contract Details ...</p>
                <strong>Borrower:</strong> {connectedAddress}
                <strong>NFT Collateral</strong>
                nftCard(selectedNft)
                <p>Sign ...</p>
              </div>
              <Button
                onClick={() => {
                  setStep(4);
                  storeWeb3FilesTest(connectedAddress || "", selectedNft);
                }}
              >
                Contract Signed
              </Button>
              <Button
                onClick={() => {
                  setStep(2);
                }}
              >
                Back
              </Button>
            </div>
          )}
          {step === 4 && ipfsLink == "" && <div>Loading...</div>}
          {step === 4 && ipfsLink && (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <strong>Congrulations! The loan request process is complete.</strong>
              {ipfsLink && (
                <p>
                  Contract IPFS Link:{" "}
                  <a href={ipfsLink} target="_blank">
                    {ipfsLink}
                  </a>
                </p>
              )}
              <div>
                <p>Contract Details ...</p>
                <strong>Borrower:</strong> {connectedAddress}
                <strong>NFT Collateral</strong> nftCard(selectedNft)
                <p>Sign ...</p>
              </div>
              <Button
                onClick={() => {
                  setStep(1);
                }}
              >
                Done
              </Button>
            </div>
          )}
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
