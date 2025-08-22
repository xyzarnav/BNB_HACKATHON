
// Auto-generated file - do not edit manually
export const deployedContracts = {
  "TrustChain": {
    "address": "0x3a479b0c6fAc1F2908F5302CeaA23C126295Dba1",
    "abi": [
      {
        "type": "constructor",
        "stateMutability": "undefined",
        "payable": false,
        "inputs": []
      },
      {
        "type": "error",
        "name": "OwnableInvalidOwner",
        "inputs": [
          {
            "type": "address",
            "name": "owner"
          }
        ]
      },
      {
        "type": "error",
        "name": "OwnableUnauthorizedAccount",
        "inputs": [
          {
            "type": "address",
            "name": "account"
          }
        ]
      },
      {
        "type": "error",
        "name": "ReentrancyGuardReentrantCall",
        "inputs": []
      },
      {
        "type": "event",
        "anonymous": false,
        "name": "AuditorApproval",
        "inputs": [
          {
            "type": "uint256",
            "name": "bondId",
            "indexed": true
          },
          {
            "type": "uint8",
            "name": "milestone",
            "indexed": false
          }
        ]
      },
      {
        "type": "event",
        "anonymous": false,
        "name": "AuditorAssigned",
        "inputs": [
          {
            "type": "uint256",
            "name": "projectId",
            "indexed": true
          },
          {
            "type": "address",
            "name": "auditor",
            "indexed": false
          }
        ]
      },
      {
        "type": "event",
        "anonymous": false,
        "name": "BidSubmitted",
        "inputs": [
          {
            "type": "uint256",
            "name": "bidId",
            "indexed": true
          },
          {
            "type": "uint256",
            "name": "projectId",
            "indexed": false
          },
          {
            "type": "address",
            "name": "bidder",
            "indexed": false
          },
          {
            "type": "uint256",
            "name": "amount",
            "indexed": false
          }
        ]
      },
      {
        "type": "event",
        "anonymous": false,
        "name": "BidderCreated",
        "inputs": [
          {
            "type": "address",
            "name": "bidder",
            "indexed": true
          },
          {
            "type": "uint256",
            "name": "bidderId",
            "indexed": false
          }
        ]
      },
      {
        "type": "event",
        "anonymous": false,
        "name": "BondAwarded",
        "inputs": [
          {
            "type": "uint256",
            "name": "projectId",
            "indexed": true
          },
          {
            "type": "address",
            "name": "bidder",
            "indexed": false
          },
          {
            "type": "uint256",
            "name": "amount",
            "indexed": false
          },
          {
            "type": "uint256",
            "name": "initialPayment",
            "indexed": false
          }
        ]
      },
      {
        "type": "event",
        "anonymous": false,
        "name": "DisputeResolved",
        "inputs": [
          {
            "type": "uint256",
            "name": "disputeId",
            "indexed": true
          },
          {
            "type": "uint8",
            "name": "outcome",
            "indexed": false
          }
        ]
      },
      {
        "type": "event",
        "anonymous": false,
        "name": "MediatorAssigned",
        "inputs": [
          {
            "type": "uint256",
            "name": "disputeId",
            "indexed": true
          },
          {
            "type": "address",
            "name": "mediator",
            "indexed": false
          }
        ]
      },
      {
        "type": "event",
        "anonymous": false,
        "name": "OwnershipTransferred",
        "inputs": [
          {
            "type": "address",
            "name": "previousOwner",
            "indexed": true
          },
          {
            "type": "address",
            "name": "newOwner",
            "indexed": true
          }
        ]
      },
      {
        "type": "event",
        "anonymous": false,
        "name": "PaymentReleased",
        "inputs": [
          {
            "type": "uint256",
            "name": "bondId",
            "indexed": true
          },
          {
            "type": "uint256",
            "name": "amount",
            "indexed": false
          },
          {
            "type": "uint8",
            "name": "newCompletion",
            "indexed": false
          }
        ]
      },
      {
        "type": "event",
        "anonymous": false,
        "name": "ProjectCreated",
        "inputs": [
          {
            "type": "uint256",
            "name": "projectId",
            "indexed": true
          },
          {
            "type": "address",
            "name": "creator",
            "indexed": false
          },
          {
            "type": "uint256",
            "name": "budget",
            "indexed": false
          },
          {
            "type": "uint8",
            "name": "projectType",
            "indexed": false
          }
        ]
      },
      {
        "type": "event",
        "anonymous": false,
        "name": "TransparencyLog",
        "inputs": [
          {
            "type": "uint256",
            "name": "projectId",
            "indexed": true
          },
          {
            "type": "string",
            "name": "action",
            "indexed": false
          },
          {
            "type": "address",
            "name": "actor",
            "indexed": false
          }
        ]
      },
      {
        "type": "event",
        "anonymous": false,
        "name": "WhistleblowerReport",
        "inputs": [
          {
            "type": "uint256",
            "name": "projectId",
            "indexed": true
          },
          {
            "type": "bytes32",
            "name": "reportHash",
            "indexed": false
          }
        ]
      },
      {
        "type": "function",
        "name": "approveCompletion",
        "constant": false,
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": "_bondId"
          },
          {
            "type": "uint8",
            "name": "_milestone"
          }
        ],
        "outputs": []
      },
      {
        "type": "function",
        "name": "approvedAuditors",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
          {
            "type": "address",
            "name": ""
          }
        ],
        "outputs": [
          {
            "type": "bool",
            "name": ""
          }
        ]
      },
      {
        "type": "function",
        "name": "approvedAuditorsList",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": ""
          }
        ],
        "outputs": [
          {
            "type": "address",
            "name": ""
          }
        ]
      },
      {
        "type": "function",
        "name": "assignAuditor",
        "constant": false,
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": "_projectId"
          }
        ],
        "outputs": []
      },
      {
        "type": "function",
        "name": "assignMediator",
        "constant": false,
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": "_disputeId"
          },
          {
            "type": "address",
            "name": "_mediator"
          }
        ],
        "outputs": []
      },
      {
        "type": "function",
        "name": "awardBond",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
          {
            "type": "uint256",
            "name": "_projectId"
          },
          {
            "type": "uint256",
            "name": "bidWinner"
          }
        ],
        "outputs": [
          {
            "type": "uint256",
            "name": "_bidWiner"
          }
        ]
      },
      {
        "type": "function",
        "name": "bidCount",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
          {
            "type": "uint256",
            "name": ""
          }
        ]
      },
      {
        "type": "function",
        "name": "bidEvaluation",
        "constant": false,
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": "_projectId"
          }
        ],
        "outputs": []
      },
      {
        "type": "function",
        "name": "bidderCount",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
          {
            "type": "uint256",
            "name": ""
          }
        ]
      },
      {
        "type": "function",
        "name": "bidderIds",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
          {
            "type": "address",
            "name": ""
          }
        ],
        "outputs": [
          {
            "type": "uint256",
            "name": ""
          }
        ]
      },
      {
        "type": "function",
        "name": "bidders",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": ""
          }
        ],
        "outputs": [
          {
            "type": "uint256",
            "name": "bidderId"
          },
          {
            "type": "address",
            "name": "bidderAddress"
          },
          {
            "type": "uint256",
            "name": "totalBids"
          },
          {
            "type": "uint256",
            "name": "reputationScore"
          },
          {
            "type": "bool",
            "name": "blacklisted"
          }
        ]
      },
      {
        "type": "function",
        "name": "bids",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": ""
          }
        ],
        "outputs": [
          {
            "type": "uint256",
            "name": "bidId"
          },
          {
            "type": "uint256",
            "name": "projectId"
          },
          {
            "type": "address",
            "name": "bidder"
          },
          {
            "type": "uint256",
            "name": "amount"
          },
          {
            "type": "string",
            "name": "proposalIPFHash"
          },
          {
            "type": "bool",
            "name": "accepted"
          }
        ]
      },
      {
        "type": "function",
        "name": "blacklistBidder",
        "constant": false,
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": "_bidderId"
          }
        ],
        "outputs": []
      },
      {
        "type": "function",
        "name": "bondCount",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
          {
            "type": "uint256",
            "name": ""
          }
        ]
      },
      {
        "type": "function",
        "name": "bondWinners",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": ""
          }
        ],
        "outputs": [
          {
            "type": "uint256",
            "name": ""
          }
        ]
      },
      {
        "type": "function",
        "name": "createBid",
        "constant": false,
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": "_projectId"
          },
          {
            "type": "string",
            "name": "_proposalIPFHash"
          },
          {
            "type": "uint256",
            "name": "_amount"
          }
        ],
        "outputs": []
      },
      {
        "type": "function",
        "name": "createBidder",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
      },
      {
        "type": "function",
        "name": "createDispute",
        "constant": false,
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": "_bondId"
          },
          {
            "type": "string",
            "name": "_evidence"
          }
        ],
        "outputs": []
      },
      {
        "type": "function",
        "name": "createProject",
        "constant": false,
        "payable": false,
        "inputs": [
          {
            "type": "string",
            "name": "_title"
          },
          {
            "type": "string",
            "name": "_description"
          },
          {
            "type": "uint256",
            "name": "_timeperiod"
          },
          {
            "type": "uint256",
            "name": "_budget"
          },
          {
            "type": "uint8",
            "name": "_jobType"
          }
        ],
        "outputs": []
      },
      {
        "type": "function",
        "name": "disputeCount",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
          {
            "type": "uint256",
            "name": ""
          }
        ]
      },
      {
        "type": "function",
        "name": "disputes",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": ""
          }
        ],
        "outputs": [
          {
            "type": "uint256",
            "name": "disputeId"
          },
          {
            "type": "uint256",
            "name": "bondId"
          },
          {
            "type": "address",
            "name": "creator"
          },
          {
            "type": "address",
            "name": "mediator"
          },
          {
            "type": "string",
            "name": "evidence"
          },
          {
            "type": "bool",
            "name": "resolved"
          },
          {
            "type": "uint8",
            "name": "outcome"
          }
        ]
      },
      {
        "type": "function",
        "name": "evaluatedbids",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": ""
          }
        ],
        "outputs": [
          {
            "type": "bool",
            "name": ""
          }
        ]
      },
      {
        "type": "function",
        "name": "getAllActiveProjects",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
          {
            "type": "tuple[]",
            "name": "",
            "components": [
              {
                "type": "address",
                "name": "creator"
              },
              {
                "type": "uint256",
                "name": "projectId"
              },
              {
                "type": "string",
                "name": "description"
              },
              {
                "type": "string",
                "name": "title"
              },
              {
                "type": "uint256",
                "name": "timePeriod"
              },
              {
                "type": "uint256",
                "name": "deadline"
              },
              {
                "type": "uint256",
                "name": "budget"
              },
              {
                "type": "bool",
                "name": "posted"
              },
              {
                "type": "uint8",
                "name": "projectType"
              },
              {
                "type": "address",
                "name": "auditor"
              },
              {
                "type": "bool",
                "name": "hasAuditor"
              }
            ]
          }
        ]
      },
      {
        "type": "function",
        "name": "getAllProjects",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
          {
            "type": "tuple[]",
            "name": "",
            "components": [
              {
                "type": "address",
                "name": "creator"
              },
              {
                "type": "uint256",
                "name": "projectId"
              },
              {
                "type": "string",
                "name": "description"
              },
              {
                "type": "string",
                "name": "title"
              },
              {
                "type": "uint256",
                "name": "timePeriod"
              },
              {
                "type": "uint256",
                "name": "deadline"
              },
              {
                "type": "uint256",
                "name": "budget"
              },
              {
                "type": "bool",
                "name": "posted"
              },
              {
                "type": "uint8",
                "name": "projectType"
              },
              {
                "type": "address",
                "name": "auditor"
              },
              {
                "type": "bool",
                "name": "hasAuditor"
              }
            ]
          }
        ]
      },
      {
        "type": "function",
        "name": "getBidsByUser",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
          {
            "type": "address",
            "name": "_bidder"
          }
        ],
        "outputs": [
          {
            "type": "tuple[]",
            "name": "",
            "components": [
              {
                "type": "uint256",
                "name": "bidId"
              },
              {
                "type": "uint256",
                "name": "projectId"
              },
              {
                "type": "address",
                "name": "bidder"
              },
              {
                "type": "uint256",
                "name": "amount"
              },
              {
                "type": "string",
                "name": "proposalIPFHash"
              },
              {
                "type": "bool",
                "name": "accepted"
              }
            ]
          }
        ]
      },
      {
        "type": "function",
        "name": "getCompletionLevel",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": "_bondId"
          }
        ],
        "outputs": [
          {
            "type": "uint8",
            "name": ""
          }
        ]
      },
      {
        "type": "function",
        "name": "getCompletionPercentage",
        "constant": true,
        "stateMutability": "pure",
        "payable": false,
        "inputs": [
          {
            "type": "uint8",
            "name": "_completion"
          }
        ],
        "outputs": [
          {
            "type": "uint256",
            "name": ""
          }
        ]
      },
      {
        "type": "function",
        "name": "getProjectBidWinner",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": "_projectId"
          }
        ],
        "outputs": [
          {
            "type": "uint256",
            "name": "_bidWinnerId"
          }
        ]
      },
      {
        "type": "function",
        "name": "getProjectById",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": "_projectId"
          }
        ],
        "outputs": [
          {
            "type": "string",
            "name": "title"
          },
          {
            "type": "uint256",
            "name": "budget"
          },
          {
            "type": "string",
            "name": "description"
          },
          {
            "type": "uint256",
            "name": "deadline"
          },
          {
            "type": "bool",
            "name": "posted"
          },
          {
            "type": "uint256",
            "name": "Id"
          },
          {
            "type": "uint8",
            "name": "projectType"
          },
          {
            "type": "address",
            "name": "creator"
          },
          {
            "type": "uint256",
            "name": "timePeriod"
          }
        ]
      },
      {
        "type": "function",
        "name": "getProjectLogs",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": "_projectId"
          }
        ],
        "outputs": [
          {
            "type": "tuple[]",
            "name": "",
            "components": [
              {
                "type": "address",
                "name": "actor"
              },
              {
                "type": "string",
                "name": "action"
              },
              {
                "type": "uint256",
                "name": "timestamp"
              }
            ]
          }
        ]
      },
      {
        "type": "function",
        "name": "getProjectsByCreator",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
          {
            "type": "address",
            "name": "_creator"
          }
        ],
        "outputs": [
          {
            "type": "tuple[]",
            "name": "",
            "components": [
              {
                "type": "address",
                "name": "creator"
              },
              {
                "type": "uint256",
                "name": "projectId"
              },
              {
                "type": "string",
                "name": "description"
              },
              {
                "type": "string",
                "name": "title"
              },
              {
                "type": "uint256",
                "name": "timePeriod"
              },
              {
                "type": "uint256",
                "name": "deadline"
              },
              {
                "type": "uint256",
                "name": "budget"
              },
              {
                "type": "bool",
                "name": "posted"
              },
              {
                "type": "uint8",
                "name": "projectType"
              },
              {
                "type": "address",
                "name": "auditor"
              },
              {
                "type": "bool",
                "name": "hasAuditor"
              }
            ]
          }
        ]
      },
      {
        "type": "function",
        "name": "hasBidded",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
          {
            "type": "address",
            "name": ""
          },
          {
            "type": "uint256",
            "name": ""
          }
        ],
        "outputs": [
          {
            "type": "bool",
            "name": ""
          }
        ]
      },
      {
        "type": "function",
        "name": "isProjectLate",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": "_projectId"
          }
        ],
        "outputs": [
          {
            "type": "bool",
            "name": ""
          }
        ]
      },
      {
        "type": "function",
        "name": "owner",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
          {
            "type": "address",
            "name": ""
          }
        ]
      },
      {
        "type": "function",
        "name": "projectAuditors",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": ""
          },
          {
            "type": "uint256",
            "name": ""
          }
        ],
        "outputs": [
          {
            "type": "address",
            "name": ""
          }
        ]
      },
      {
        "type": "function",
        "name": "projectBids",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": ""
          },
          {
            "type": "uint256",
            "name": ""
          }
        ],
        "outputs": [
          {
            "type": "uint256",
            "name": ""
          }
        ]
      },
      {
        "type": "function",
        "name": "projectId",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
          {
            "type": "uint256",
            "name": ""
          }
        ]
      },
      {
        "type": "function",
        "name": "projects",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": ""
          }
        ],
        "outputs": [
          {
            "type": "address",
            "name": "creator"
          },
          {
            "type": "uint256",
            "name": "projectId"
          },
          {
            "type": "string",
            "name": "description"
          },
          {
            "type": "string",
            "name": "title"
          },
          {
            "type": "uint256",
            "name": "timePeriod"
          },
          {
            "type": "uint256",
            "name": "deadline"
          },
          {
            "type": "uint256",
            "name": "budget"
          },
          {
            "type": "bool",
            "name": "posted"
          },
          {
            "type": "uint8",
            "name": "projectType"
          },
          {
            "type": "address",
            "name": "auditor"
          },
          {
            "type": "bool",
            "name": "hasAuditor"
          }
        ]
      },
      {
        "type": "function",
        "name": "registerAuditor",
        "constant": false,
        "payable": false,
        "inputs": [
          {
            "type": "address",
            "name": "_auditor"
          }
        ],
        "outputs": []
      },
      {
        "type": "function",
        "name": "releasePayment",
        "constant": false,
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": "_bondId"
          },
          {
            "type": "uint8",
            "name": "_newCompletion"
          }
        ],
        "outputs": []
      },
      {
        "type": "function",
        "name": "removeAuditor",
        "constant": false,
        "payable": false,
        "inputs": [
          {
            "type": "address",
            "name": "_auditor"
          }
        ],
        "outputs": []
      },
      {
        "type": "function",
        "name": "renounceOwnership",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
      },
      {
        "type": "function",
        "name": "reportCorruption",
        "constant": false,
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": "_projectId"
          },
          {
            "type": "string",
            "name": "_evidence"
          }
        ],
        "outputs": []
      },
      {
        "type": "function",
        "name": "resolveDispute",
        "constant": false,
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": "_disputeId"
          },
          {
            "type": "uint8",
            "name": "_outcome"
          }
        ],
        "outputs": []
      },
      {
        "type": "function",
        "name": "transferOwnership",
        "constant": false,
        "payable": false,
        "inputs": [
          {
            "type": "address",
            "name": "newOwner"
          }
        ],
        "outputs": []
      },
      {
        "type": "function",
        "name": "transparencyLogs",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
          {
            "type": "uint256",
            "name": ""
          },
          {
            "type": "uint256",
            "name": ""
          }
        ],
        "outputs": [
          {
            "type": "address",
            "name": "actor"
          },
          {
            "type": "string",
            "name": "action"
          },
          {
            "type": "uint256",
            "name": "timestamp"
          }
        ]
      },
      {
        "type": "function",
        "name": "version",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
          {
            "type": "uint256",
            "name": ""
          }
        ]
      },
      {
        "type": "receive",
        "stateMutability": "payable"
      }
    ]
  }
} as const;

export type ContractNames = keyof typeof deployedContracts;
export type ContractAddresses = typeof deployedContracts[ContractNames]['address'];
