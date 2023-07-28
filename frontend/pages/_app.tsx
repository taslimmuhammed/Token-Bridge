import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import { useState } from "react";
import ChainContext from "../Context/chainContext";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
function MyApp({ Component, pageProps }: AppProps) {
  const [selectedChain, setSelectedChain] = useState("goerli");

return (
  <ChainContext.Provider value={{ selectedChain, setSelectedChain }}>
    <ThirdwebProvider activeChain={selectedChain}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  </ChainContext.Provider>
);
}

export default MyApp;
