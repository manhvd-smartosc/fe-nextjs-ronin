const mainContractAbi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'AlreadyMigrated',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DeadlineExceeded',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FeeTooHigh',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Forbidden',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InsufficientEthReserve',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InsufficientMcap',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InsufficientOutput',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InsufficientTokenReserve',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidAmountIn',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidFeeRecipient',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidOwner',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotMainToken',
    type: 'error',
  },
  {
    inputs: [],
    name: 'REENTRANCY',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TooMuchMcap',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'contract MainToken',
        name: 'token',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'mcapInEth',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'symbol',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'extended',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'tokenUrlImage',
        type: 'string',
      },
    ],
    name: 'TokenCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'contract MainToken',
        name: 'token',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'poolId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountToken',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountETH',
        type: 'uint256',
      },
    ],
    name: 'TokenMigrated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'contract MainToken',
        name: 'token',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isBuy',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'mcapInEth',
        type: 'uint256',
      },
    ],
    name: 'Trade',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DECIMALS',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'FEE_DENOMINATOR',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'INIT_REAL_TOKEN_RESERVE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'INIT_VIRTUAL_TOKEN_RESERVE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_FEE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'TOTAL_SUPPLY',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract MainToken',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountOutMin',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'buyTokensWithETH',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'symbol',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'initAmountIn',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'extended',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'tokenUrlImage',
        type: 'string',
      },
    ],
    name: 'createNewToken',
    outputs: [
      {
        internalType: 'contract MainToken',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'creationFee_',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'curveConstant_',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'dexIntegrationManager_',
    outputs: [
      {
        internalType: 'contract DEXIntegrationManager',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract MainToken',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
    ],
    name: 'estimateETHForTokens',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract MainToken',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
    ],
    name: 'estimateTokensForETH',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeRate_',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeTo_',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract MainToken',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'getTokenPool',
    outputs: [
      {
        components: [
          {
            internalType: 'contract MainToken',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenReserve',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'virtualTokenReserve',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'ethReserve',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'virtualEthReserve',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lastPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lastMcapInEth',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lastTimestamp',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'tokenUrlImage',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'lastBlock',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'creator',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'liquidityManager',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'poolId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'curveConstant',
            type: 'uint256',
          },
        ],
        internalType: 'struct MainContract.Pool',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'initVirtualEthReserve_',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'initVirtualEthReserve',
        type: 'uint256',
      },
      {
        internalType: 'contract DEXIntegrationManager',
        name: '_dexIntegrationManager',
        type: 'address',
      },
      {
        internalType: 'contract LiquidityManager',
        name: '_liquidityManager',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'liquidityManager_',
    outputs: [
      {
        internalType: 'contract LiquidityManager',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'migrationFeeRate_',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minLiquidityForDEX_',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner_',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract MainToken',
        name: '',
        type: 'address',
      },
    ],
    name: 'pools_',
    outputs: [
      {
        internalType: 'contract MainToken',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenReserve',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'virtualTokenReserve',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'ethReserve',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'virtualEthReserve',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lastPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lastMcapInEth',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lastTimestamp',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'tokenUrlImage',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'lastBlock',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'liquidityManager',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'poolId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'curveConstant',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract MainToken',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountOutMin',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'sellTokensForETH',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract DEXIntegrationManager',
        name: '_dexIntegrationManager',
        type: 'address',
      },
    ],
    name: 'updateDEXIntegrationManager',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'feeTo',
        type: 'address',
      },
    ],
    name: 'updateFeeRecipient',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'initVirtualEthReserve',
        type: 'uint256',
      },
    ],
    name: 'updateInitialETHReserve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract LiquidityManager',
        name: 'liquidityManager',
        type: 'address',
      },
    ],
    name: 'updateLiquidityManagerContract',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'feeRate',
        type: 'uint256',
      },
    ],
    name: 'updateMigrationFeeRate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256',
      },
    ],
    name: 'updateTokenCreationFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'feeRate',
        type: 'uint256',
      },
    ],
    name: 'updateTradingFeeRate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export { mainContractAbi };
