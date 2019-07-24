const Token = artifacts.require("Token.sol");
const Blog = artifacts.require("Blog.sol");

const firstPost = "This is the first post." //need to be changed for live
const firstPostTimestamp = 1529798400000 // need to be changed for live

module.exports = function(deployer) {
  deployer.deploy(Token, "KrivaChain", "KRC").then(function() {
    return deployer.deploy(Blog, Token.address, firstPost, firstPostTimestamp);
  }).then(function() {
    return deployer.link(Token, Blog);
  }).then(function() {
    return Token.deployed()
  }).then(function(t) {
    t.transferOwnership(Blog.address)
  });
};
