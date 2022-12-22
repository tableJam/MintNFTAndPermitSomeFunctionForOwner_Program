const fs = require("fs");
const { ethers } = require("hardhat");

const main = async() => {
    const addr1 = "0x8695b0c9d2B03FD7b61B8C5aFECa42b84600529d";
    const addr2 = "0xa22694f401cC5138912bD8160d6C17833B0a9619";
    const addr3 = "0x2b99192D877F7447E1CCBe09a76522f130584efa";

    const tokenURI1 = "ipfs://bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata1.json";
    const tokenURI2 = "ipfs://bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata2.json";
    const tokenURI3 = "ipfs://bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata3.json";
    const tokenURI4 = "ipfs://bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata4.json";
    const tokenURI5 = "ipfs://bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata5.json";

   const MemberNFT = await ethers.getContractFactory("MemberNFT");
   const memberNFT = await MemberNFT.deploy();
   await memberNFT.deployed();

   console.log("🎉 contract is deployed; ",`https://goerli.etherscan.io/address/${memberNFT.address}`);



   console.log("fin")
};


const deploy = async () => {

    try{
        await main();
        process.exit(1);
    }catch{
        console.log("fail");
        process.exit(0);
    }

}


deploy();