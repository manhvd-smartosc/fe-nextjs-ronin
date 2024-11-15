'use client';

import { ethers } from 'ethers';
import { mainContractAbi } from '../abi/mainContractAbi';
import { Connector } from 'wagmi';
import { erc20Abi } from '../abi/erc20Abi';
import { multicall3Abi } from '../abi/multicall3Abi';
import Big from 'big.js';
import BigNumber from 'bignumber.js';
import {
  mainContractAddress,
  multicall3Address,
  rpcUrl,
  switchChain,
} from './common';

interface TokenInfo {
  name: string;
  symbol: string;
  initAmountIn: string;
  description: string;
  extended: string;
  tokenUrlImage: string;
}

interface CheckTokenBalanceParams {
  address: string;
  tokenAddress: string;
}

const createTokenOnContract = async (
  connector: Connector,
  tokenInfo: TokenInfo,
): Promise<{ tokenAddress: string; txHash: string } | undefined> => {
  try {
    // Establish connection with Ronin Wallet
    await switchChain(connector);
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // Ensure the signer is linked with the wallet's address
    const accounts = await connector.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found in Ronin Wallet');
    }

    const mainContract = new ethers.Contract(
      mainContractAddress,
      mainContractAbi,
      provider,
    );

    const creationFee = await mainContract.creationFee_();
    const valueAmount = new BigNumber(tokenInfo.initAmountIn.toString())
      .multipliedBy(1e18)
      .toString(10);
    const totalValue = new BigNumber(creationFee)
      .plus(valueAmount)
      .toString(10);

    const gasEstimate = await mainContract.createNewToken.estimateGas(
      tokenInfo.name,
      tokenInfo.symbol,
      valueAmount,
      tokenInfo.description,
      tokenInfo.extended,
      tokenInfo.tokenUrlImage,
      {
        value: totalValue.toString(),
        from: accounts[0],
      },
    );

    const tx = {
      to: mainContractAddress,
      value: totalValue.toString(),
      from: accounts[0],
      gas: Math.ceil(Number(gasEstimate) * 1.02),
      nonce: await provider.getTransactionCount(accounts[0], 'latest'),
      data: mainContract.interface.encodeFunctionData('createNewToken', [
        tokenInfo.name,
        tokenInfo.symbol,
        valueAmount,
        tokenInfo.description,
        tokenInfo.extended,
        tokenInfo.tokenUrlImage,
      ]),
    };

    // Send the signed transaction using eth_sendRawTransaction
    const connectedProvider = await connector.getProvider();
    // @ts-expect-error
    const txHash = await connectedProvider.request({
      method: 'eth_sendTransaction',
      params: [tx],
    });

    await new Promise((resolve) => setTimeout(resolve, 7000));
    const txReceipt = await provider.getTransactionReceipt(txHash);
    let tokenAddress = ethers.ZeroAddress;
    if (txReceipt && txReceipt.logs) {
      for (const log of txReceipt.logs) {
        if (log.topics && log.topics[1] === ethers.ZeroHash) {
          tokenAddress = log.address;
          break;
        }
      }
    }
    await provider.waitForTransaction(txHash, 1, 30000);
    return { txHash, tokenAddress };
  } catch (error) {
    if ((error as { code?: string })?.code) {
      throw new Error((error as { code?: string }).code);
    }
    throw new Error('Unknown error');
  }
};

const validateRONBalance = async (
  tokenInfo: TokenInfo,
  roninAddress: string,
) => {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    const mainContract = new ethers.Contract(
      mainContractAddress,
      mainContractAbi,
      provider,
    );

    const creationFee = await mainContract.creationFee_();

    const valueAmount = new BigNumber(tokenInfo.initAmountIn.toString())
      .multipliedBy(1e18)
      .toString(10);

    const totalValue = new BigNumber(creationFee)
      .plus(valueAmount)
      .toString(10);

    const balanceWallet = await provider.getBalance(roninAddress);

    const gasPrice = (await provider.getFeeData()).gasPrice;

    const gasEstimate = await mainContract.createNewToken.estimateGas(
      tokenInfo.name,
      tokenInfo.symbol,
      valueAmount,
      tokenInfo.description,
      tokenInfo.extended,
      tokenInfo.tokenUrlImage,
      { value: totalValue.toString(), from: roninAddress },
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
    return false;
  }
};

// Check RON balance
const checkRONBalance = async (address: string): Promise<bigint> => {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const balance = await provider.getBalance(address);

    return balance;
  } catch (error) {
    console.error('Error checking RON balance:', error);
    return BigInt(0);
  }
};

// Check token balance
const checkTokenBalance = async ({
  address,
  tokenAddress,
}: CheckTokenBalanceParams): Promise<bigint> => {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);
    const balance = await tokenContract.balanceOf(address);
    return balance;
  } catch (error) {
    return BigInt(0);
  }
};

