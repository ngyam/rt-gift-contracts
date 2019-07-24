pragma solidity ^0.5.9;

import "./Token.sol";

contract Blog {

    /*
    struct Multihash {
        bytes32 _hash;
        uint8 _hashfunction;
        uint8 _size;
    }
    */

    struct BlogEntry {
        string post;
        uint256 timestamp;
        //Multihash _picture;
    }

    Token internal token;
    BlogEntry[] public blogEntries;

    event BlogPost(address poster, uint256 timestamp, uint256 postId);

    constructor(address tokenAddress, string memory firstPost, uint256 _timestamp)
        public
    {
        token = Token(tokenAddress);
        if ( bytes(firstPost).length != 0) {
            _newEntry(BlogEntry(firstPost, _timestamp));
        }
    }

    modifier notEmpty(string memory post) {
        require(bytes(post).length != 0, "Post cannot be empty");
        _;
    }

    modifier hasFund(address _address, uint256 _val) {
        require(token.balanceOf(_address) >= _val, "Not enough funds");
        _;
    }

    function getLength()
        external
        view
        returns (uint256)
    {
        return blogEntries.length;
    }

    function getEntry(uint256 _id)
        external
        view
        returns (uint256, string memory)
    {
        return (blogEntries[_id].timestamp, blogEntries[_id].post);
    }

    function getTokenAddress()
        external
        view
        returns (address)
    {
        return address(token);
    }

    function post(string memory _post)
        public
        hasFund(msg.sender, 1)
        notEmpty(_post)
        returns (uint)
    {
        token.burn(msg.sender, 1);
        return _newEntry(BlogEntry(_post, block.timestamp));
    }

    function _newEntry(BlogEntry memory _entry)
        internal
        returns (uint256)
    {
        uint256 _id = blogEntries.push(_entry) - 1;
        emit BlogPost(msg.sender, _entry.timestamp, _id);
        return _id;
    }
}
