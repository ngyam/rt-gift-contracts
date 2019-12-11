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
        uint256 timestamp;
        bytes16 lat;
        bytes16 lon;
        string post;
        //Multihash _picture;
    }

    Token internal token;
    BlogEntry[] public blogEntries;

    event BlogPost(address poster, uint256 timestamp, uint256 postId);

    constructor(address tokenAddress, uint256 _timestamp, bytes16 _lat, bytes16 _lon, string memory firstPost)
        public
    {
        token = Token(tokenAddress);
        if ( bytes(firstPost).length != 0) {
            _newEntry(BlogEntry(_timestamp, _lat, _lon, firstPost));
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
        returns (uint256, bytes16, bytes16, string memory)
    {
        return (
            blogEntries[_id].timestamp,
            blogEntries[_id].lat,
            blogEntries[_id].lon,
            blogEntries[_id].post
        );
    }

    function getTokenAddress()
        external
        view
        returns (address)
    {
        return address(token);
    }

    function post(string memory _post, bytes16 _lat, bytes16 _lon)
        public
        hasFund(msg.sender, 1 ether)
        notEmpty(_post)
        returns (uint)
    {
        token.burn(msg.sender, 1 ether);
        return _newEntry(BlogEntry(block.timestamp, _lat, _lon, _post));
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