const getQuantityTokensByRon = async (
  tokenAddress: string,
  amountIn: string,
) => {
  if (!amountIn || !Number(amountIn)) return 0;

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const mainContract = new ethers.Contract(
      mainContractAddress,
      mainContractAbi,
      provider,
    );
    const amountInInWei = new BigNumber(amountIn)
      .multipliedBy(1e18)
      .toString(10);
    const estimateQuantityTokenByRon = await mainContract.estimateTokensForETH(
      tokenAddress,
      amountInInWei,
    );

    return +ethers.formatUnits(estimateQuantityTokenByRon, 18);
  } catch (error) {
    console.error('Get quantity tokens by ron error:', error);
    return 0;
  }
};

const getQuantityRonsByToken = async (
  tokenAddress: string,
  amountIn: string,
) => {
  if (!amountIn || !Number(amountIn)) return 0;
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const mainContract = new ethers.Contract(
      mainContractAddress,
      mainContractAbi,
      provider,
    );
    const amountInInWei = new BigNumber(amountIn)
      .multipliedBy(1e18)
      .toString(10);
    const estimateQuantityRonsByToken = await mainContract.estimateETHForTokens(
      tokenAddress,
      amountInInWei,
    );

    return +ethers.formatUnits(estimateQuantityRonsByToken, 18);
  } catch (error) {
    console.error('Get quantity rons by token error:', error);
    return 0;
  }
};

const estimateTokensByRon = async (amountIn: string) => {
  if (!amountIn) return '0';
  try {
    const amountInWei = new BigNumber(amountIn).multipliedBy(1e18).toString(10);

    const provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RONIN_RPC!,
    );
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS!,
      mainContractAbi,
      provider,
    );

    const [
      FEE_RATE,
      FEE_DENOMINATOR,
      INIT_VIRTUAL_TOKEN_RESERVE,
      INIT_REAL_TOKEN_RESERVE,
      virtualEthReserve,
    ] = await Promise.all([
      contract.feeRate_(),
      contract.FEE_DENOMINATOR(),
      contract.INIT_VIRTUAL_TOKEN_RESERVE(),
      contract.INIT_REAL_TOKEN_RESERVE(),
      contract.initVirtualEthReserve_(),
    ]);

    // Use the BigNumber methods from ethers.js
    const bnAmountInWei = ethers.getBigInt(amountInWei.toString());
    const bnFeeRate = ethers.getBigInt(FEE_RATE.toString());
    const bnFeeDenominator = ethers.getBigInt(FEE_DENOMINATOR.toString());
    const bnInitVirtualTokenReserve = ethers.getBigInt(
      INIT_VIRTUAL_TOKEN_RESERVE.toString(),
    );
    const bnInitRealTokenReserve = ethers.getBigInt(
      INIT_REAL_TOKEN_RESERVE.toString(),
    );
    const bnVirtualEthReserve = ethers.getBigInt(virtualEthReserve.toString());

    // Calculate fee
    const fee = (bnAmountInWei * bnFeeRate) / bnFeeDenominator;

    // Calculate amount after fee
    const amountAfterFee = bnAmountInWei - fee;

    // Calculate new reserves
    const newVirtualEthReserve = bnVirtualEthReserve + amountAfterFee;

    // Calculate curve constant and token amounts
    const curveConstant = bnVirtualEthReserve * bnInitVirtualTokenReserve;
    const newVirtualTokenReserve = curveConstant / newVirtualEthReserve;
    const amountOut = bnInitVirtualTokenReserve - newVirtualTokenReserve;

    // Check against token reserve limit
    if (amountOut > bnInitRealTokenReserve) {
      return ethers.formatEther(INIT_REAL_TOKEN_RESERVE);
    }

    return ethers.formatEther(amountOut);
  } catch (error) {
    console.error('Error estimating tokens:', error);
    throw error;
  }
};

const getQuantityTokensByRonBatch = async (
  tokens: { tokenAddress: string; amount: string }[],
) => {
  if (tokens.length === 0 || tokens.length > 20) {
    return null;
  }
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const multicall3Contract = new ethers.Contract(
      multicall3Address,
      multicall3Abi,
      provider,
    );
    const mainContract = new ethers.Contract(
      mainContractAddress,
      mainContractAbi,
      provider,
    );
    const calls = tokens.map((token) => ({
      target: mainContractAddress,
      allowFailure: true,
      callData: mainContract.interface.encodeFunctionData(
        'estimateETHForTokens',
        [token.tokenAddress, token.amount],
      ),
    }));

    const aggregateResponse = await multicall3Contract.aggregate3.staticCall(
      calls,
    );
    const processedResults = aggregateResponse.map(
      (result: { success: boolean; returnData: string }, index: number) => {
        if (!result.success) {
          console.warn(`Call failed for token ${tokens[index].tokenAddress}`);
          return null;
        }

        const decodedResult = mainContract.interface.decodeFunctionResult(
          'estimateETHForTokens',
          result.returnData,
        );

        return {
          tokenAddress: tokens[index].tokenAddress,
          estimatedETH: ethers.formatUnits(decodedResult[0], 18),
        };
      },
    );
    return processedResults;
  } catch (error) {
    console.error('Error in batch fetching token quantities:', error);
    return null;
  }
};

