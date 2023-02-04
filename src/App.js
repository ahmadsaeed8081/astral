/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import "./css/App.scss";
import Web3 from "web3";
import { cont_address, cont_abi, tokenABI, Token_address } from "../src/components/config";
import WalletConnectProvider from "@walletconnect/web3-provider";

import Header from "./components/Header";
import Footer from "./components/Footer";
// import Sidebar from "./components/Sidebar";
import Main from "./Pages/Home";
import Login from "./Pages/Login";





function App() {
  const [address, set_address] = useState(null);
  const [web3, set_web3] = useState(null);
  const [provider, set_provider] = useState(null);
  const [openWallet, setOpenWallet] = useState(false);
  const [itsview, set_itsview] = useState(false);

  const [isWalletConnected, set_isWalletConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [matic, set_matic] = useState(0);

  function set_user(_add, _provider, _web3, balance, matic,itsview) {
    console.log("ihjono " + _add);
    set_address(_add);
    set_itsview(itsview)

    set_isWalletConnected(true);
    set_provider(_provider);
    set_web3(_web3);
    set_matic(matic);
    setBalance(balance);
    console.log("ihjono " + address);
  }
  function search_Data(_add,itsview) {
    console.log("ihjono " + _add);
    set_address(_add);
    set_itsview(itsview)

    set_isWalletConnected(true);
    // // set_provider(_provider);
    // // set_web3(_web3);
    // set_matic(matic);
    // setBalance(balance);
    // console.log("ihjono " + address);
  }




  // async function Connect_Wallet(id) {
  //   let provider;
  //   let web3;
  //   let accounts;


  //   const NETWORK_ID = "56";
  //   const NETWORK_ID_hex = "0x38";

  //   // set_clicked(true);


  //   if (id == "1") {
  //     //metmask
  //     provider = window.ethereum;
  //     console.log("meta and trust provider");
  //     // alert(provider._metamask);
  //     console.log(provider.isMetaMask);
  //     web3 = new Web3(provider);
  //     const networkId = await web3.eth.net.getId();
  //     set_web3(web3);
  //     if (networkId == NETWORK_ID) {
  //       accounts = await provider.request({ method: "eth_requestAccounts" });
  //       set_address(accounts[0]);
  //       setOpenWallet(false);
  //       const contract1 = new web3.eth.Contract(tokenABI, Token_address);

  //       let balance = await contract1.methods.balanceOf(accounts[0]).call();

  //       let matic = await web3.eth.getBalance(accounts[0]);
  //       balance = web3.utils.fromWei(balance, "ether");
  //       matic = web3.utils.fromWei(matic, "ether");

  //       set_user(accounts[0], web3, provider, balance, matic);

  //       console.log("object" + matic);
  //     } else {
  //       try {
  //         await provider.request({
  //           method: "wallet_switchEthereumChain",
  //           params: [{ chainId: NETWORK_ID_hex }],
  //         });
  //         Connect_Wallet(id);
  //       } catch {}
  //     }
  //   } else if (id == "2") {
  //     //trust 1Wallet
  //     provider = new WalletConnectProvider({
  //       rpc: {
  //         // 137: "https://polygon-mainnet.g.alchemy.com/v2/eRdxPlEv3QpMS-1nPDFkjtO-qDmurAoF",
  //         137: "https://polygon-mainnet.infura.io/v3/294ba86a2f504ea0947006554734c90b",
  //       },
  //       chainId: 137,
  //     });

  //     console.log(provider);
  //     console.log(provider.wc.peerMeta);
  //     await provider.enable();

  //     console.log("this is provider");
  //     console.log(provider.wc.peerMeta.name);

  //     web3 = new Web3(provider);

  //     const networkId = await web3.eth.net.getId();
  //     console.log("yguygy7 " + networkId);
  //     if (networkId == NETWORK_ID) {
  //       accounts = await web3.eth.getAccounts();
  //       set_address(accounts[0]);
  //       setOpenWallet(false);

  //       const contract1 = new web3.eth.Contract(tokenABI, Token_address);

  //       let balance = await contract1.methods.balanceOf(accounts[0]).call();

  //       let matic = await web3.eth.getBalance(accounts[0]);
  //       balance = web3.utils.fromWei(balance, "ether");
  //       matic = web3.utils.fromWei(matic, "ether");
  //       set_user(accounts[0], web3, provider, balance, matic);
  //     }
  //   } else if (id == "3") {
  //     //Wallet connect
  //     provider = new WalletConnectProvider({
  //       rpc: {
  //         // 137: "https://polygon-mainnet.g.alchemy.com/v2/eRdxPlEv3QpMS-1nPDFkjtO-qDmurAoF",
  //         137: "https://polygon-mainnet.infura.io/v3/294ba86a2f504ea0947006554734c90b",
  //       },
  //       chainId: 137,
  //     });
  //     await provider.enable();

  //     console.log("this is provider");
  //     console.log(provider.wc.peerMeta);

  //     web3 = new Web3(provider);

  //     const networkId = await web3.eth.net.getId();
  //     console.log("yguygy7 " + networkId);
  //     if (networkId == NETWORK_ID) {
  //       accounts = await web3.eth.getAccounts();
  //       set_address(accounts[0]);
  //       setOpenWallet(false);

  //       const contract1 = new web3.eth.Contract(tokenABI, Token_address);

  //       let balance = await contract1.methods.balanceOf(accounts[0]).call();

  //       let matic = await web3.eth.getBalance(accounts[0]);

  //       balance = web3.utils.fromWei(balance, "ether");
  //       matic = web3.utils.fromWei(matic, "ether");

  //      set_user(accounts[0], web3, provider, balance, matic);
  //     } else {
  //       if (provider.wc.peerMeta.name == "MetaMask") {
  //         await provider.request({
  //           method: "wallet_switchEthereumChain",
  //           params: [{ chainId: "0x89" }],
  //         });
  //         Connect_Wallet(id);
  //       } else {
  //         setOpenWallet(false);

  //         await provider.disconnect();
  //         alert("Kindly change your network to polygon");
  //       }
  //     }
  //   }
  //   set_web3(web3);
  // }





  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login
                  web3={web3}
                  isWalletConnected={isWalletConnected}
                  matic={matic}
                  balance={balance}
                  address={address}
                  set_user={set_user}

                />
              </PublicRoute>
            }
          />
          <Route
            exact
            path="/home"
            element={
              <ProtectedRoute>
                <Main
                  web3={web3}
                  provider={provider}
                  isWalletConnected={isWalletConnected}
                  matic={matic}
                  balance={balance}
                  address={address}
                  search_Data={search_Data}
                  set_user={set_user}
                  itsview={itsview}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
