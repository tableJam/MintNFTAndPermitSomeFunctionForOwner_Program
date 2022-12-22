const {ethers} = require('hardhat')
const addr1 = "0x8695b0c9d2B03FD7b61B8C5aFECa42b84600529d";
const addr2 = "0xa22694f401cC5138912bD8160d6C17833B0a9619";
const addr3 = "0x2b99192D877F7447E1CCBe09a76522f130584efa";
const addr4 = "0xa22694f401cC5138912bD8160d6C17833B0a9619";
const addrs = [addr2,addr3,addr4]

const distribute = async () => {
    const memberNFT = await ethers.getContractAt("MemberNFT","0x4a8c34336dF839B5700AFB7FF8A3839DfAaF4c15");
    const tokenURI1 = "ipfs://bafybeigyod7ldrnytkzrw45gw2tjksdct6qaxnsc7jdihegpnk2kskpt7a/metadata1.json";
   for await(let addr of addrs) {
    const tx = await memberNFT.mintNFT(addr,tokenURI1);
    await tx.wait()
    console.log('mint to',addr)
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