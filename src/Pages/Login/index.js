import React,{useEffect, useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserToken } from "../../store/reducers/authReducer";
import ConnectWallet from "../../components/ConnectWallet";
import { useLocation } from "react-router-dom";
import Modal1 from "../../../src/components/Modal1.js";
import Web3 from "web3";
import { cont_address, cont_abi, tokenABI, Token_address } from "../../../src/components/config";
import WalletConnectProvider from "@walletconnect/web3-provider";
// import { useFocusEffect } from '@react-navigation/native';

const Login = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isWalletConnected, set_isWalletConnected] = useState(false);

  const [address, set_address] = useState(null);
  const [viewAddress, set_viewAddress] = useState(null);

  const [option, set_choosed_option] = useState("");

  const [web3, set_web3] = useState(null);
  const [provider, set_provider] = useState(null);

  const [balance, set_balance] = useState(null);
  const [matic, set_matic] = useState(null);

  const [contract, set_contract] = useState(null);
  const [contract1, set_contract1] = useState(null);


  const [openWallet, setOpenWallet] = useState(false);

  const [ref, set_ref] = useState(null);
  const [refId, set_refId] = useState("");


  const location = useLocation();
  const params = new URLSearchParams(location.search);

useEffect( ()=>{
  set_refId(params.get("ref"));
})






  async function Connect_Wallet(id) {
    let provider;
    let web3;
    let accounts;



    const NETWORK_ID = "137";
    const NETWORK_ID_hex = "0x89";


    if (id == "1") {
      //metmask
      provider = window.ethereum;
      // alert(provider._metamask);
      console.log(provider.isMetaMask);
      web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      setOpenWallet(false);

      if (networkId == NETWORK_ID) {
        accounts = await provider.request({ method: "eth_requestAccounts" });
        set_address(accounts[0]);
        
        const contract = new web3.eth.Contract(cont_abi, cont_address);
        const contract1 = new web3.eth.Contract(tokenABI, Token_address);
        let balance = await contract1.methods.balanceOf(accounts[0]).call();
        
        let matic = await web3.eth.getBalance(accounts[0]);
        balance = web3.utils.fromWei(balance, "ether");
        matic = web3.utils.fromWei(matic, "ether");


        console.log("meta and trust provider ");
        set_balance(balance)
        set_matic(matic)
        set_provider(provider)
        set_web3(web3);
        set_contract(contract)
        set_contract1(contract1)

        set_isWalletConnected(true)

        if(option==0) //fetch account
        {
          const fee_paid = await contract.methods.is_paid(accounts[0]).call();


          if(fee_paid)
          { 
            props.set_user(accounts[0], web3, provider, balance, matic,false);            
            dispatch(setUserToken(true));

            navigate("/home");
          }
          else{
            alert("You are not a register member")
            return
          }


        }
        else if(option==1) //register
        { 
          let _ref;
          const fee_paid = await contract.methods.is_paid(accounts[0]).call();
          console.log("13");


          if(fee_paid)
          { 
            props.set_user(accounts[0], web3, provider, balance, matic,false);            
            dispatch(setUserToken(true));

            navigate("/home");
            return;
          }
          else if(params.get("ref")!=null){

            console.log("hello this it");
            let address=await contract.methods.idtoAddress(params.get("ref")).call();
              set_ref(address)

              console.log("this is is given ref address: "+address);
              _ref = address.toString();
            

          }
          const total_inv = await contract.methods.get_total_inv().call();

          let levelMatrix_fee = 20;
          let val=Number(total_inv)+1
          const newId = "crdmtx98"+val;
           
          console.log("this is newid " + newId);
          if (_ref == null) {
            _ref = "0x0000000000000000000000000000000000000000";
          }
          try 
          {

          if (Number(levelMatrix_fee) > Number(balance))
           {

              alert("You dont have enough DAI");
              return;
            }

            levelMatrix_fee = levelMatrix_fee * 10 ** 18;
            console.log(typeof levelMatrix_fee + "   " + levelMatrix_fee);
            console.log("this is ref1 " + _ref);

            await contract1.methods
              .approve(cont_address, levelMatrix_fee.toString())
              .send({ from: accounts[0] });
            const result = await contract.methods
              .level_matrix(_ref,newId.toString())
              .send({ from: accounts[0] });
            if (result) {
              props.set_user(accounts[0], web3, provider, balance, matic,false);            
              dispatch(setUserToken(true));

              navigate("/home");
            }
          } catch (error) {
            // Catch any errors for any of the above operations.

            console.error(error);
          }

        }
        else if(option==2)
        {
          let address=await contract.methods.idtoAddress(viewAddress.toString().toLowerCase()).call();
          console.log("hlo its view add "+address);
          // const fee_paid = await contract.methods.is_paid(viewAddress.toString()).call();
          if(address!="0x0000000000000000000000000000000000000000")
          {
            props.set_user(address, web3, provider, balance, matic,true);        
            dispatch(setUserToken(true));
    
            navigate("/home");

          }
          else{

            alert("This user is not registered")
          }
          


          
        }



      } else {
        try {
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: NETWORK_ID_hex }],
          });
          Connect_Wallet(id);
        } catch {}
      }
    } else if (id == "2" || id == "3") {
      //trust 1Wallet
      provider = new WalletConnectProvider({
        rpc: {
          137:"https://polygon-mainnet.g.alchemy.com/v2/bf3cnZO2AQyu_Kv4eBx6uI0Slhs5GhMv"
        },
        chainId: 137,
      });

      console.log("trust wallet");

      console.log(provider);
      console.log(provider.wc.peerMeta);
      await provider.enable();

      console.log("this is provider");
      console.log(provider.wc.peerMeta.name);

      web3 = new Web3(provider);
      setOpenWallet(false);

      const networkId = await web3.eth.net.getId();
      console.log("yguygy7 " + networkId);
      if (networkId == NETWORK_ID) {
        accounts = await web3.eth.getAccounts();        
        set_address(accounts[0]);
        const contract = new web3.eth.Contract(cont_abi, cont_address);
        const contract1 = new web3.eth.Contract(tokenABI, Token_address);
        let balance = await contract1.methods.balanceOf(accounts[0]).call();
 

        let matic = await web3.eth.getBalance(accounts[0]);
        balance = web3.utils.fromWei(balance, "ether");
        matic = web3.utils.fromWei(matic, "ether");


        set_isWalletConnected(true)
        set_balance(balance)
        set_matic(matic)
        set_provider(provider)
        set_web3(web3);
        set_contract(contract)
        set_contract1(contract1)

        if(option==0) //fetch account
        {

          const fee_paid = await contract.methods.is_paid(accounts[0]).call();


          if(fee_paid)
          { 
            props.set_user(accounts[0], web3, provider, balance, matic,false);            
            dispatch(setUserToken(true));

            navigate("/home");
          }
          else{
            await provider.disconnect();

            alert("You are not a register member")
            return
          }


        }
        else if(option==1) //register
        { 
          let _ref;
          const fee_paid = await contract.methods.is_paid(accounts[0]).call();
          console.log("13");


          if(fee_paid)
          { 
            props.set_user(accounts[0], web3, provider, balance, matic,false);            
            dispatch(setUserToken(true));

            navigate("/home");
            return;
          }
          else if(params.get("ref")!=null)
          {
              console.log("hello this it");
            let address=await contract.methods.idtoAddress(params.get("ref")).call();
              set_ref(address)

              console.log("this is is given ref address: "+address);
              _ref = address.toString();
            

          }
          const total_inv = await contract.methods.get_total_inv().call();

          let levelMatrix_fee = 20;
          let val=Number(total_inv)+1;
          const newId = "crdmtx98"+val;
           
          console.log("this is newid " + newId);
          if (_ref == null) {
            _ref = "0x0000000000000000000000000000000000000000";
          }
          try 
          {

          if (Number(levelMatrix_fee) > Number(balance))
           {
            await provider.disconnect();

              alert("You dont have enough DAI");
              return;
            }

            levelMatrix_fee = levelMatrix_fee * 10 ** 18;
            console.log(typeof levelMatrix_fee + "   " + levelMatrix_fee);
            console.log("this is ref1 " + _ref);

            await contract1.methods
              .approve(cont_address, levelMatrix_fee.toString())
              .send({ from: accounts[0] });
            const result = await contract.methods
              .level_matrix(_ref,newId.toString())
              .send({ from: accounts[0] });
            if (result) {
              props.set_user(accounts[0], web3, provider, balance, matic,false);            
              dispatch(setUserToken(true));

              navigate("/home");
            }
          } catch (error) {
            await provider.disconnect();
            console.error(error);
          }

        }
        else if(option==2)
        {
          let address= await contract.methods.idtoAddress(viewAddress.toString().toLowerCase()).call();

          // const fee_paid = await contract.methods.is_paid(viewAddress.toString()).call();
          if(address!="0x0000000000000000000000000000000000000000")
          {
            props.set_user(address, web3, provider, balance, matic,true);        
            dispatch(setUserToken(true));
    
            navigate("/home");
            await provider.disconnect();


          }
          else{
            await provider.disconnect();

            alert("This user is not registered")
          }
          
          


          
        }



      }else {
        if (provider.wc.peerMeta.name == "MetaMask") {
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x38" }],
          });
          Connect_Wallet(id);
        } else {
          setOpenWallet(false);

          await provider.disconnect();
          alert("Kindly change your network to Binance");
        }
      }
    } 

  }



  async function handleLogin(val) {
    // localStorage.setItem("token", true);




    if(val==2)
    {
      if(viewAddress==null)
      {
        alert("kindly put an id to view ")
        return;
      }
    }

    
      setOpenWallet(true);
      set_choosed_option(val);
    



 
    // navigate("/home");
  }
  return (
    <div className="login-page flex flex-col">
      <div className="wrap wrapWidth flex flex-col items-center justify-center">
        <div className="wrapper-box flex flex-col">
          <div className="container flex flex-col">
            <div className="logo flex items-center justify-center">
              <img src="./images/logo.png" type="png"  className="logo-img" />
            </div>
            <div className="login-desc">For view account ID</div>
            <input
              type="text"
              placeholder="Enter account ID"
              className="txt"
              value={viewAddress}
              onChange={(e) => {
              set_viewAddress(e.target.value);
            }}            />
            <div className="action flex items-center justify-between">
              <button className="btn button"onClick={(e) => handleLogin(2)}>VIEW</button>

              <div
                className="btn button"
                onClick={(e) => handleLogin(0)}
              >
                <p>Login Account</p>
              </div>

          
              {/* <button className="btn button" onClick={(e) => handleLogin(0)}>
                Fetch Account
              </button> */}
            </div>
            <div className="login-desc">FOR REGISTRATION</div>
            <input type="text" placeholder="REGISTER WITH US" className="txt" readOnly value={refId}/>
            <div className="action flex items-center justify-center">
              <button className="btn button" onClick={(e) => handleLogin(1)}>Register</button>
            </div>
          </div>
        </div>
      </div>
      <Modal1 open={openWallet} onClose={() => setOpenWallet(false)}>
        <ConnectWallet setOpenWallet={setOpenWallet} Connect_Wallet={Connect_Wallet}/>
      </Modal1>
    </div>
  );
};

export default Login;
