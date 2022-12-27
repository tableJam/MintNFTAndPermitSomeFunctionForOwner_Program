import Head from 'next/head'
import { useState,useEffect } from 'react'
import {ethers} from 'ethers'
import axios from 'axios'
import { memberNFTAddress, memberNFTaddress, tokenBankAddress } from '../../cpnstracts'
import MemberNFT from '../contracts/MemberNFT.json'
import TokenBank from '../contracts/TokenBank.json'

export default function Home() {
  const [account, setAccount] = useState('')
  const [chainId, setChainId] = useState(false)
  const [tokenBalance, setTokenBalance] = useState('')
  const [bankBalance, setBankBalance] = useState('')
  const [bankTotalDeposit, setBankTotalDeposit] = useState('')
  const [nftOwner, setNftOwner] = useState(false)
  const [inputData, setInputData] = useState({ transferAddress: '', transferAmount: '', depositAmount: '', withdrawAmount: '' });
  const [items, setItems] = useState([])
  const goerliId = '0x5'
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  const checkMetamaskInstalled = async () => {
    return window.ethereum ? true : false;
  }
  const checkChainId = async () => {
    const chain = checkMetamaskInstalled() ? await window.ethereum.request({method: 'eth_chainId'}) : '';
    if (chain == goerliId) {
      console.log('chain👷‍♂️',chain)
      setChainId(true)
    }else {
      alert('connect goerli network🦊')
      setChainId(false)
    }
  }
  const connectWallet = async () => {
    try{
      const ethereum = checkMetamaskInstalled() ? window.ethereum : null;
      const accounts = ethereum ? await ethereum.request({method: 'eth_requestAccounts'}) : [''];
      setAccount(accounts[0])

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const tokenBank = new ethers.Contract(tokenBankAddress,TokenBank.abi,signer);
      const balance = await tokenBank.balanceOf(accounts[0])
      console.log('💴',balance.toNumber());
      setTokenBalance(balance.toNumber()); 

      const bankBalance = await tokenBank.bankBalanceOf(accounts[0])
      setBankBalance(bankBalance.toNumber());
      console.log('📜',bankBalance.toNumber());

      const totalDeposit = await tokenBank.bankTokenBalances();
      setBankTotalDeposit(totalDeposit.toNumber())
      console.log('🏦',bankTotalDeposit)

      await isOwner(accounts[0])

      ethereum.on("accountsChanged", checkAccountChanged)
      ethereum.on('chainChanged', checkChainId)
    }catch(err){
      console.log(err);
    }
  }
  const checkAccountChanged = () => {
    setAccount('')
    setNftOwner(false)
    setItems([])
    setTokenBalance('')
    setBankBalance("")
    setBankTotalDeposit('')
    setInputData({ transferAddress: '', transferAmount: '', depositAmount: '', withdrawAmount: '' })

  }

  const isOwner = async (account) => {
    const {ethereum} = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    console.log('signer',signer)
    const memberNFT = new ethers.Contract(memberNFTAddress,MemberNFT.abi,signer);
    const balance = await memberNFT.balanceOf(account);
    const isOwner = balance.toNumber() > 0;
    console.log('🤔',isOwner,balance.toNumber());
    setNftOwner(isOwner);
    return isOwner;
  }

  const transfer = async(e) => {
    e.preventDefault();
    if(tokenBalance < inputData.transferAmount) return;
    if(inputData.transferAddress==zeroAddress)return;
    const {ethereum} = window;
    try{
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner();
      const tokenBank = new ethers.Contract(tokenBankAddress,TokenBank.abi,signer);
      const prev = await tokenBank.balanceOf(inputData.transferAddress);
      console.log('to',prev.toNumber())
      const tx = await tokenBank.transfer(inputData.transferAddress,inputData.transferAmount);
      await tx.wait()
      const newBalance = await tokenBank.balanceOf(account);
      const tonewbalance = await tokenBank.balanceOf(inputData.transferAddress)
      console.log('to +',tonewbalance.toNumber(),'from - ',newBalance.toNumber());
      setTokenBalance(newBalance.toNumber());
      setInputData(prevData=>({...prevData,transferAddress:'',transferAmount:''}))
    }catch(err) {
      console.log('👷‍♂️ fail to transfer')
    }
  }

  const deposit = async (e) => {
    console.log('deposit',tokenBalance,inputData.depositAmount)
    e.preventDefault()
    if(tokenBalance < inputData.depositAmount)return;
    console.log('deposit')
    try{  
      const {ethereum} = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const tokenBank = new ethers.Contract(tokenBankAddress,TokenBank.abi,signer);
      const prev = await tokenBank.balanceOf(account);
      console.log('to',prev.toNumber())  
      const tx = await tokenBank.deposit(inputData.depositAmount);
      await tx.wait();
      const current = await tokenBank.balanceOf(account);
      const currentBankBalance = await tokenBank.bankBalanceOf(account);
      console.log('after deposit',current.toNumber())
      setBankTotalDeposit(currentBankBalance.toNumber());
      setTokenBalance(current.toNumber())
      setInputData(prevData=>({...prevData,depositAmount:''}))
    }catch(err) {
      console.log(err)
    }
      
  }


  const withdraw = async(e) => {
    e.preventDefault()
    console.log(inputData.withdrawAmount)
    const amount = inputData.withdrawAmount;
    console.log(amount,'withdraw')
    if(amount<=0||!ethereum||amount>bankBalance)return;
    try{
      const {ethereum} = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const tokenBank = new ethers.Contract(tokenBankAddress,TokenBank.abi,signer);
      const beforeBlance = await tokenBank.balanceOf(account);
      const beforeBankBalance = await tokenBank.bankBalanceOf(account)
      console.log('📜🏦beforeWithdraw',beforeBlance.toNumber())
      console.log('📜🏦beforeBankBalanceWithdraw',beforeBankBalance.toNumber())
      const tx = await tokenBank.withdraw(amount);
      await tx.wait();
      const currentBalance = await tokenBank.balanceOf(account);
      const currentBankBalance = await tokenBank.bankBalanceOf(account);
      const totalBankBalance = await tokenBank.bankTokenBalances();
      setBankBalance(currentBankBalance.toNumber())
      setTokenBalance(currentBalance.toNumber())
      setBankTotalDeposit(totalBankBalance.toNumber());
      setInputData(prevData=>({
        ...prevData,
        [e.target.name]: ''
      }))
    console.log('done')
    }catch(err) {
      console.log('🤔')
      console.log(err)
    }
      
   }

  const handler = (e) => {
    setInputData(prevData=> ({
      ...prevData,
      [e.target.name]: e.target.value
    }))
  }
  
  useEffect(() => {
    checkMetamaskInstalled() ? '' : alert('please install metamask 🦊');
    checkChainId();
  },[])

  return (
    <div className='flex flex-col items-center bg-slate-100 min-h-screen text-gray-900'>
      <Head>
        <title>Dapp🦖</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className='font-bold texl-6xl my-8 mt-8'>🦖🚀web3🧬🌋</h1>
      <h1 className='texl-6xl'>metamask: { checkMetamaskInstalled() ? '🦊': 'connect metamask' }</h1>
      <h1 className='texl-6xl'>network: goerli</h1>
      <div className='mt-8 mb-16 hover:rotate-180 hover:scale-105 transition duration-700 ease-in-out'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='160'
          height='160'
          viewBox='0 0 350 350'
        >
          <polygon points="0 0, 175 0, 175 175, 0 175" stroke="black" fill="#323234e3" />
          <polygon points="0 175, 175 175, 175 350, 0 350" stroke="black" fill="#323234e3" />
          <polygon points="175 0, 350 0, 350 175, 175 175" stroke="black" fill="#323234e3" />
          <polygon points="175 175, 350 175, 350 350, 175 350" stroke="black" fill="darkturquoise" />
        </svg>
      </div>
      <div className='flex mt-1'>
        {account ? (chainId ? <div className='flex flex-col items-center'><h1>💰 {tokenBalance}</h1> <h1>📜 {bankBalance}</h1> <h1>🏦 {bankTotalDeposit}</h1></div> : <>🦊 connect goerli network</>): (<><button className='bg-blue-500 font-semibold py-2 px-4 text-white border-gray-500 rounded hover:border-transparent hover:bg-green-500 transition duration-300' onClick={connectWallet}>🦊connect</button></>)}
      </div>
            {nftOwner ? (
              <>
                <form className="flex pl-1 py-1 mb-1">
                  <input
                    type="text"
                    className="w-5/12 ml-2 text-center text-right bg-gray-200 rounded"
                    name="transferAddress"
                    placeholder="Wallet Address"
                    onChange={handler}
                    value={inputData.transferAddress}
                  />
                  <input
                    type="text"
                    className="w-5/12 ml-2 text-center text-right bg-gray-200 rounded"
                    name="transferAmount"
                    placeholder={`100`}
                    onChange={handler}
                    value={inputData.transferAmount}
                  />
                  <button
                    className="w-2/12 mx-2 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded"
                    onClick={transfer}
                  >🤝</button>
                </form>
                <form className="flex pl-1 py-1 mb-1">
                  <input
                    type="text"
                    className="w-5/12 ml-2 text-center text-right bg-gray-200 rounded"
                    name="depositAmount"
                    placeholder={`100`}
                    onChange={handler}
                    value={inputData.depositAmount}
                  />
                  <button
                    className="w-2/12 mx-2 bg-white hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded"
                    onClick={deposit}
                  >⬇️</button>
                </form>
                <form className="flex pl-1 py-1 mb-1">
                  <input
                    type="text"
                    className="w-5/12 ml-2 text-center text-right bg-gray-200 rounded"
                    name="withdrawAmount"
                    placeholder={`100`}
                    onChange={handler}
                    value={inputData.withdrawAmount}
                  />
                  <button
                    className="w-2/12 mx-2 bg-white hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded"
                    onClick={withdraw}
                  >🤌</button>
                </form>
              </>) : (<></>)}
    </div>
      )
}
