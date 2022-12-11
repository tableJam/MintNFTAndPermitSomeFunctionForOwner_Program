const {expect} = require("chai");
const { ethers } = require("hardhat");

const main = async () => {
   const MemberNFT = await ethers.getContractFactory("MemberNFT");
   const memberNFT = await MemberNFT.deploy();
   await memberNFT.deployed()

   console.log("contract is deployed🔥; ",memberNFT.address);
}

const deploy = async () => {
    try{
        await main()
    }catch{
        console.log("fail🤔")
    }
}

deploy()