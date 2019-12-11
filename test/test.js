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

    it ("total supply should be 30 ethers ", async () => {
        balance = await tokenContract.totalSupply();
        balance.should.be.bignumber.equal(web3.utils.toWei("30", "ether"));
    });

    it ("should be named KrivaChain ", async () => {
        name = await tokenContract.name();
        name.should.be.equal("KrivaChain");
    });

    it ("should be symboled KRC ", async () => {
        sym = await tokenContract.symbol();
        sym.should.be.equal("KRC");
    });

    it ("should register first account 30 ether tokens", async () => {
        balance = await tokenContract.balanceOf(accounts[0]);
        balance.should.be.bignumber.equal(web3.utils.toWei("30", "ether"));
    });

    it ("should burn one token", async () => {
        receipt = await tokenContract.burn(accounts[0], web3.utils.toWei("1", "ether"));
        receipt.logs[0].event.should.be.equal("Burn");

        balance = await tokenContract.balanceOf(accounts[0]);
        balance.should.be.bignumber.equal(web3.utils.toWei("29", "ether"));
        
        balance = await tokenContract.totalSupply();
        balance.should.be.bignumber.equal(web3.utils.toWei("29", "ether"));
    });

    it ("should transfer one token", async () => {
        receipt = await tokenContract.transfer(accounts[1], web3.utils.toWei("1", "ether"))
        receipt.logs[0].event.should.be.equal("Transfer");
        
        balance1 = await tokenContract.balanceOf(accounts[0]);
        balance2 = await tokenContract.balanceOf(accounts[1]);
        sup = await tokenContract.totalSupply();

        // one token was burned before
        balance1.should.be.bignumber.equal(web3.utils.toWei("28", "ether"));
        balance2.should.be.bignumber.equal(web3.utils.toWei("1", "ether"));
        sup.should.be.bignumber.equal(web3.utils.toWei("29", "ether"));
    });
});

contract('Blog', async (accounts) => {

    let blogContract;

    beforeEach(async function() {
        blogContract = await Blog.deployed();
    });

    it ("should have a first entry", async () => {
        let post = await blogContract.getEntry(0);
        post[0].should.be.bignumber.equal("1529798400000");
        console.log(post[1])
        web3.utils.hexToUtf8(post[1]).should.be.equal("-58.12345678");
        web3.utils.hexToUtf8(post[2]).should.be.equal("-179.12345678");
        post[3].should.be.equal("This is the first post.");
    });

    it ("should have token contract", async () => {
        addr = await blogContract.getTokenAddress();
        addr.should.be.equal(Token.address);
    });

    it ("should accept post", async () => {
        let lat = "-89.90573928"
        let lon = "155.9806754"
        let lath = web3.utils.utf8ToHex(lat)
        let lonh = web3.utils.utf8ToHex(lon)

        rec = await blogContract.post("mada mada", lath, lonh, {from: accounts[0]})
        rec.logs[0].event.should.be.equal("BlogPost");
        
        post = await blogContract.getEntry(1)
        web3.utils.hexToUtf8(post[1]).should.be.equal(lat);
        web3.utils.hexToUtf8(post[2]).should.be.equal(lon);
        post[3].should.be.equal("mada mada");
    });

    it ("should not accept post if no tokens", async () => {
        await blogContract.post("yada yada", "0x123ff", "0x123ff", {from: accounts[2]}).should.be.rejectedWith("Not enough funds");
        rec.logs[0].event.should.be.equal("BlogPost");
    });

    it ("should not accept post if few tokens", async () => {
        tokenContract = await Token.deployed();

        await tokenContract.transfer(accounts[2], web3.utils.toWei("1", "gwei"))
        let balance = await tokenContract.balanceOf(accounts[2]);
        await blogContract.post("yada yada", "0x123ff", "0x123ff", {from: accounts[2]}).should.be.rejectedWith("Not enough funds");
        balance.should.be.bignumber.equal(await tokenContract.balanceOf(accounts[2]));
    });

    it ("should accept a long post", async () => {
        rec = await blogContract.post(longstring, "0x123ff", "0x123ff", {from: accounts[0]})
        rec.logs[0].event.should.be.equal("BlogPost");
        console.log("Gas used: " + rec.receipt.gasUsed)
        
        post = await blogContract.getEntry(2)
        post[3].should.be.equal(longstring);
    });

    it ("should accept a longer post", async () => {
        let longerpost = longstring + " " + longstring
        rec = await blogContract.post(longerpost, "0x123ff", "0x123ff", {from: accounts[0]})
        rec.logs[0].event.should.be.equal("BlogPost");
        console.log("Gas used: " + rec.receipt.gasUsed)
        
        post = await blogContract.getEntry(3)
        post[3].should.be.equal(longerpost);
    });
});
