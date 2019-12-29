const Token = artifacts.require("Token.sol");
const Blog = artifacts.require("Blog.sol");

const firstPost = "You got married, congratulations! May much joy, happiness, & love accompany you on this life-journey together. ~ Eni & Adam"
const firstPostTimestamp = 1529157600

const lat = web3.utils.utf8ToHex("47.527422")
const lon = web3.utils.utf8ToHex("19.037228")


module.exports = function(deployer) {
  deployer.deploy(Token, "KrivaChain", "KRC").then(function() {
    return deployer.deploy(Blog, Token.address, firstPostTimestamp, lat, lon, firstPost);
  }).then(function() {
    return deployer.link(Token, Blog);
  }).then(function() {
    return Token.deployed()
  }).then(function(t) {
    t.transferOwnership(Blog.address)
  });
};
