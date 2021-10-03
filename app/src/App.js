import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import GM_Interface from "./utils/GM_Interface.json";
import GN_Interface from "./utils/GN_Interface.json";
import "./App.css";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [sunDisplay, setSunDisplay] = useState(true)
  const [GMs, setGMs] = useState([]); const [GNs, setGNs] = useState([]); 
  const [msg, setMsg] = useState("");


  const GM_ContractAddress = "0x43108fB20F44Aee854E338EA310f2Be03Dc07392";
  const GN_ContractAddress = "0xb246575Ab34ad709695CAd8d53bf67Da26457063";

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) { console.log("Make sure you have metamask!");
      } else { console.log("We have the ethereum object", ethereum);}
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getGMs(); getGNs();
      } else { console.log("No authorized account found"); }

    } catch (error) { console.log(error); }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) { alert("Get MetaMask!");}
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      getGMs(); getGNs();
    } catch (error) { console.log(error); }
  };

  const gm = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum); const signer = provider.getSigner();
        const GM_Contract = new ethers.Contract(GM_ContractAddress, GM_Interface.abi, signer);
        const GM_Txn = await GM_Contract.gm(msg); console.log("Mining...", GM_Txn.hash); setMsg("");
        await GM_Txn.wait(); console.log("Mined -- ", GM_Txn.hash);
		getGMs()
      } else { console.log("Ethereum object doesn't exist!"); }
    } catch (error) { console.log(error); }
  };

  const gn = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum); const signer = provider.getSigner();
        const GN_Contract = new ethers.Contract(GN_ContractAddress, GN_Interface.abi, signer);
        const GN_Txn = await GN_Contract.gn(msg); console.log("Mining...", GN_Txn.hash); setMsg("");
        await GN_Txn.wait(); console.log("Mined -- ", GN_Txn.hash);
		getGNs()
      } else { console.log("Ethereum object doesn't exist!"); }
    } catch (error) { console.log(error); }
  };

  const getGMs = async () => {
    try {
		const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum); const signer = provider.getSigner();
        const GM_Contract = new ethers.Contract( GM_ContractAddress, GM_Interface.abi, signer);
        
		const getAllGMs = await GM_Contract.getAllGMs(); let GMsCleaned = [];
        getAllGMs.forEach((gm) => {
			GMsCleaned.push({ address: gm.gmr, timestamp: new Date(gm.timestamp * 1000), message: gm.message});
        });
		setGMs(GMsCleaned); console.log(GMsCleaned)

        GM_Contract.on("NewGM", (from, timestamp, message) => {
          	setGMs((prevState) => [...prevState, { address: from, timestamp: new Date(timestamp * 1000), message: message}]);
        });
      } else { console.log("Ethereum object doesn't exist!"); }
    } catch (error) { console.log(error); }
  };

  const getGNs = async () => {
    try {
		const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum); const signer = provider.getSigner();
        const GN_Contract = new ethers.Contract( GN_ContractAddress, GN_Interface.abi, signer);
        
		const getAllGNs = await GN_Contract.getAllGNs(); let GNsCleaned = [];
        getAllGNs.forEach((gn) => {
			GNsCleaned.push({ address: gn.gnr, timestamp: new Date(gn.timestamp * 1000), message: gn.message});
        });
		setGMs(GNsCleaned); console.log(GNsCleaned)

        GN_Contract.on("NewGN", (from, timestamp, message) => {
          	setGNs((prevState) => [...prevState, { address: from, timestamp: new Date(timestamp * 1000), message: message}]);
        });
      } else { console.log("Ethereum object doesn't exist!"); }
    } catch (error) { console.log(error); }
  };


  	useEffect(() => { 
		checkIfWalletIsConnected();
		window.addEventListener("mousemove", (e) => setMousePos({x:e.clientX, y:e.clientY}));
	}, []);

	useEffect(() => {
		if (sunDisplay && mousePos.y > (window.innerHeight * .55)) setSunDisplay(false);
		if (!sunDisplay && mousePos.y <= (window.innerHeight * .55)) setSunDisplay(true);
	}, [mousePos]);

  return (
    <div className="container main">
		<div className="container head">
				<h1 className="logo">gm & gn !</h1>
				{/* If there is no currentAccount set, render the connect button */}
				{!currentAccount && (<button className="btn connectBtn" onClick={connectWallet}> connect </button>)}
				{/* If currentAccount is set, render the social row */}
				{currentAccount && (
					<div className="socialRow">
						<img className="icon" src="./icons/twitter_flat.png" onClick={() => window.open('https://www.twitter.com/jakebychoice')}/>
						<img className="icon" src="./icons/github_flat.png" onClick={() => window.open('https://github.com/JakeRoyRandall')}/>
					</div>
				)}
		</div>
		<div className="container main">
			{ sunDisplay ?
				<img className="emoji sun" src="./icons/apple/swf_apple.png" /> :
				<img className="emoji moon" src="./icons/apple/mwf_apple.png" />
			}
			<div className="container gm">
				<div className="container section btnSection">
					<h1 className="gmHeading">gm</h1>
					<button className="btn gmBtn" onClick={ gm }>send a gm</button>
				</div>
				<div className="container section msgSection">
					{GMs.map((gm, index) => {
						return (
							<div key={index} className="msg">
								<div>gm from {gm.address}!</div>
							</div>
						);
					})}
					
					{/* {GMs.map((gm, index) => {
						return (
							<div key={index} className="msg">
								<div>Address: {gm.address}</div>
								<div>Time: {gm.timestamp.toString()}</div>
								<div>Message: {gm.message}</div>
							</div>
						);
					})} */}
				</div>

				{/* SET MSG VARIABLE CODE */}
				{/* <input
				type="text"
				value={msg}
				onChange={(e) => setMsg(e.target.value)}
				/> */}

			</div>
			<div className="container gn">
				<div className="container section msgSection">
					{GNs.map((gm, index) => {
						return (
							<div key={index} className="msg">
								<div>gn from {gm.address}!</div>
							</div>
						);
					})}
					{/* {GNs.map((gn, index) => {
						return (
							<div key={index} className="msg">
								<div>Address: {gn.address}</div>
								<div>Time: {gn.timestamp.toString()}</div>
								<div>Message: {gn.message}</div>
							</div>
						);
					})} */}
				</div>
				<div className="container section btnSection">
					<h1 className="gnHeading">gn</h1>
					<button className="btn gnBtn" onClick={ gn }>send a gn</button>
				</div>
			</div>
		</div>
    </div>
  );
};

export default App;