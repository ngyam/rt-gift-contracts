var Token = artifacts.require("Token.sol");
var Blog = artifacts.require("Blog.sol");

var firstPost = "This is the first post."

module.exports = function(deployer) {
  deployer.deploy(Token, "KrivaChain", "KRC").then(function() {
    return deployer.deploy(Blog, Token.address, firstPost);
  }).then(function() {
    return deployer.link(Token, Blog);
  }).then(function() {
    return Token.deployed()
  }).then(function(t) {
    t.transferOwnership(Blog.address)
  });
};