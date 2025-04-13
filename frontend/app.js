let contract;

export async function loadContract() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
        console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
        return;
    }

    const contractAddress = "0x43f020A6ab666b15fF0e7c6771E196b22b8C924e"; // Remplacez par l'adresse de votre contrat déployé
    const contractABI = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_beneficiary",
                    "type": "address"
                }
            ],
            "name": "AddedBeneficiary",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newPresident",
                    "type": "address"
                }
            ],
            "name": "PresidentChanged",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                }
            ],
            "name": "ResolutionCreated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "resolutionId",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "voter",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "voteType",
                    "type": "string"
                }
            ],
            "name": "Voted",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_title",
                    "type": "string"
                }
            ],
            "name": "addResolution",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_beneficiary",
                    "type": "address"
                }
            ],
            "name": "addSingleToWhitelist",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address[]",
                    "name": "_beneficiaries",
                    "type": "address[]"
                }
            ],
            "name": "addToWhitelist",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getResolutionCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_resolutionId",
                    "type": "uint256"
                }
            ],
            "name": "getResolutionResults",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "hasVoted",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_beneficiary",
                    "type": "address"
                }
            ],
            "name": "isWhitelisted",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_beneficiary",
                    "type": "address"
                }
            ],
            "name": "removeFromWhitelist",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "resolutions",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "totalVotes",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "votesFor",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "votesAgainst",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "votesNeutral",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "scrutineer",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "secretary",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "sessionPresident",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_president",
                    "type": "address"
                }
            ],
            "name": "setPresident",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_scrutineer",
                    "type": "address"
                }
            ],
            "name": "setScrutineer",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_secretary",
                    "type": "address"
                }
            ],
            "name": "setSecretary",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_resolutionId",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_voteType",
                    "type": "string"
                }
            ],
            "name": "voteOnResolution",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "whitelist",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    contract = new window.web3.eth.Contract(contractABI, contractAddress);
}

export async function getOwner() {
    if (!contract) await loadContract();
    return await contract.methods.owner().call();
}

export async function setPresident(address) {
    if (!contract) await loadContract();
    return await contract.methods.setPresident(address).send({ from: window.ethereum.selectedAddress });
}

export async function setScrutineer(address) {
    if (!contract) await loadContract();
    return await contract.methods.setScrutineer(address).send({ from: window.ethereum.selectedAddress });
}

export async function setSecretary(address) {
    if (!contract) await loadContract();
    return await contract.methods.setSecretary(address).send({ from: window.ethereum.selectedAddress });
}

export async function addResolution(title) {
    if (!contract) await loadContract();
    return await contract.methods.addResolution(title).send({ from: window.ethereum.selectedAddress });
}

export async function voteOnResolution(resolutionId, voteType) {
    if (!contract) await loadContract();
    return await contract.methods.voteOnResolution(resolutionId, voteType).send({ from: window.ethereum.selectedAddress });
}

export async function getResolutionResults(resolutionId) {
    if (!contract) await loadContract();
    return await contract.methods.getResolutionResults(resolutionId).call();
}

export async function addToWhitelist(addresses) {
    if (!contract) await loadContract();
    return await contract.methods.addToWhitelist(addresses).send({ from: window.ethereum.selectedAddress });
}

export async function addSingleToWhitelist(address) {
    if (!contract) await loadContract();
    return await contract.methods.addSingleToWhitelist(address).send({ from: window.ethereum.selectedAddress });
}

export async function isWhitelisted(address) {
    if (!contract) await loadContract();
    return await contract.methods.isWhitelisted(address).call();
}

export async function removeFromWhitelist(address) {
    if (!contract) await loadContract();
    return await contract.methods.removeFromWhitelist(address).send({ from: window.ethereum.selectedAddress });
}
