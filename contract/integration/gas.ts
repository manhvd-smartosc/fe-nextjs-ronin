'use client';

import { ethers } from 'ethers';
import { mainContractAbi } from '../abi/mainContractAbi';
import { Connector } from 'wagmi';
import BigNumber from 'bignumber.js';
import { mainContractAddress, rpcUrl } from './common';
import { checkRONBalance, checkTokenBalance } from './token';

interface EstimateGasForBuyParams {
  connector: Connector;
  amount: string;
  tokenAddress: string;
  minReceived?: string;
}
interface EstimateGasForSellParams {
  connector: Connector;
  amount: string;
  tokenAddress: string;
  minReceived?: string;
}

const estimateGasForBuy = async ({
  connector,
  amount,
  tokenAddress,
  minReceived,
}: EstimateGasForBuyParams): Promise<any | false> => {
  try {
    const accounts = await connector.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found in Ronin Wallet');
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const mainContract = new ethers.Contract(
      mainContractAddress,
      mainContractAbi,
      provider,
    );

    // Get RON balance
    const balance = await checkRONBalance(accounts[0]);
    const buyAmountInWei = new BigNumber(amount)
      .multipliedBy(1e18)
      .toString(10);

    if (new BigNumber(buyAmountInWei).isGreaterThan(balance.toString())) {
      return false;
    }

    const minReceivedInWei = new BigNumber(minReceived || '0')
      .multipliedBy(1e18)
      .toString(10);
    const deadline = Math.floor(Date.now() / 1000) + 1800;
    const gasEstimate = await mainContract.buyTokensWithETH.estimateGas(
      tokenAddress,
      buyAmountInWei,
      minReceivedInWei,
      accounts[0],
      deadline,
      {
        from: accounts[0],
        value: buyAmountInWei,
      },
    );

    // Check if total cost (gas + amount) exceeds balance
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice!;
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
    const totalCost = new BigNumber(buyAmountInWei)
      .plus(
        new BigNumber(gasEstimate.toString()).multipliedBy(gasPrice.toString()),
      )
      .toString(10);

    if (new BigNumber(totalCost).isGreaterThan(balance.toString())) {
      return false;
    }

    return { gasEstimate, maxPriorityFeePerGas };
  } catch (error) {
    console.error('Error estimating gas for buy:', error);
    return false;
  }
};

// Estimate gas for sell
const estimateGasForSell = async ({
  connector,
  amount,
  tokenAddress,
  minReceived,
}: EstimateGasForSellParams): Promise<any | false> => {
  try {
    const accounts = await connector.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found in Ronin Wallet');
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const mainContract = new ethers.Contract(
      mainContractAddress,
      mainContractAbi,
      provider,
    );

    const balance = await checkTokenBalance({
      address: accounts[0],
      tokenAddress,
    });
    const sellAmountInWei = new BigNumber(amount)
      .multipliedBy(1e18)
      .toString(10);

    if (new BigNumber(sellAmountInWei).isGreaterThan(balance.toString())) {
      return false;
    }

    const deadline = Math.floor(Date.now() / 1000) + 1800;

    const minReceivedString = new BigNumber(minReceived || '0')
      .multipliedBy(1e18)
      .integerValue()
      .toString(10);

    const gasEstimate = await mainContract.sellTokensForETH.estimateGas(
      tokenAddress,
      sellAmountInWei,
      minReceivedString,
      accounts[0],
      deadline,
      { from: accounts[0] },
    );

    // Check if user has enough RON for gas
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice!;
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
    const gasCost = gasEstimate * gasPrice;

    const ronBalance = await checkRONBalance(accounts[0]);

    if (gasCost > ronBalance) {
      return false;
    }

    return { gasEstimate, maxPriorityFeePerGas };
  } catch (error) {
    console.error('Error estimating gas for sell:', error);
    return false;
  }
};

export { estimateGasForBuy, estimateGasForSell };
