// Auto-generated file - do not edit manually
export const deployedContracts = {
  "TrustChain": {
    "address": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    "abi": [
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
            "internalType": "uint256",
            "name": "bondId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "enum TrustChain.ProjectCompletion",
            "name": "milestone",
            "type": "uint8"
          }
        ],
        "name": "AuditorApproval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "bidId",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "projectId",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "bidder",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "BidSubmitted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "bidder",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "bidderId",
            "type": "uint256"
          }
        ],
        "name": "BidderCreated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "projectId",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "bidder",
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
            "internalType": "uint256",
            "name": "initialPayment",
            "type": "uint256"
          }
        ],
        "name": "BondAwarded",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "disputeId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "enum TrustChain.DisputeOutcome",
            "name": "outcome",
            "type": "uint8"
          }
        ],
        "name": "DisputeResolved",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "bondId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "enum TrustChain.ProjectCompletion",
            "name": "newCompletion",
            "type": "uint8"
          }
        ],
        "name": "PaymentReleased",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "disputeId",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "mediator",
            "type": "address"
          }
        ],
        "name": "MediatorAssigned",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "projectId",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "budget",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "enum TrustChain.ProjectClassfication",
            "name": "projectType",
            "type": "uint8"
          }
        ],
        "name": "ProjectCreated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "projectId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "action",
            "type": "string"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "actor",
            "type": "address"
          }
        ],
        "name": "TransparencyLog",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "projectId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "bytes32",
            "name": "reportHash",
            "type": "bytes32"
          }
        ],
        "name": "WhistleblowerReport",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "bids",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "bidId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "projectId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "bidder",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "proposalIPFHash",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "accepted",
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
            "name": "",
            "type": "address"
          }
        ],
        "name": "bidders",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "bidderId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "bidderAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "totalBids",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "reputationScore",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "blacklisted",
            "type": "bool"
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
          }
        ],
        "name": "bonds",
        "outputs": [
          {
            "internalType": "address",
            "name": "obligor",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "projectId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "enum TrustChain.ProjectStatus",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "enum TrustChain.ProjectCompletion",
            "name": "completion",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "requiredApprovals",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "currentApprovals",
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
          }
        ],
        "name": "disputes",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "disputeId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "bondId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "mediator",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "evidence",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "resolved",
            "type": "bool"
          },
          {
            "internalType": "enum TrustChain.DisputeOutcome",
            "name": "outcome",
            "type": "uint8"
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
          }
        ],
        "name": "projects",
        "outputs": [
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "projectId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timePeriod",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "budget",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "posted",
            "type": "bool"
          },
          {
            "internalType": "enum TrustChain.ProjectClassfication",
            "name": "projectType",
            "type": "uint8"
          },
          {
            "internalType": "address",
            "name": "auditor",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "hasAuditor",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "bidCount",
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
        "name": "bondCount",
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
        "name": "disputeCount",
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
        "name": "projectId",
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
        "name": "version",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]
  }
} as const;

export type ContractNames = keyof typeof deployedContracts;
export type ContractAddresses = typeof deployedContracts[ContractNames]['address'];

