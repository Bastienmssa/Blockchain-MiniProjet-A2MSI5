// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Whitelist.sol";

contract Election is Whitelist {
    address private _owner;

    struct Resolution {
        uint256 id;
        string title;
        uint256 totalVotes;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 votesNeutral;
    }

    address public sessionPresident;
    address public scrutineer;
    address public secretary;

    mapping(uint256 => Resolution) public resolutions;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    uint256 private resolutionCount;

    event ResolutionCreated(uint256 indexed id, string title);
    event Voted(uint256 indexed resolutionId, address indexed voter, string voteType);
    event PresidentChanged(address indexed newPresident);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Election: Caller is not the owner");
        _;
    }

    modifier onlySessionPresident() {
        require(msg.sender == sessionPresident, "Election: Caller is not the session president");
        _;
    }

    modifier onlyScrutineer() {
        require(msg.sender == scrutineer, "Election: Caller is not the scrutineer");
        _;
    }

    modifier onlySecretary() {
        require(msg.sender == secretary, "Election: Caller is not the secretary");
        _;
    }

    modifier onlyWhitelisted() {
        require(isWhitelisted(msg.sender), "Election: Caller is not whitelisted");
        _;
    }

    function setPresident(address _president) public onlyOwner {
        sessionPresident = _president;
        emit PresidentChanged(sessionPresident);
    }

    function setScrutineer(address _scrutineer) public onlyOwner {
        scrutineer = _scrutineer;
    }

    function setSecretary(address _secretary) public onlyOwner {
        secretary = _secretary;
    }

    function addResolution(string memory _title) public onlySessionPresident {
        resolutionCount++;
        resolutions[resolutionCount] = Resolution({
            id: resolutionCount,
            title: _title,
            totalVotes: 0,
            votesFor: 0,
            votesAgainst: 0,
            votesNeutral: 0
        });
        emit ResolutionCreated(resolutionCount, _title);
    }

    function voteOnResolution(uint256 _resolutionId, string memory _voteType) public onlyWhitelisted {
        require(
            keccak256(abi.encodePacked(_voteType)) == keccak256(abi.encodePacked("Pour")) ||
            keccak256(abi.encodePacked(_voteType)) == keccak256(abi.encodePacked("Contre")) ||
            keccak256(abi.encodePacked(_voteType)) == keccak256(abi.encodePacked("Neutre")),
            "Election: Invalid vote type"
        );
        require(_resolutionId > 0 && _resolutionId <= resolutionCount, "Election: Invalid resolution ID");
        require(!hasVoted[_resolutionId][msg.sender], "Election: Already voted");

        Resolution storage resolution = resolutions[_resolutionId];
        resolution.totalVotes++;

        if (keccak256(abi.encodePacked(_voteType)) == keccak256(abi.encodePacked("Pour"))) {
            resolution.votesFor++;
        } else if (keccak256(abi.encodePacked(_voteType)) == keccak256(abi.encodePacked("Contre"))) {
            resolution.votesAgainst++;
        } else {
            resolution.votesNeutral++;
        }

        hasVoted[_resolutionId][msg.sender] = true;

        emit Voted(_resolutionId, msg.sender, _voteType);
    }

    function getResolutionResults(uint256 _resolutionId) public view onlyScrutineer returns (uint256, uint256, uint256, uint256) {
        Resolution storage resolution = resolutions[_resolutionId];
        return (resolution.votesFor, resolution.votesAgainst, resolution.votesNeutral, resolution.totalVotes);
    }

    function getResolutionCount() public view onlySecretary returns (uint256) {
        return resolutionCount;
    }

    function owner() public view returns (address) {
        return _owner;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "Election: New owner address cannot be zero");
        emit OwnershipTransferred(_owner, _newOwner);
        _owner = _newOwner;
    }
}

