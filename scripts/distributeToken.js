const { ethers } = require("hardhat");

const addr1 = "0x8695b0c9d2B03FD7b61B8C5aFECa42b84600529d";
const addr2 = "0xa22694f401cC5138912bD8160d6C17833B0a9619";
const addr3 = "0x2b99192D877F7447E1CCBe09a76522f130584efa";
const addr4 = "0xa22694f401cC5138912bD8160d6C17833B0a9619";

const addrs = [addr2,addr3,addr4]

const distribute = async () => {
    const tokenBank = await ethers.getContractAt("TokenBank","0xAB30216a9C661bdC33827355f790CD20FD9765d9");
    for await(let addr of addrs) {
        const tx = await tokenBank.transfer(addr,100);
        await tx.wait()
        console.log('transfer')
    }
}

const main = async() => {
    try{
        await distribute();
    }catch(err) {
        console.log('😵‍💫',err);
    }
}

main();

