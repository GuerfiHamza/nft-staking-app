import {
  ConnectWallet,
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useContractRead,
  useOwnedNFTs,
  useTokenBalance,
  Web3Button,
} from "@thirdweb-dev/react";
import Router from "next/router";
import { BigNumber, ethers } from "ethers";
import type { NextPage } from "next";
import { Suspense, useEffect, useState } from "react";
import Image from 'next/image'
import NFTCard from "../components/NFTCard";
import CircularProgress from '@mui/material/CircularProgress';
import { useToasts } from "react-toast-notifications";
import Script from 'next/script'
import {
  nftDropContractAddress,
  stakingContractAddress,
  tokenContractAddress,
} from "../consts/contractAddresses";
import styles from "../styles/Home.module.css";
const Stake: NextPage = () => {
  const address = useAddress();
  const { contract: nftDropContract } = useContract(
    nftDropContractAddress,
    "nft-drop"
  );
  const { contract: tokenContract } = useContract(
    tokenContractAddress,
    "token"
  );
  const { contract, isLoading } = useContract(stakingContractAddress);
  const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
  const { data: stakedTokens } = useContractRead(
    contract,
    "getStakeInfo",
    address
  );
  const { addToast } = useToasts();

  useEffect(() => {
    if (!contract || !address) return;

    async function loadClaimableRewards() {
      const stakeInfo = await contract?.call("getStakeInfo", address);
      setClaimableRewards(stakeInfo[1]);
    }

    loadClaimableRewards();
  }, [address, contract]);
  // , claimableRewards
  async function stakeNft(id: string) {
    if (!address) return;

    const isApproved = await nftDropContract?.isApproved(
      address,
      stakingContractAddress
    );
    if (!isApproved) {
      await nftDropContract?.setApprovalForAll(stakingContractAddress, true);
    }
    try {
      const data = await contract?.call("stake", [id]);

    } catch (err) {
      console.error("contract call failure", err);
    }
  }
  function success() {
    addToast("Success!", { appearance: "success" });
    Router.reload();
  }
  async function withdrawNft(id: string) {
    if (!address) return;

    const isApproved = await nftDropContract?.isApproved(
      address,
      stakingContractAddress
    );
    if (!isApproved) {
      await nftDropContract?.setApprovalForAll(stakingContractAddress, true);
    }
    await contract?.call("withdraw", [id]);
  }
  if (isLoading) {

    return <div className="flex flex-col h-screen justify-center items-center bg-purple2">
      <Image src="/ghostbuddylogo.png" alt="Ghostbuddy" width={300} height={150} className="logo" />
      <h1 className='text-5xl font-semibold'>Loading...</h1>
    </div>;
  }
  let ids = ownedNfts?.map((nft) => Number(nft.metadata.id)).slice(0, 5);
  let stakedT = stakedTokens && stakedTokens[0]?.map((stakedToken: BigNumber) => (stakedToken.toNumber()));

  return (
    <Suspense fallback={<CircularProgress color="secondary" />}>
       {!address ? (
        <div className="flex flex-col h-screen justify-center items-center bg-purple2">
          <ConnectWallet />
        </div>

        ) : (
      <div className="container mx-auto">
       
          <>
            <div className="flex">
              <div className="flex-1 w-16 my-auto">
                <h1 className=" text-left title">GBN Staking</h1>
                <div className="mt-5 flex flex-row items-center ">
                  <div data-tabopen="tab1" className="tabbtn categories font-semibold cursor-pointer bg-blue1 px-16 py-5 rounded-lg">ALL</div>
                  <div data-tabopen="tab2" className="tabbtn cursor-pointer font-semibold px-16 py-5 text-white">Staked Ghosts ({stakedTokens?.length})</div>
                  <div data-tabopen="tab3" className="tabbtn cursor-pointer font-semibold px-16 py-5 text-white">Unstaked Ghosts ({ownedNfts?.length ?? stakedTokens - stakedTokens?.length})</div>
                </div>
              </div>
              <div className="flex-1 px-5 py-5 ">
                <div className="flex bg-gradient-to-r from-blue1 to-pink1 mx-5 my-5 w-3/4 rounded-xl items-center justify-center py-5 h-32 border-4 border-purple1 boxf">
                  <div className=" mx-auto border-r-2">
                    <p className="text-grey1 pr-20">Current Balance</p>
                    <p className="">
                      <b>
                        {!tokenBalance
                          ? "Loading..." : " "}
                      </b>{" "}
                      <b>{tokenBalance?.displayValue}</b> {tokenBalance?.symbol}
                    </p>
                  </div>
                  <div className=" mx-auto">
                    <p className="text-grey1">Claimable Rewards</p>
                    <p className="">
                      <b>
                        {!claimableRewards
                          ? "Loading..."
                          : ethers.utils.formatUnits(claimableRewards, 18)}
                      </b>{" "}
                      {tokenBalance?.symbol}
                    </p>
                  </div>
                  <Web3Button
                    action={(contract) => contract.call("claimRewards")}
                    contractAddress={stakingContractAddress}
                    className={styles.calimbtn}
                    onSuccess={success}
                    onError={() => addToast("Error!", { appearance: "error" })}
                  >
                    Claim
                  </Web3Button>
                </div>
              </div>


            </div>





            <div id="tab1" className="tab mt-1 items-center px-12 mx-auto">
              <div className={styles.nftBoxGrid}>
              <b>
                  {!stakedTokens
                    ? <CircularProgress color="secondary" /> : " "}
                </b>{" "}
                {stakedTokens &&
                  stakedTokens[0]?.map((stakedToken: BigNumber) => (
                    <NFTCard
                      tokenId={stakedToken.toNumber()}
                      key={stakedToken.toString()}
                    />
                  ))}
              </div>
              <div className={styles.nftBoxGrid}>
                <b>
                  {!ownedNfts
                    ? <CircularProgress color="secondary" /> : " "}
                </b>{" "}
                {ownedNfts?.map((nft) => (

                  <div className="py-5 mb-5 customborder hover:border-blue1" key={nft.metadata.id.toString()}>
                    <ThirdwebNftMedia
                      metadata={nft.metadata}
                      className="w-52	"
                    />
                    <h3 className="px-3 pt-5">{nft.metadata.name}</h3>
                    <div className="flex justify-between items-center">
                      <p className={styles.status}>Unstaked</p>

                      <Web3Button
                        contractAddress={stakingContractAddress}
                        action={() => stakeNft(nft.metadata.id)}
                        className={styles.btn}
                        onSuccess={() => addToast("Success!", { appearance: "success" })}
                        onError={() => addToast("Success!", { appearance: "error" })}
                      >
                        Stake
                      </Web3Button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            <div id="tab2" className="tab mt-1 items-center px-12 hidden">
              <div className={styles.nftBoxGrid}>

              <b>
                  {!stakedTokens
                    ? <CircularProgress color="secondary" /> : " "}
                </b>{" "}
                {stakedTokens &&
                  stakedTokens[0]?.map((stakedToken: BigNumber) => (
                    <NFTCard
                      tokenId={stakedToken.toNumber()}
                      key={stakedToken.toString()}
                    />
                  ))}
              </div>
            </div>

            <div id="tab3" className="tab mt-1 items-center px-12 hidden">
              <div className={styles.nftBoxGrid}>
                <b>
                  {!ownedNfts
                    ? <CircularProgress color="secondary" /> : " "}
                </b>{" "}
                {ownedNfts?.map((nft) => (
                  <div className="py-5 mb-5 customborder hover:border-blue1" key={nft.metadata.id.toString()}>
                    <ThirdwebNftMedia
                      metadata={nft.metadata}
                      className="w-52	"
                    />
                    <h3 className="px-3 pt-5">{nft.metadata.name}</h3>
                    <div className="flex justify-between items-center">
                      <p className={styles.status}>Unstaked</p>

                      <Web3Button
                        contractAddress={stakingContractAddress}
                        action={() => stakeNft(nft.metadata.id)}
                        className={styles.btn}
                        onSuccess={() => addToast("Success!", { appearance: "success" })}
                        onError={() => addToast("Success!", { appearance: "error" })}
                      >
                        Stake
                      </Web3Button>

                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Script id="my-script">{`const tabs = document.querySelectorAll(".tab");
              const tabBtns = document.querySelectorAll(".tabbtn");
        
              tabBtns.forEach((tabBtn) => {
                tabBtn.addEventListener("click", () => {
        
                  tabs.forEach((tab) => {
                    tab.classList.add("hidden");
                  });
        
                  const tab = tabBtn.getAttribute("data-tabopen");
                  document.getElementById(tab).classList.remove("hidden");
                  
                  tabBtns.forEach((tabBtn) => {
                    tabBtn.className =
                      "tabbtn px-16 py-5 font-semibold text-white cursor-pointer";
                  });
         
                  tabBtn.className =
                    "tabbtn px-16 py-5 categories cursor-pointer bg-blue1 rounded-lg";
                });
              });`}</Script>

            <div className=" ml-36">
              <h1 className="footer flex">
                Powered by &#160; <a href="https://yxn.io/" target="_blank" rel="noreferrer"><Image src="/yxnlogo.png" width={120} height={25} alt="YXN Company" className="footerimage" /></a>
              </h1>
            </div>
          </>

        
      </div>
      )}
    </Suspense>
  );


};

export default Stake;
