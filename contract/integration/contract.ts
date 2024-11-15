'use client';

import { ethers } from 'ethers';
import { mainContractAbi } from '../abi/mainContractAbi';
import { Connector } from 'wagmi';
import BigNumber from 'bignumber.js';
import { mainContractAddress, rpcUrl, switchChain } from './common';
import { estimateGasForBuy, estimateGasForSell } from './gas';
import { checkTokenBalance } from './token';
import { erc20Abi } from '../abi/erc20Abi';

interface HandleBuyParams {
  connector: Connector;
  tokenAddress: string;
  buyAmount: string;
  minReceived?: string;
  priorityFee?: string;
  slippagePercent?: number;
}

interface HandleSellParams {
  connector: Connector;
  tokenAddress: string;
  sellAmount: string;
  minReceived?: string;
  priorityFee?: string;
  slippagePercent?: number;
}

// Handle Buy
const handleBuy = async ({
  connector,
  tokenAddress,
  buyAmount,
  minReceived = '0',
  priorityFee = '0',
}: HandleBuyParams) => {
  // Establish connection with Ronin Wallet
  await switchChain(connector);
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

    const deadline = Math.floor(Date.now() / 1000) + 1800;
    const gasPriceData = await provider.getFeeData();
    const gasPrice = gasPriceData.gasPrice ? gasPriceData.gasPrice : BigInt(0);
    const buyAmountInWei = new BigNumber(buyAmount)
      .multipliedBy(1e18)
      .toString(10);

    let minReceivedString;
    if (minReceived === '0') {
      const estimatedTokens = await mainContract.estimateTokensForETH(
        tokenAddress,
        buyAmountInWei,
      );
      const expectedTokens = new BigNumber(estimatedTokens.toString());
      const slippageMultiplier = new BigNumber(80).dividedBy(100);
      minReceivedString = expectedTokens
        .multipliedBy(slippageMultiplier)
        .integerValue()
        .toString(10);
    } else {
      minReceivedString = new BigNumber(minReceived)
        .multipliedBy(1e18)
        .multipliedBy(50)
        .dividedBy(100)
        .integerValue()
        .toString(10);
    }

    // Estimate gas first
    const gasData = await estimateGasForBuy({
      connector,
      amount: buyAmount,
      tokenAddress,
      minReceived: ethers.formatEther(minReceivedString),
    });

    if (!gasData) {
      throw new Error('Failed to estimate gas or insufficient balance');
    }

    const valueAmount = new BigNumber(buyAmount)
      .multipliedBy(1e18)
      .toString(10);

    const tx = {
      to: mainContractAddress,
      value: valueAmount,
      from: accounts[0],
      gas: new BigNumber(gasData.gasEstimate).toFixed(),
      gasPrice: new BigNumber(gasPrice.toString())
        .plus(new BigNumber(priorityFee))
        .toFixed(),
      nonce: await provider.getTransactionCount(accounts[0], 'latest'),
      data: mainContract.interface.encodeFunctionData('buyTokensWithETH', [
        tokenAddress,
        valueAmount,
        minReceivedString,
        accounts[0],
        deadline,
      ]),
    };

    console.log({ tx });

    const network: any = await connector.getProvider();
    const txHash = await network.request({
      method: 'eth_sendTransaction',
      params: [tx],
    });
    await provider.waitForTransaction(txHash, 1, 30000);
    return txHash;
  } catch (error) {
    if ((error as { code?: string })?.code) {
      throw new Error((error as { code?: string }).code);
    }
    throw new Error('Unknown error');
  }
};

