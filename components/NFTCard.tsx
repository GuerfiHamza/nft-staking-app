import {
  ThirdwebNftMedia,
  useContract,
  useNFT,
  Web3Button,
} from "@thirdweb-dev/react";
import type { FC } from "react";
import {
  nftDropContractAddress,
  stakingContractAddress,
} from "../consts/contractAddresses";
import styles from "../styles/Home.module.css";

interface NFTCardProps {
  tokenId: number;
}

const NFTCard: FC<NFTCardProps> = ({ tokenId }) => {
  const { contract } = useContract(nftDropContractAddress, "nft-drop");
  const { data: nft } = useNFT(contract, tokenId);

  return (
    <>
      {nft && (
        <div className="border py-5 border-blue2 bg-blue3 mb-5 hover:border-blue1">
          {nft.metadata && (
            <ThirdwebNftMedia
              metadata={nft.metadata}
              className="w-52	"
            />
          )}
          <h3 className="px-3 pt-5">{nft.metadata.name}</h3>
          <div className="flex justify-between items-center">
          <p className={styles.status}>Staked</p>

          <Web3Button
            action={(contract) => contract?.call("withdraw", [nft.metadata.id])}
            contractAddress={stakingContractAddress}
            className={styles.btn}
            >
            Withdraw
          </Web3Button>
        </div>
        </div>
      )}
    </>
  );
};
export default NFTCard;
