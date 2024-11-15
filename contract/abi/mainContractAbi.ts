const mainContractAbi = [
  {
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'symbol', type: 'string' },
      { internalType: 'uint256', name: 'initAmountIn', type: 'uint256' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'string', name: 'extended', type: 'string' },
      { internalType: 'string', name: 'tokenUrlImage', type: 'string' },
    ],
    name: 'createNewToken',
    outputs: [
      { internalType: 'contract MokuToken', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'creationFee_',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

export { mainContractAbi };
