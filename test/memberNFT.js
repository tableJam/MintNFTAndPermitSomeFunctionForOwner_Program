const {expect} = require("chai");
const { ethers } = require("hardhat");


describe("MemberNFT",function(){
    let MemberNFT;
    let memberNFT;
    const name = "MemberNFT";
    const symbol = "MEMN";
    let owner;
    const tokenURI1 = "helloworld";
    const tokenURI2 = "solidity"
    let tokenId;
    let add1;

    beforeEach(async function(){
        [owner,add1] = await ethers.getSigners();
        MemberNFT = await ethers.getContractFactory("MemberNFT");
        memberNFT = await MemberNFT.deploy();
        await memberNFT.deployed();
    })

    it("token and symbol have to be included", async function(){
        expect(await memberNFT.name()).to.equal("MemberNFT");
        expect(await memberNFT.symbol()).to.equal("MEMN");
    });

    it("owner should be able to mint nft", async function(){
        await memberNFT.mintNFT(add1.address,tokenURI1);
        expect(await memberNFT.ownerOf(1)).to.equal(add1.address);
    });
    
    it("tokenId should be incremented by 1 at mintNFT function is called" , async function(){
        await memberNFT.mintNFT(add1.address,tokenURI1);
        await memberNFT.mintNFT(add1.address,tokenURI2);
        expect(await memberNFT.tokenURI(1)).to.equal(tokenURI1);
        expect(await memberNFT.tokenURI(2)).to.equal(tokenURI2);
    });

    it("not owner user shoud be denied calling mintNFT()",async function(){
        await expect(memberNFT.connect(add1).mintNFT(add1.address, tokenURI1))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("event should be emitted at mintNFT function is called",async function(){
        await expect(memberNFT.mintNFT(add1.address,tokenURI1)).to.emit(memberNFT,"tokenURIchange").withArgs(add1.address,1,tokenURI1);
    })

})