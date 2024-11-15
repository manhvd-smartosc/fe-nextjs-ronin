export const RONIN_CONFIG = {
  chainId: process.env.NEXT_PUBLIC_RONIN_CHAIN_ID,
  chainName: 'Ronin',
  nativeCurrency: {
    name: 'Ronin',
    symbol: 'RON',
    decimals: 18,
  },
  explorerUrl: process.env.NEXT_PUBLIC_MAINNET_EXPLORER,
  rpcUrl: process.env.NEXT_PUBLIC_MAINNET_RONIN_RPC,
};

export const SAIGON_CONFIG = {
  chainId: process.env.NEXT_PUBLIC_SAIGON_CHAIN_ID,
  chainName: 'Saigon Testnet',
  nativeCurrency: {
    name: 'Saigon',
    symbol: 'SGN',
    decimals: 18,
  },
  explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL,
  rpcUrl: process.env.NEXT_PUBLIC_RONIN_RPC,
};
