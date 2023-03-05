import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import { ToastProvider } from "react-toast-notifications";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Goerli;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    
    <ThirdwebProvider desiredChainId={activeChainId}>
      <ToastProvider autoDismiss={true} autoDismissTimeout={2000}>
        <Component {...pageProps} />
        </ToastProvider>
      </ThirdwebProvider>
    
    
  );
  
}

export default MyApp;