const totalSupply = new Big(1e18).mul(new Big(1e9));

const calculateGradMcap = (
  InitRealTokenReserves: any,
  InitVirtualTokenReserve: any,
  poolsData: any,
) => {
  const curveConstant = new Big(poolsData[13]);
  const initVirtualTokenReserves = new Big(InitRealTokenReserves);
  const initRealTokenReserves = new Big(InitVirtualTokenReserve);

  const amountBuyAll = curveConstant.div(
    initVirtualTokenReserves.sub(initRealTokenReserves),
  );

  // MCap (with total supply) in native expected to create pool
  //  = total supply * (virtual amount native buy all reserve) / (initVirtualTokenReserves - initRealTokenReserves)

  const mcapInRon = totalSupply
    .mul(amountBuyAll)
    .div(1e18)
    .div(initVirtualTokenReserves.sub(initRealTokenReserves));
  return mcapInRon.toNumber();
};

const getBondingCurveData = async (
  tokenContractAddress: string,
): Promise<{
  percent: number;
  gradMcap: number;
  ronReserve: number;
  tokenReserve: number;
}> => {
  const DEFAULT_VALUE = 1; // please setup at least 1% as default value
  let tmp = {
    percent: DEFAULT_VALUE,
    gradMcap: 0,
    ronReserve: 0,
    tokenReserve: 0,
  };
  if (!tokenContractAddress || !mainContractAddress) {
    return tmp;
  }

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const mainContract = new ethers.Contract(
      mainContractAddress,
      mainContractAbi,
      provider,
    );

    // Use Promise.all for parallel execution
    const [initialReserve, initVirtualTokenReserve, poolsData] =
      await Promise.all([
        mainContract.INIT_REAL_TOKEN_RESERVE(),
        mainContract.INIT_VIRTUAL_TOKEN_RESERVE(),
        mainContract.pools_(tokenContractAddress),
      ]);

    // Early validation of contract data
    if (!initialReserve || !poolsData?.[1]) {
      console.error('Invalid contract data received');
      return tmp;
    }

    // Convert to numbers once and cache
    const virtualReserve = Number(poolsData[1]);
    const initialReserveNum = Number(initialReserve);

    // Avoid division by zero
    if (initialReserveNum === 0) {
      console.error('Initial reserve cannot be zero');
      return tmp;
    }

    const percent = Math.floor(
      100 - (100 * virtualReserve) / initialReserveNum,
    );

    // Ensure positive integer result
    const percentage = Math.max(DEFAULT_VALUE, percent);
    tmp.percent = percentage;
    tmp.ronReserve = new Big(poolsData[3]).div(1e18).toNumber();
    tmp.gradMcap = calculateGradMcap(
      initialReserve,
      initVirtualTokenReserve,
      poolsData,
    );
    tmp.tokenReserve = new Big(poolsData[1]).div(1e18).toNumber();
  } catch (error) {
    console.error('Error in getBondingCurvePercent:', error);
    return tmp;
  }
  return tmp;
};

const getBondingCurvePercent = async (
  tokenContractAddress: string,
): Promise<number> => {
  const DEFAULT_VALUE = 1; // please setup at least 1% as default value

  if (!tokenContractAddress || !mainContractAddress) {
    console.error('Missing required parameters');
    return DEFAULT_VALUE;
  }

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const mainContract = new ethers.Contract(
      mainContractAddress,
      mainContractAbi,
      provider,
    );

    // Use Promise.all for parallel execution
    const [initialReserve, poolsData] = await Promise.all([
      mainContract.INIT_REAL_TOKEN_RESERVE(),
      mainContract.pools_(tokenContractAddress),
    ]);

    // Early validation of contract data
    if (!initialReserve || !poolsData?.[1]) {
      console.error('Invalid contract data received');
      return DEFAULT_VALUE;
    }

    // Convert to numbers once and cache
    const virtualReserve = Number(poolsData[1]);
    const initialReserveNum = Number(initialReserve);

    // Avoid division by zero
    if (initialReserveNum === 0) {
      console.error('Initial reserve cannot be zero');
      return DEFAULT_VALUE;
    }

    const percent = Math.floor(
      100 - (100 * virtualReserve) / initialReserveNum,
    );

    // Ensure positive integer result
    return Math.max(DEFAULT_VALUE, percent);
  } catch (error) {
    console.error('Error in getBondingCurvePercent:', error);
    return DEFAULT_VALUE;
  }
};

export {
  createTokenOnContract,
  validateRONBalance,
  checkRONBalance,
  checkTokenBalance,
  estimateTokensByRon,
  getQuantityTokensByRon,
  getQuantityRonsByToken,
  getQuantityTokensByRonBatch,
  getBondingCurveData,
  getBondingCurvePercent,
};
