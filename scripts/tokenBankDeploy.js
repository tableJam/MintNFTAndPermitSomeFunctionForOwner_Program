const fs = require('fs');
const memberNFTToken = require('../memberNFTDeployMemo.js');
const { ethers } = require('hardhat');



const main = async() => {

    console.log('🤩 start deploy')
    const TokenBank = await ethers.getContractFactory("TokenBank");
    const tokenBank = await TokenBank.deploy('TokenBank','TB',memberNFTToken)
    await tokenBank.deployed();
    console.log('deploy tokenBank',tokenBank.address);


    fs.writeFileSync('argment.js',`
        module.exports = [
            "TokenBank",
            "TB",
            "${memberNFTToken}"
        ]
    `)

    fs.writeFileSync('cpnstracts.js',`
        export  const memberNFTAddress = ${memberNFTToken}
        export  const tokenBankAddress = ${tokenBank.address}
    `)
}

const deployTokenBank = async () => {
    try{
        await main();
        process.exit();
    }catch(err){
        console.log(err,'ere 😵‍💫')
        process.exit()
    }
}


deployTokenBank()
