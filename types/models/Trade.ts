import { Trade, User, Token } from '@prisma/client';

export type TradesResponseData = Trade & {
  id: string;
  tokenId: string;
  createdAt: number;
  token: Token;
  user: User;
};
