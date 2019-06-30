const Blog = artifacts.require("Blog.sol");
const Token = artifacts.require("Token.sol");

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bn')(web3.utils.BN))
    .should();

const longstring = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?";

contract('Token', async function(accounts) {

    let tokenContract;

    beforeEach(async function() {
        tokenContract = await Token.deployed();
    });

    it ("total supply should be 30 tokends ", async () => {
        balance = await tokenContract.totalSupply();
        balance.should.be.bignumber.equal("30");
    });

    it ("should be named KrivaChain ", async () => {
        name = await tokenContract.name();
        name.should.be.equal("KrivaChain");
    });

    it ("should be symboled KRC ", async () => {
        sym = await tokenContract.symbol();
        sym.should.be.equal("KRC");
    });

    it ("total supply should be 30 tokends ", async () => {
        balance = await tokenContract.totalSupply();
        balance.should.be.bignumber.equal("30");
    });

    it ("should register first account 30 tokends ", async () => {
        balance = await tokenContract.balanceOf(accounts[0]);
        balance.should.be.bignumber.equal("30");
    });

    it ("should burn one token", async () => {
        receipt = await tokenContract.burn(accounts[0],1);
        receipt.logs[0].event.should.be.equal("Burn");
        receipt.logs[1].event.should.be.equal("Transfer");

        balance = await tokenContract.balanceOf(accounts[0]);
        balance.should.be.bignumber.equal("29");
        
        balance = await tokenContract.totalSupply();
        balance.should.be.bignumber.equal("29");
    });

    it ("should transfer one token", async () => {
        receipt = await tokenContract.transfer(accounts[1], 1)
        receipt.logs[0].event.should.be.equal("Transfer");
        
        balance1 = await tokenContract.balanceOf(accounts[0]);
        balance2 = await tokenContract.balanceOf(accounts[1]);
        sup = await tokenContract.totalSupply();

        // one token was burned before
        balance1.should.be.bignumber.equal("28");
        balance2.should.be.bignumber.equal("1");
        sup.should.be.bignumber.equal("29");
    });
});

contract('Blog', async (accounts) => {

    it ("should have a first entry", async () => {
        let blog = await Blog.deployed();
        post = await blog.getEntry(0);
        post[1].should.be.equal("This is the first post.");
    });

    it ("should have token contract", async () => {
        let blog = await Blog.deployed();
        addr = await blog.getTokenAddress();
        addr.should.be.equal(Token.address);
    });

    it ("should accept post", async () => {
        let blog = await Blog.deployed();

        rec = await blog.post("yada yada", {from: accounts[0]})
        rec.logs[0].event.should.be.equal("BlogPost");
        
        post = await blog.getEntry(1)
        post[1].should.be.equal("yada yada");
    });

    it ("should accept a long post", async () => {
        let blog = await Blog.deployed();

        rec = await blog.post(longstring, {from: accounts[0]})
        rec.logs[0].event.should.be.equal("BlogPost");
        console.log("Gas used: " + rec.receipt.gasUsed)
        
        post = await blog.getEntry(2)
        post[1].should.be.equal(longstring);
    });

    it ("should accept a longer post", async () => {
        let blog = await Blog.deployed();
        let longerpost = longstring + " " + longstring
        rec = await blog.post(longerpost, {from: accounts[0]})
        rec.logs[0].event.should.be.equal("BlogPost");
        console.log("Gas used: " + rec.receipt.gasUsed)
        
        post = await blog.getEntry(3)
        post[1].should.be.equal(longerpost);
    });
});
