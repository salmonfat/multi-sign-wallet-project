import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";
import abi from "./contract/multiSign.json";

function App() {
  const contractAddress='0x9dB903b851979Cb310EaC9Bbd72431C0f98383c1';
  const contractABI=abi.abi;
  let array1=["","",0,"",""];

  const [isWallectConnect,setWallectConnet]=useState(false);
  const [inputValue,setInPutValue]=useState({_target:"",_amount:"",_id:"",_id1:"",_id2:"",_id3:"",newMember:"",deleted:"",IsMember:"",depositInMonet:""});
  const [yourWalletAddress,setYourWalletAddress]=useState(null);
  const [addcaseId,setAddcaseId]=useState("");
  const [isMember,setIsMember]=useState("");
  const [custmember,setCustmember]=useState("");
  const [areYouMember,setAreYouMember]=useState("");
  const [cases,setCases]=useState(array1);
  const [memberCount,setMemberCoint]=useState(0);
  const [contractBalance,setContractBalance]=useState(0);

  const [error, setError] = useState(null);

  const checkWalletConnect=async()=>{
    try{
      if (window.ethereum){
      const accounts=await window.ethereum.request({method: 'eth_requestAccounts'})
      const account = accounts[0];
      setWallectConnet(true);
      setYourWalletAddress(account);
      console.log("Account Connected: ", account);
    }else{
      setError("Install a MetaMask wallet.");
      console.log("No Metamask detected");
      }
    }catch(error){
      console.log(error);
    }
  }
  const addCaseIdEvent=async()=>{
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const Contract = new ethers.Contract(contractAddress, contractABI, provider);
    Contract.on("caseAdded",(id)=>{
      console.log("got the event",id.toString());
      setAddcaseId(id.toString());
    });
  }
  const addCase=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(contractAddress, contractABI, signer);

        let addcaseAmount=utils.parseUnits (inputValue._amount,"ether");
        const txn=await Contract.addCase(inputValue._target,addcaseAmount);
        console.log("adding");
        await txn.wait();
        console.log("done",txn.hash);
        addCaseIdEvent();
      }else{
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet.");
      }
    }catch(error){
      console.log(error);
    }
  }
  const confirm=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn=await Contract.confirm(inputValue._id);
        console.log("confirming");
        await txn.wait();
        console.log("done",txn.hash);
      }else{
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet.");
      }
    }catch(error){
      console.log(error);
    }
  }
  const revoke=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn=await Contract.revoke(inputValue._id1);
        console.log("revoking");
        await txn.wait();
        console.log("done",txn.hash);
      }else{
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet.");
      }
    }catch(error){
      console.log(error);
    }
  }
  const execute=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn=await Contract.execute(inputValue._id2);
        console.log("executeing");
        await txn.wait();
        console.log("done",txn.hash);
      }else{
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet.");
      }
    }catch(error){
      console.log(error);
    }
  }
  const addMemberCase=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn=await Contract.addMemberCase(inputValue.newMember);
        console.log("adding");
        await txn.wait();
        console.log("done",txn.hash);
        addCaseIdEvent();
      }else{
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet.");
      }
    }catch(error){
      console.log(error);
    }
  }
  const deleteMemberCase=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn=await Contract.deleteMemberCase(inputValue.deleted);
        console.log("deleting");
        await txn.wait();
        console.log("done",txn.hash);
        addCaseIdEvent();
      }else{
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet.");
      }
    }catch(error){
      console.log(error);
    }
  }
  const checkIsMember=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const Contract = new ethers.Contract(contractAddress, contractABI, provider);

        let txn=await Contract.isMenber(inputValue.IsMember);
        console.log("checking");
        txn=txn.toString();
        setIsMember(txn);
        console.log("check done");
      }else{
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet.");
      }
    }catch(error){
      console.log(error);
    }
  }
  const checkInfo=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const Contract = new ethers.Contract(contractAddress, contractABI, provider);

        let txn=await Contract.checkConfirm(yourWalletAddress,inputValue._id3);//嘗試讀取mapping=>mapping
        console.log("checkConfirm");
        txn=txn.toString();
        setCustmember(txn);
        console.log("check done");
        let txn1=await Contract.theCases(inputValue._id3);//嘗試讀取struct
        console.log("start check theCases");
        setCases(txn1);
        console.log(txn1);
      }else{
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet.");
      }
    }catch(error){
      console.log(error);
    }
  }
  const autoCheck=async()=>{
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const Contract = new ethers.Contract(contractAddress, contractABI, provider);
        const accounts=await window.ethereum.request({method: 'eth_requestAccounts'})
        const account = accounts[0];

        let txn=await Contract.memberCount();
        console.log("checking memberCount");
        txn=txn.toString();
        setMemberCoint(txn);
        console.log("memberCount done");
        let txn1=await provider.getBalance(contractAddress);//嘗試拿合約balance>>>成功
        //txn1=await Contract.balanceOf(contractAddress);  還未嘗試
        console.log("checking contract balance");
        txn1=utils.formatEther(txn1);
        setContractBalance(txn1);
        console.log("balance done");
        console.log("start checking isMenber");
        let txn2=await Contract.isMenber(account);
        console.log("checking isMenber");
        txn2=txn2.toString();      
        setAreYouMember(txn2);       
      }else{
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet.");
      }
    }catch(error){
      console.log(error);
    }
  }
  const depositIn=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        console.log("depositing");
        let txn=await signer.sendTransaction({
          to:contractAddress,value:ethers.utils.parseEther(inputValue.depositInMonet)
        });
        await txn.wait();
        console.log("deposit done",txn.hash);
      }else{
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet.");
      }
    }catch(error){
      console.log(error);
    }
  }
  const handleInputChange = (event) => {
    setInPutValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  };
  useEffect(() => {
    checkWalletConnect();
    autoCheck();
  }, []);
  return (
    <main>
      {error &&<p>{error}</p>}
      <h2>multi sign wallet DAPP (On Rinkeby testnet)</h2>
      <div>
        {isWallectConnect &&(<p>your address:{yourWalletAddress} </p>)}
        {!isWallectConnect &&(<button onClick={checkWalletConnect}> connect wallet </button>)}
      </div>
      <div>
        {isWallectConnect &&(<p>Are you member: {areYouMember}</p>)}
        <p>Total member Count: {memberCount}</p>
        <p>Contract Balance: {contractBalance}</p>
      </div>
      <div>
        <h4>Here to check if the address is member:</h4>
        <input
          type="text"
          onChange={handleInputChange}
          name="IsMember"
          placeholder="check the address"
          value={inputValue.IsMember}/>
          <button onClick={checkIsMember}>check</button>
          <span>  Is this address a member: {isMember}</span>
      </div>
      <h4>Here to creat case:(when the creating done, the case ID will be shown below)</h4>      
      <div>
        <p>Here to creat transfer case:</p>
        <input
          type="text"
          onChange={handleInputChange}
          name="_target"
          placeholder="target's address"
          value={inputValue._target}/>
        <input
          type="text"
          onChange={handleInputChange}
          name="_amount"
          placeholder="transfer amount"
          value={inputValue._amount}/>
          <button onClick={addCase}>add the case</button>          
      </div>
      <div>
        <p>Here to creat adding member case:</p>
        <input
          type="text"
          onChange={handleInputChange}
          name="newMember"
          placeholder="add member address"
          value={inputValue.newMember}/>
          <button onClick={addMemberCase}>add the case</button>
      </div>
      <div>
        <p>Here to creat deleting member case:</p>
        <input
          type="text"
          onChange={handleInputChange}
          name="deleted"
          placeholder="delete member address"
          value={inputValue.deleted}/>
          <button onClick={deleteMemberCase}>add the case</button>
      </div>
      <h4>The added case ID is: {addcaseId}</h4>
      <h4>Here to agree, revoke or execute cases:</h4>
      <div>
        <input
          type="text"
          onChange={handleInputChange}
          name="_id"
          placeholder="case ID"
          value={inputValue._id}/>
          <button onClick={confirm}>agree the case</button>
      </div>
      <div>
        <input
          type="text"
          onChange={handleInputChange}
          name="_id1"
          placeholder="case ID"
          value={inputValue._id1}/>
          <button onClick={revoke}>revoke the case</button>
      </div>
      <div>
        <input
          type="text"
          onChange={handleInputChange}
          name="_id2"
          placeholder="case ID"
          value={inputValue._id2}/>
          <button onClick={execute}>execute the case</button><span>It will be pass if half or more than half members agree</span>
      </div>
      <h4>Here can check detail of cases:</h4>
      <div>
        <input
          type="text"
          onChange={handleInputChange}
          name="_id3"
          placeholder="case ID"
          value={inputValue._id3}/>
          <button onClick={checkInfo}>check</button>
          <p>The case ID: {cases[0].toString()}</p>
          <p>Case target's address: {cases[1].toString()}</p>
          <p>Transfer amount: {utils.formatEther(cases[2].toString())} ETH</p>
          <p>Do you agree the case:  {custmember}</p>
          <p>How many members agreed: {cases[3].toString()}</p>
          <p>Be executed: {cases[4].toString()}</p>
      </div>
      <div>
        <h4>Here to deposit ETH into multi sign wallet:</h4>
      <input
          type="text"
          onChange={handleInputChange}
          name="depositInMonet"
          placeholder="deposit amount"
          value={inputValue.depositInMonet}/>
          <button onClick={depositIn}>send</button>
      </div>
    </main>
  );
}

export default App;
