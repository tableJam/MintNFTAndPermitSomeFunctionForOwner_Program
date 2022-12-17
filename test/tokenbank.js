const {ethers} = require('hardhat');
const {expect} = require("chai");

describe('tokenBank', () => {
    let name = "tokenBank";;
    let symbol = "TB"
    let TokenBank;
    let tokenBank;
    let owner;
owner
    beforeEach(async ()=>{
        [owner] = await ethers.getSigners()
        TokenBank = await ethers.getContractFactory("TokenBank")
        tokenBank = await TokenBank.deploy(name,symbol)
        await tokenBank.deployed()
    });

    describe("deploy", function () {
        it("token name and symbol should be setted", async () => {
            expect(await tokenBank.getname()).to.equal(name);
        });
        it("deploy address should be setted to owner", async () => {
            expect(await tokenBank.owner()).to.equal(owner.address);
        })
        it("amount total supply is setted to owner`deposit", async () => {
            expect(await tokenBank.balanceOf(owner.address)).to.equal(await tokenBank.gettotalsupply());
        })
    })

});
