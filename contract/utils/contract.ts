'use client';

import {
  requestRoninWalletConnector,
  ChainIds,
} from '@sky-mavis/tanto-connect';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { mainContractAbi } from '../abi/mainContractAbi';
import { pythUpgradableProxyAbi } from '../abi/pythUpgradableProxyAbi';

interface TokenInfo {
  name: string;
  symbol: string;
  initAmountIn: string;
  description: string;
  extended: string;
  tokenUrlImage: string;
}

const mainContractAddress = process.env.NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS || '';
const pythUpgradableProxyAddress =
  process.env.NEXT_PUBLIC_PYTH_UPGRADABLE_PROXY_ADDRESS || '';
const idHashPrice = process.env.NEXT_PUBLIC_ID_HASH_CODE_PRICE || '';
const roninRpc = process.env.NEXT_PUBLIC_MAINNET_RONIN_RPC || '';
const saigonRpcUrl = process.env.NEXT_PUBLIC_TESTNET_RONIN_RPC;

export const getPrice = async () => {
  try {
    const provider = new ethers.JsonRpcProvider(roninRpc);
    const contract = new ethers.Contract(
      pythUpgradableProxyAddress,
      pythUpgradableProxyAbi,
      provider,
    );
    const [price, , exponent] = await contract.getPrice(idHashPrice);
    return Number(price) * 10 ** Number(exponent);
  } catch (error) {
    console.error('Error fetching price:', error);
  }
};

export const createTokenOnContract = async (tokenInfo: TokenInfo) => {
  try {
    // Establish connection with Ronin Wallet
    const connector = await requestRoninWalletConnector();
    const currentChainId = await connector.getChainId();
    if (currentChainId !== ChainIds.RoninTestnet) {
      await connector?.switchChain(ChainIds.RoninTestnet);
    }
    await connector.connect();
    const provider = new ethers.JsonRpcProvider(saigonRpcUrl);

    // Ensure the signer is linked with the wallet's address
    const accounts = await connector.getAccounts();
    console.log('Accounts:', accounts);
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found in Ronin Wallet');
    }

    const price = await getPrice();
    console.log('Price:', price);

    const mainContract = new ethers.Contract(
      mainContractAddress,
      mainContractAbi,
      provider,
    );

    const creationFee = await mainContract.creationFee_();
    console.log('Creation Fee:', ethers.formatEther(creationFee));

    const totalValue =
      Number(creationFee) + Number(ethers.parseEther(tokenInfo.initAmountIn));
    const realTotalValue = totalValue.toString();
    console.log('Total Value:', +realTotalValue);

    const gasEstimate = await mainContract.createNewToken.estimateGas(
      tokenInfo.name,
      tokenInfo.symbol,
      ethers.parseEther(tokenInfo.initAmountIn),
      tokenInfo.description,
      tokenInfo.extended,
      tokenInfo.tokenUrlImage,
      { value: totalValue.toString() },
    );
    console.log('gasEstimate', Number(gasEstimate));

    const tx = {
      to: mainContractAddress,
      value: totalValue.toString(),
      from: accounts[0],
      gas: Math.ceil(Number(gasEstimate) * 1.02),
      data: mainContract.interface.encodeFunctionData('createNewToken', [
        tokenInfo.name,
        tokenInfo.symbol,
        ethers.parseEther(tokenInfo.initAmountIn),
        tokenInfo.description,
        tokenInfo.extended,
        tokenInfo.tokenUrlImage,
      ]),
    };

    // Send the signed transaction using eth_sendRawTransaction
    const network = await connector.getProvider();
    const txHash = await network.request({
      method: 'eth_sendTransaction',
      params: [tx],
    });

    console.log('Transaction Hash:', txHash);
    return txHash as string;
  } catch (error: any) {
    toast.error(`Detailed error: ${error?.message}`);
  }
};

export const validateRONBalance = async (
  tokenInfo: TokenInfo,
  roninAddress: string,
) => {
  try {
    const provider = new ethers.JsonRpcProvider(saigonRpcUrl);

    const mainContract = new ethers.Contract(
      mainContractAddress,
      mainContractAbi,
      provider,
    );

    const creationFee = await mainContract.creationFee_();

    const totalValue =
      Number(creationFee) + Number(ethers.parseEther(tokenInfo.initAmountIn));

    const balanceWallet = await provider.getBalance(roninAddress);
    const gasPrice = (await provider.getFeeData()).gasPrice;

    const gasEstimate = await mainContract.createNewToken.estimateGas(
      tokenInfo.name,
      tokenInfo.symbol,
      ethers.parseEther(tokenInfo.initAmountIn),
      tokenInfo.description,
      tokenInfo.extended,
      tokenInfo.tokenUrlImage,
      { value: totalValue },
    );
    const amountRonCostForTransaction = Math.ceil(
      Number(gasEstimate) * Number(gasPrice),
    );
    if (amountRonCostForTransaction <= Number(balanceWallet)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    toast.error('Error fetching RON balance');
  }
};
