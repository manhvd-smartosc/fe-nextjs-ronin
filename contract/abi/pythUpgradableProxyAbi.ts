const pythUpgradableProxyAbi = [
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'id',
        type: 'bytes32',
      },
    ],
    name: 'getPrice',
    outputs: [
      {
        components: [
          {
            internalType: 'int64',
            name: 'price',
            type: 'int64',
          },
          {
            internalType: 'uint64',
            name: 'conf',
            type: 'uint64',
          },
          {
            internalType: 'int32',
            name: 'expo',
            type: 'int32',
          },
          {
            internalType: 'uint256',
            name: 'publishTime',
            type: 'uint256',
          },
        ],
        internalType: 'struct PythStructs.Price',
        name: 'price',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export { pythUpgradableProxyAbi };
