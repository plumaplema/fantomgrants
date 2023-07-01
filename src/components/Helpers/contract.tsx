export const abi = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "eventIndex",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "endTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "initialTax",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "taxIncrementRate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "taxCapped",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_nftContract",
                "type": "address"
            }
        ],
        "name": "addEvent",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "eventIndex",
                "type": "string"
            }
        ],
        "name": "distribute",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "eventIndex",
                "type": "string"
            }
        ],
        "name": "donateToPool",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "contributor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "eventIndex",
                "type": "string"
            }
        ],
        "name": "DonateToPool",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "eventIndex",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "projectIndex",
                "type": "string"
            }
        ],
        "name": "donateToProject",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "eventIndex",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "projectIndex",
                "type": "string"
            }
        ],
        "name": "submitProject",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "eventIndex",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "projectIndex",
                "type": "string"
            }
        ],
        "name": "verifyProject",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "eventByIndex",
        "outputs": [
            {
                "internalType": "string",
                "name": "index",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "fundingPool",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "duration",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "initialTax",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "taxIncrementRate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "taxCapped",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "nftContract",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "tokenContract",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "alreadyDistributed",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "eventIndex",
                "type": "string"
            }
        ],
        "name": "eventTotalMatch",
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
                "internalType": "string",
                "name": "eventIndex",
                "type": "string"
            }
        ],
        "name": "getAllEventContributions",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "contributor",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct FantomGrant.Contribution[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "projectIndex",
                "type": "string"
            }
        ],
        "name": "getAllProjectContributions",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "contributor",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct FantomGrant.Contribution[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "eventIndex",
                "type": "string"
            }
        ],
        "name": "getAllProjects",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "index",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fundingTotal",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "currentTax",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "verified",
                        "type": "bool"
                    }
                ],
                "internalType": "struct FantomGrant.Project[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "eventIndex",
                "type": "string"
            }
        ],
        "name": "getTotalPoolFund",
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
                "internalType": "string",
                "name": "projectIndex",
                "type": "string"
            }
        ],
        "name": "projectMatch",
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
                "internalType": "string",
                "name": "eventIndex",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "projectIndex",
                "type": "string"
            }
        ],
        "name": "projectMatchFund",
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
                "name": "x",
                "type": "uint256"
            }
        ],
        "name": "sqrt",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    }
] as const


export const contract_address: `0x${string}` = '0x2fD716E238E5642ca915Ecd0C58C18332471Ab2E' as `0x${string}`