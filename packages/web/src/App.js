import React from "react";
// import WalletConnectProvider from "@walletconnect/web3-provider";
// import Web3Modal from "web3modal";
// import Web3 from "web3";
// import { useRecoilState } from "recoil";

const App = () => {
  // const [account, setAccount] = useRecoilState(accountState);

  const connect = async () => {
    // try {
    //   const providerOptions = {
    //     walletconnect: {
    //       package: WalletConnectProvider,
    //       options: {
    //         infuraId: "95f65ab099894076814e8526f52c9149",
    //       },
    //     },
    //   };
    //   const web3modal = new Web3Modal({
    //     //network: "mainnet",
    //     providerOptions,
    //   });
    //   const provider = await Web3Modal.connect();
    //   const web3 = new Web3(provider);
    //   const [account] = await web3.eth.getAccounts();
    //   setAccount(account);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  return (
    <div>
      <button onClick={connect}>Connect</button>
    </div>
  );
};

export default App;
