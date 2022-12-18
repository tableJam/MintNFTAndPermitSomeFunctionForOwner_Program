const {ethers} = require('hardhat');
const {expect} = require("chai");

describe('tokenBank', () => {
    let name = "tokenBank";;
    let symbol = "TB"
    let TokenBank;
    let tokenBank;
    let owner;
    let add1;
    let add2;
    let zeroAddress = "0x0000000000000000000000000000000000000000";

    beforeEach(async ()=>{
        [owner,add1,add2] = await ethers.getSigners()
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
        it("banktokendeposit should be empty" ,async() => {
            expect(await tokenBank.bankTokenBalances()).to.equal(0)
        })
    })

    describe("transaction between address" , function () {
        beforeEach(async () => {
            await tokenBank.transfer(add1.address,500);
        });
        it("token should be transferd 2", async () => {
            const currentAdd1Token = await tokenBank.balanceOf(add1.address);
            const currentAdd2Token = await tokenBank.balanceOf(add2.address);
            console.log(currentAdd1Token,currentAdd2Token,'🤔')
            await tokenBank.connect(add1).transfer(add2.address,100);
            expect(await tokenBank.balanceOf(add1.address)).to.eq(currentAdd1Token.sub(100));
            expect(await tokenBank.balanceOf(add2.address)).to.eq(currentAdd2Token.add(100));
        });
        it("if token is send to  zero address it shoud not success", async () => {
            await expect(tokenBank.transfer(zeroAddress, 100)).to.be.revertedWith("address you sent token is not exist");
        })
        it("if lack of token it shoud be error",async()=>{
            await expect(tokenBank.connect(add1).transfer(add2.address,10000000000000)).to.be.revertedWith("you transfer token more than you have");
        })
    })
    describe("bank function",function() {
        beforeEach(async () => {
            await tokenBank.transfer(add1.address,500);
        });
        it("deposit function is done", async () => {
            const curretTotalTokenInBank = await tokenBank.bankTokenBalances();
            await tokenBank.connect(add1).deposit(100);
            expect(await tokenBank.bankBalanceOf(add1.address)).to.equal(100);
            expect(await tokenBank.balanceOf(add1.address)).to.equal(400);
            expect(await tokenBank.bankTokenBalances()).to.equal(curretTotalTokenInBank.add(100));

        })
        it("after deposit, transfer should be able to do", async () => {
            const currentAdd1Token = await tokenBank.balanceOf(add1.address);
            const currentAdd2Token = await tokenBank.balanceOf(add2.address);
            await tokenBank.connect(add1).transfer(add2.address,100);
            expect(await tokenBank.balanceOf(add1.address)).to.eq(currentAdd1Token.sub(100));
            expect(await tokenBank.balanceOf(add2.address)).to.eq(currentAdd2Token.add(100));
        })
        it("withdraw function check", async () => {
            const tx = await tokenBank.connect(add1).deposit(100);
            await tx.wait();
            const currentAdd1Token = await tokenBank.balanceOf(add1.address);
            const currentAdd1TokenInBank = await tokenBank.bankBalanceOf(add1.address);
            const curretTotalTokenInBank = await tokenBank.bankTokenBalances();
            const tx2 = await tokenBank.connect(add1).withdraw(100);
            await tx2.wait()
            expect(await tokenBank.balanceOf(add1.address)).to.equal(currentAdd1Token.add(100));
            expect(await tokenBank.bankBalanceOf(add1.address)).to.equal(currentAdd1TokenInBank.sub(100));
            expect(await tokenBank.bankTokenBalances()).to.equal(curretTotalTokenInBank.sub(100));
        })
        it("case withdraw exceeded token sender have in bank should not be done", async () => {
            await tokenBank.connect(add1).deposit(100);
            await expect(tokenBank.connect(add1).withdraw(400)).to.be.revertedWith("exceed amount of token you deposit in this contract");
        })
    })
    
});
