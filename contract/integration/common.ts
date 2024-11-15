import { Connector } from 'wagmi';

const mainContractAddress = process.env.NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS || '';
const pythUpgradableProxyAddress =
  process.env.NEXT_PUBLIC_PYTH_UPGRADABLE_PROXY_ADDRESS || '';
const idHashPrice = process.env.NEXT_PUBLIC_ID_HASH_CODE_PRICE || '';
const roninRpc = process.env.NEXT_PUBLIC_MAINNET_RONIN_RPC || '';
const rpcUrl = process.env.NEXT_PUBLIC_RONIN_RPC;
const multicall3Address = process.env.NEXT_PUBLIC_MULTICALL3_ADDRESS || '';

const switchChain = async (connector: Connector) => {
  // Establish connection with Ronin Wallet
  const currentChainId = await connector.getChainId();
  const allowedChainId = Number(process.env.NEXT_PUBLIC_ALLOWED_CHAIN_ID);
  if (currentChainId !== allowedChainId && connector.switchChain) {
    await connector?.switchChain({ chainId: allowedChainId });
  }
};

export {
  mainContractAddress,
  pythUpgradableProxyAddress,
  idHashPrice,
  roninRpc,
  rpcUrl,
  multicall3Address,
  switchChain,
};
