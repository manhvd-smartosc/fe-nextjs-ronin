import { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from '../../lib-server/next-connect';
import axios from 'axios';
import { prisma } from '../../lib-server/prisma';
import { Token, TradeType, User } from '@prisma/client';

const handler = apiHandler();

// GET: /api/test
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await axios.get(
    'https://frontend-api.pump.fun/trades/all/GVCBBfdXA1vYBCBYJJZVEU9248WSzCbGo21XVJ77pump?limit=200&offset=0&minimumSize=50000000',
  );

  const users = await prisma.user.findMany();

  const trades = result.data.map((trade: any) => ({
    type: trade.is_buy ? TradeType.BUY : TradeType.SELL,
    tokenAmount: trade.token_amount,
    ronAmount: trade.sol_amount,
    createdAt: trade.timestamp,
    userId: users[Math.floor(Math.random() * users.length)].id,
    tokenId: 1,
    transactionHash: trade.signature,
    lastPrice: trade.sol_amount,
  }));

  await prisma.trade.createMany({
    data: trades,
  });

  return res.status(200).json(true);
});

export default handler;
