const {expect} = require("Chai");
const { ethers } = require("hardhat");


describe("MemberNFT",function(){
    let MemberNFT;
    let memberNFT;
    const name = "MemberNFT";
    const symbol = "MEMN";

    beforeEach(async function(){
        MemberNFT = await ethers.getContractFactory("MemberNFT");
        memberNFT = await MemberNFT.deploy();
        await memberNFT.deployed();
    })

    it("token and symbol have to be included", async function(){
        expect(await memberNFT.name()).to.equal("MemberNFT");
        expect(await memberNFT.symbol()).to.equal("MEMN");
    });

    it("deployAddress should be setted to owner", async function(){
        const [owner] = await ethers.getSigners();
        expect(await memberNFT.owner()).to.equal(owner.address);
    });

})