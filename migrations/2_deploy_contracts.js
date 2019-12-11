const Token = artifacts.require("Token.sol");
const Blog = artifacts.require("Blog.sol");

const firstPost = "This is the first post." //need to be changed for live
const firstPostTimestamp = 1529798400000 // need to be changed for live
const lat = web3.utils.utf8ToHex("-58.12345678")
const lon = web3.utils.utf8ToHex("-179.12345678")


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