const handleApproveToken = async ({
  connector,
  tokenAddress,
  amount,
  provider,
}: {
  connector: any;
  tokenAddress: string;
  amount: string;
  provider: ethers.JsonRpcProvider;
}) => {
  try {
    console.log('=======> Approving token');
    const accounts = await connector.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found in Ronin Wallet');
    }

    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);

    const currentAllowance = await tokenContract.allowance(
      accounts[0],
      mainContractAddress,
    );

    const amountToSell = new BigNumber(amount).multipliedBy(1e18);
    const maxApproval = new BigNumber(2).pow(256).minus(1);

    // If current allowance is sufficient for the sale amount, no need to approve
    if (new BigNumber(currentAllowance.toString()).gte(amountToSell)) {
      return true;
    }

    const gasData = await tokenContract.approve.estimateGas(
      mainContractAddress,
      maxApproval.toString(10),
      {
        from: accounts[0],
      },
    );

    if (!gasData) {
      throw new Error('Failed to estimate gas or insufficient balance');
    }

    const gasPriceData = await provider.getFeeData();
    const gasPrice = gasPriceData.gasPrice ? gasPriceData.gasPrice : BigInt(0);

    const tx = {
      to: tokenAddress,
      from: accounts[0],
      gas: new BigNumber(gasData.toString()).toFixed(),
      gasPrice: new BigNumber(gasPrice.toString())
        .multipliedBy(120)
        .dividedBy(100),
      data: tokenContract.interface.encodeFunctionData('approve', [
        mainContractAddress,
        maxApproval.toString(10),
      ]),
    };

    const network: any = await connector.getProvider();
    const txHash = await network.request({
      method: 'eth_sendTransaction',
      params: [tx],
    });

    await provider.waitForTransaction(txHash, 1, 30000);
    return txHash;
  } catch (error) {
    console.error('Approval error:', error);
    if ((error as { code?: string })?.code) {
      throw new Error((error as { code?: string }).code);
    }
    throw new Error('Error approving token');
  }
};

// Handle Sell
const handleSell = async ({
  connector,
  tokenAddress,
  sellAmount,
  minReceived = '0',
  priorityFee = '0',
}: HandleSellParams) => {
  try {
    await switchChain(connector);
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

    const deadline = Math.floor(Date.now() / 1000) + 1800;
    const gasPriceData = await provider.getFeeData();
    const gasPrice = gasPriceData.gasPrice ? gasPriceData.gasPrice : BigInt(0);
    const sellAmountInWei = new BigNumber(sellAmount)
      .multipliedBy(1e18)
      .toString(10);
    let minReceivedString;
    if (minReceived === '0') {
      const estimatedTokens = await mainContract.estimateETHForTokens(
        tokenAddress,
        sellAmountInWei,
      );
      const expectedTokens = new BigNumber(estimatedTokens.toString());
      const slippageMultiplier = new BigNumber(80).dividedBy(100);
      minReceivedString = expectedTokens
        .multipliedBy(slippageMultiplier)
        .integerValue()
        .toString(10);
    } else {
      minReceivedString = new BigNumber(minReceived)
        .multipliedBy(1e18)
        .multipliedBy(50)
        .dividedBy(100)
        .integerValue()
        .toString(10);
    }

    // Check token balance
    const balance = await checkTokenBalance({
      address: accounts[0],
      tokenAddress,
    });

    if (new BigNumber(sellAmountInWei).isGreaterThan(balance.toString())) {
      throw new Error('Insufficient token balance');
    }

    await handleApproveToken({
      connector,
      tokenAddress,
      amount: sellAmount,
      provider,
    });

    // Estimate gas first
    const gasData = await estimateGasForSell({
      connector,
      amount: sellAmount,
      tokenAddress,
      minReceived: ethers.formatEther(minReceivedString),
    });

    if (!gasData) {
      throw new Error('Failed to estimate gas or insufficient balance');
    }

    const tx = {
      to: mainContractAddress,
      from: accounts[0],
      gas: new BigNumber(gasData.gasEstimate).toFixed(),
      gasPrice: new BigNumber(gasPrice.toString())
        .plus(new BigNumber(priorityFee))
        .toFixed(),
      nonce: await provider.getTransactionCount(accounts[0], 'latest'),
      data: mainContract.interface.encodeFunctionData('sellTokensForETH', [
        tokenAddress,
        sellAmountInWei,
        minReceivedString,
        accounts[0],
        deadline,
      ]),
    };
    console.log({ tx });

    const network: any = await connector.getProvider();
    const txHash = await network.request({
      method: 'eth_sendTransaction',
      params: [tx],
    });
    await provider.waitForTransaction(txHash, 1, 30000);
    return txHash;
  } catch (error) {
    if ((error as { code?: string })?.code) {
      throw new Error((error as { code?: string }).code);
    }
    throw new Error('Unknown error');
  }
};

export { handleBuy, handleSell };
