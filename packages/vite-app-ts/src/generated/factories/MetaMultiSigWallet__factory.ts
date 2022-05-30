/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  Overrides,
  BigNumberish,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  MetaMultiSigWallet,
  MetaMultiSigWalletInterface,
} from "../MetaMultiSigWallet";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_chainId",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "_owners",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "_signaturesRequired",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "CloseStream",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address payable",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "hashString",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "result",
        type: "bytes",
      },
    ],
    name: "ExecuteTransaction",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "frequency",
        type: "uint256",
      },
    ],
    name: "OpenStream",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "added",
        type: "bool",
      },
    ],
    name: "Owner",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newSigner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "newSignatureRequired",
        type: "uint256",
      },
    ],
    name: "addSigner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "chainId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "to",
        type: "address",
      },
    ],
    name: "closeStream",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "bytes[]",
        name: "signatures",
        type: "bytes[]",
      },
    ],
    name: "executeTransaction",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_nonce",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "getTransactionHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isOwner",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nonce",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "frequency",
        type: "uint256",
      },
    ],
    name: "openStream",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_hash",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "_signature",
        type: "bytes",
      },
    ],
    name: "recover",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "oldSigner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "newSignatursRequired",
        type: "uint256",
      },
    ],
    name: "removeSigner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "signaturesRequired",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "streamBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "streamWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "streams",
    outputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "frequency",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "last",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newSignatursRequired",
        type: "uint256",
      },
    ],
    name: "updateSignaturesRequired",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001c9738038062001c9783398101604081905262000034916200024e565b600081116200009e5760405162461bcd60e51b815260206004820152602b60248201527f636f6e7374727563746f723a206d757374206265206e6f6e2d7a65726f20736960448201526a19dcc81c995c5d5a5c995960aa1b60648201526084015b60405180910390fd5b600181905560005b82518110156200020f576000838281518110620000c757620000c762000337565b6020026020010151905060006001600160a01b0316816001600160a01b03161415620001365760405162461bcd60e51b815260206004820152601960248201527f636f6e7374727563746f723a207a65726f206164647265737300000000000000604482015260640162000095565b6001600160a01b03811660009081526020819052604090205460ff1615620001a15760405162461bcd60e51b815260206004820152601d60248201527f636f6e7374727563746f723a206f776e6572206e6f7420756e69717565000000604482015260640162000095565b6001600160a01b03811660008181526020818152604091829020805460ff1916600190811790915591519182527ffe545f48304051c4029eb2da9927daa59da0414b4b084fdceaf2955b609b899e910160405180910390a2508062000206816200034d565b915050620000a6565b50505060035562000377565b634e487b7160e01b600052604160045260246000fd5b80516001600160a01b03811681146200024957600080fd5b919050565b6000806000606084860312156200026457600080fd5b8351602080860151919450906001600160401b03808211156200028657600080fd5b818701915087601f8301126200029b57600080fd5b815181811115620002b057620002b06200021b565b8060051b604051601f19603f83011681018181108582111715620002d857620002d86200021b565b60405291825284820192508381018501918a831115620002f757600080fd5b938501935b828510156200032057620003108562000231565b84529385019392850192620002fc565b809750505050505050604084015190509250925092565b634e487b7160e01b600052603260045260246000fd5b60006000198214156200037057634e487b7160e01b600052601160045260246000fd5b5060010190565b61191080620003876000396000f3fe6080604052600436106100ec5760003560e01c8063836992751161008a578063ce757d2911610059578063ce757d2914610302578063d1fbffa014610318578063de4b9e9314610345578063e0a2ff541461036557600080fd5b8063836992751461025f5780639a8a0592146102b6578063a8397ddc146102cc578063affed0e0146102ec57600080fd5b80633034a742116100c65780633034a742146101d15780633bad5426146101f1578063545a4a3c1461021157806365af1bed1461023f57600080fd5b806319045a25146101325780632a387d5d1461016f5780632f54bf6e1461019157600080fd5b3661012d576040805134815247602082015233917f90890809c654f11d6e72a28fa60149770a0d11ec6c92319d6ceb2bb0a4ea1a15910160405180910390a2005b600080fd5b34801561013e57600080fd5b5061015261014d3660046113e6565b610385565b6040516001600160a01b0390911681526020015b60405180910390f35b34801561017b57600080fd5b5061018f61018a366004611442565b6103ef565b005b34801561019d57600080fd5b506101c16101ac366004611477565b60006020819052908152604090205460ff1681565b6040519015158152602001610166565b3480156101dd57600080fd5b5061018f6101ec366004611494565b61057d565b3480156101fd57600080fd5b5061018f61020c3660046114ad565b610617565b34801561021d57600080fd5b5061023161022c3660046114d9565b610766565b604051908152602001610166565b34801561024b57600080fd5b5061018f61025a3660046114ad565b6107a5565b34801561026b57600080fd5b5061029b61027a366004611477565b60046020526000908152604090208054600182015460029092015490919083565b60408051938452602084019290925290820152606001610166565b3480156102c257600080fd5b5061023160035481565b3480156102d857600080fd5b5061018f6102e736600461153c565b610943565b3480156102f857600080fd5b5061023160025481565b34801561030e57600080fd5b5061023160015481565b34801561032457600080fd5b5061033861033336600461158d565b6109ae565b60405161016691906116ed565b34801561035157600080fd5b5061018f610360366004611477565b610cc8565b34801561037157600080fd5b50610231610380366004611477565b610e00565b60006103e8826103e2856040517f19457468657265756d205369676e6564204d6573736167653a0a3332000000006020820152603c8101829052600090605c01604051602081830303815290604052805190602001209050919050565b90610e60565b9392505050565b3330146104175760405162461bcd60e51b815260040161040e90611700565b60405180910390fd5b6001600160a01b0383166000908152600460205260409020541561047d5760405162461bcd60e51b815260206004820152601f60248201527f6f70656e53747265616d3a2073747265616d20616c7265616479206f70656e00604482015260640161040e565b600082116104c55760405162461bcd60e51b81526020600482015260156024820152741bdc195b94dd1c99585b4e881b9bc8185b5bdd5b9d605a1b604482015260640161040e565b600081116105155760405162461bcd60e51b815260206004820152601860248201527f6f70656e53747265616d3a206e6f206672657175656e63790000000000000000604482015260640161040e565b6001600160a01b038316600081815260046020908152604091829020858155600181018590554260029091015581518581529081018490527f81236f9eb471668cf00861415085dace409d719678881c59b03e49683bbef716910160405180910390a2505050565b33301461059c5760405162461bcd60e51b815260040161040e90611700565b600081116106125760405162461bcd60e51b815260206004820152603860248201527f7570646174655369676e61747572657352657175697265643a206d757374206260448201527f65206e6f6e2d7a65726f20736967732072657175697265640000000000000000606482015260840161040e565b600155565b3330146106365760405162461bcd60e51b815260040161040e90611700565b6001600160a01b03821660009081526020819052604090205460ff1661069e5760405162461bcd60e51b815260206004820152601660248201527f656d6f76655369676e65723a206e6f74206f776e657200000000000000000000604482015260640161040e565b600081116107035760405162461bcd60e51b815260206004820152602c60248201527f72656d6f76655369676e65723a206d757374206265206e6f6e2d7a65726f207360448201526b1a59dcc81c995c5d5a5c995960a21b606482015260840161040e565b6001600160a01b03821660008181526020818152604091829020805460ff19168155600185905554915160ff909216151582527ffe545f48304051c4029eb2da9927daa59da0414b4b084fdceaf2955b609b899e91015b60405180910390a25050565b6000306003548686868660405160200161078596959493929190611722565b604051602081830303815290604052805190602001209050949350505050565b3330146107c45760405162461bcd60e51b815260040161040e90611700565b6001600160a01b03821661081a5760405162461bcd60e51b815260206004820152601660248201527f6164645369676e65723a207a65726f2061646472657300000000000000000000604482015260640161040e565b6001600160a01b03821660009081526020819052604090205460ff16156108835760405162461bcd60e51b815260206004820152601b60248201527f6164645369676e65723a206f776e6572206e6f7420756e697175650000000000604482015260640161040e565b600081116108e55760405162461bcd60e51b815260206004820152602960248201527f6164645369676e65723a206d757374206265206e6f6e2d7a65726f2073696773604482015268081c995c5d5a5c995960ba1b606482015260840161040e565b6001600160a01b03821660008181526020818152604091829020805460ff19166001908117825585905554915160ff909216151582527ffe545f48304051c4029eb2da9927daa59da0414b4b084fdceaf2955b609b899e910161075a565b3360009081526004602052604090205461099f5760405162461bcd60e51b815260206004820152601860248201527f77697468647261773a206e6f206f70656e2073747265616d0000000000000000604482015260640161040e565b6109aa338383610e84565b5050565b3360009081526020819052604090205460609060ff16610a245760405162461bcd60e51b815260206004820152602b60248201527f657865637574655472616e73616374696f6e3a206f6e6c79206f776e6572732060448201526a63616e206578656375746560a81b606482015260840161040e565b6000610a34600254878787610766565b600280549192506000610a4683611793565b919050555060008060005b8551811015610b47576000610a7f85888481518110610a7257610a726117ae565b6020026020010151610385565b9050826001600160a01b0316816001600160a01b031611610b005760405162461bcd60e51b815260206004820152603560248201527f657865637574655472616e73616374696f6e3a206475706c6963617465206f7260448201527420756e6f726465726564207369676e61747572657360581b606482015260840161040e565b6001600160a01b038116600090815260208190526040902054909250829060ff1615610b345783610b3081611793565b9450505b5080610b3f81611793565b915050610a51565b50600154821015610bb25760405162461bcd60e51b815260206004820152602f60248201527f657865637574655472616e73616374696f6e3a206e6f7420656e6f756768207660448201526e616c6964207369676e61747572657360881b606482015260840161040e565b600080896001600160a01b03168989604051610bce91906117c4565b60006040518083038185875af1925050503d8060008114610c0b576040519150601f19603f3d011682016040523d82523d6000602084013e610c10565b606091505b509150915081610c625760405162461bcd60e51b815260206004820152601d60248201527f657865637574655472616e73616374696f6e3a207478206661696c6564000000604482015260640161040e565b336001600160a01b03167f9053e9ec105157fac8c9308d63e6b22be5f50fe915a3e567419b624311a02d748b8b8b6001600254610c9f91906117e0565b8a87604051610cb3969594939291906117f7565b60405180910390a29998505050505050505050565b333014610ce75760405162461bcd60e51b815260040161040e90611700565b6001600160a01b038116600090815260046020526040902054610d575760405162461bcd60e51b815260206004820152602260248201527f636c6f736553747265616d3a2073747265616d20616c726561647920636c6f73604482015261195960f21b606482015260840161040e565b610daf8160046000846001600160a01b03166001600160a01b03168152602001908152602001600020600001546040518060400160405280600d81526020016c1cdd1c99585b4818db1bdcd959609a1b815250610e84565b6001600160a01b03811660008181526004602052604080822082815560018101839055600201829055517fcc362a45d32c94d02a329570bd5935709d77f6dc79ac6afa5107b513642461c29190a250565b6001600160a01b03811660009081526004602052604081206001810154600290910154610e2d90426117e0565b6001600160a01b038416600090815260046020526040902054610e50919061184a565b610e5a9190611869565b92915050565b6000806000610e6f8585610fd3565b91509150610e7c81611043565b509392505050565b6000610e8f84610e00565b905082811015610ed85760405162461bcd60e51b81526020600482015260146024820152730eed2e8d0c8e4c2ee7440dcdee840cadcdeeaced60631b604482015260640161040e565b6001600160a01b03841660009081526004602052604090206002015481908490610f0290426117e0565b610f0c919061184a565b610f169190611869565b6001600160a01b038516600090815260046020526040902060020154610f3c919061188b565b6001600160a01b038516600081815260046020526040908190206002019290925590517f485f1bb6524c663555797e00171a10f341656e59b02d6b557a0a38ba7d5d975190610f8e90869086906118a3565b60405180910390a26040516001600160a01b0385169084156108fc029085906000818181858888f19350505050158015610fcc573d6000803e3d6000fd5b5050505050565b60008082516041141561100a5760208301516040840151606085015160001a610ffe87828585611201565b9450945050505061103c565b82516040141561103457602083015160408401516110298683836112ee565b93509350505061103c565b506000905060025b9250929050565b6000816004811115611057576110576118c4565b14156110605750565b6001816004811115611074576110746118c4565b14156110c25760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e61747572650000000000000000604482015260640161040e565b60028160048111156110d6576110d66118c4565b14156111245760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e67746800604482015260640161040e565b6003816004811115611138576111386118c4565b14156111915760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b606482015260840161040e565b60048160048111156111a5576111a56118c4565b14156111fe5760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b606482015260840161040e565b50565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a083111561123857506000905060036112e5565b8460ff16601b1415801561125057508460ff16601c14155b1561126157506000905060046112e5565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa1580156112b5573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166112de576000600192509250506112e5565b9150600090505b94509492505050565b6000806001600160ff1b0383168161130b60ff86901c601b61188b565b905061131987828885611201565b935093505050935093915050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff8111828210171561136657611366611327565b604052919050565b600067ffffffffffffffff83111561138857611388611327565b61139b601f8401601f191660200161133d565b90508281528383830111156113af57600080fd5b828260208301376000602084830101529392505050565b600082601f8301126113d757600080fd5b6103e88383356020850161136e565b600080604083850312156113f957600080fd5b82359150602083013567ffffffffffffffff81111561141757600080fd5b611423858286016113c6565b9150509250929050565b6001600160a01b03811681146111fe57600080fd5b60008060006060848603121561145757600080fd5b83356114628161142d565b95602085013595506040909401359392505050565b60006020828403121561148957600080fd5b81356103e88161142d565b6000602082840312156114a657600080fd5b5035919050565b600080604083850312156114c057600080fd5b82356114cb8161142d565b946020939093013593505050565b600080600080608085870312156114ef57600080fd5b8435935060208501356115018161142d565b925060408501359150606085013567ffffffffffffffff81111561152457600080fd5b611530878288016113c6565b91505092959194509250565b6000806040838503121561154f57600080fd5b82359150602083013567ffffffffffffffff81111561156d57600080fd5b8301601f8101851361157e57600080fd5b6114238582356020840161136e565b600080600080608085870312156115a357600080fd5b84356115ae8161142d565b93506020858101359350604086013567ffffffffffffffff808211156115d357600080fd5b6115df89838a016113c6565b945060608801359150808211156115f557600080fd5b818801915088601f83011261160957600080fd5b81358181111561161b5761161b611327565b8060051b61162a85820161133d565b918252838101850191858101908c84111561164457600080fd5b86860192505b83831015611680578235858111156116625760008081fd5b6116708e89838a01016113c6565b835250918601919086019061164a565b999c989b5096995050505050505050565b60005b838110156116ac578181015183820152602001611694565b838111156116bb576000848401525b50505050565b600081518084526116d9816020860160208601611691565b601f01601f19169290920160200192915050565b6020815260006103e860208301846116c1565b6020808252600890820152672737ba1029b2b63360c11b604082015260600190565b60006bffffffffffffffffffffffff19808960601b168352876014840152866034840152808660601b16605484015250836068830152825161176b816088850160208701611691565b91909101608801979650505050505050565b634e487b7160e01b600052601160045260246000fd5b60006000198214156117a7576117a761177d565b5060010190565b634e487b7160e01b600052603260045260246000fd5b600082516117d6818460208701611691565b9190910192915050565b6000828210156117f2576117f261177d565b500390565b6001600160a01b038716815285602082015260c06040820152600061181f60c08301876116c1565b85606084015284608084015282810360a084015261183d81856116c1565b9998505050505050505050565b60008160001904831182151516156118645761186461177d565b500290565b60008261188657634e487b7160e01b600052601260045260246000fd5b500490565b6000821982111561189e5761189e61177d565b500190565b8281526040602082015260006118bc60408301846116c1565b949350505050565b634e487b7160e01b600052602160045260246000fdfea264697066735822122097a8c78aea304171b97d3902f891fd602d5ca25fa37e8bc4a88533923a0e0de364736f6c634300080a0033";

type MetaMultiSigWalletConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MetaMultiSigWalletConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MetaMultiSigWallet__factory extends ContractFactory {
  constructor(...args: MetaMultiSigWalletConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "MetaMultiSigWallet";
  }

  deploy(
    _chainId: BigNumberish,
    _owners: string[],
    _signaturesRequired: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MetaMultiSigWallet> {
    return super.deploy(
      _chainId,
      _owners,
      _signaturesRequired,
      overrides || {}
    ) as Promise<MetaMultiSigWallet>;
  }
  getDeployTransaction(
    _chainId: BigNumberish,
    _owners: string[],
    _signaturesRequired: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _chainId,
      _owners,
      _signaturesRequired,
      overrides || {}
    );
  }
  attach(address: string): MetaMultiSigWallet {
    return super.attach(address) as MetaMultiSigWallet;
  }
  connect(signer: Signer): MetaMultiSigWallet__factory {
    return super.connect(signer) as MetaMultiSigWallet__factory;
  }
  static readonly contractName: "MetaMultiSigWallet";
  public readonly contractName: "MetaMultiSigWallet";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MetaMultiSigWalletInterface {
    return new utils.Interface(_abi) as MetaMultiSigWalletInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MetaMultiSigWallet {
    return new Contract(address, _abi, signerOrProvider) as MetaMultiSigWallet;
  }
}