const {expect} = require("Chai");
const { ethers } = require("hardhat");


describe("MemberNFT",function(){

    it("token and symbol have to be included", async function(){
        const MemberNFT = await ethers.getContractFactory("MemberNFT");
        const memberNFT = await MemberNFT.deploy();
        await memberNFT.deployed();

        expect(await memberNFT.name()).to.equal("MemberNFT");
        expect(await memberNFT.symbol()).to.equal("MEMN");
    });

    it("deployAddress should be setted to owner", async function(){
        const [owner] = await ethers.getSigners();
        const MemberNFT = await ethers.getContractFactory("MemberNFT");
        const memberNFT = await MemberNFT.deploy();
        await memberNFT.deployed();
        expect(await memberNFT.owner()).to.equal(owner).address;
    });

})