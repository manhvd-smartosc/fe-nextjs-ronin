import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib-server/prisma';
import crypto from 'crypto';

interface CryptoNonceResponse {
  nonce: string;
  expires: string;
}

const generateNonce = async (
  req: NextApiRequest,
  res: NextApiResponse<CryptoNonceResponse>,
) => {
  const { publicAddress: address } = req.body;

  const nonce = crypto.randomBytes(32).toString('hex');
  const expiredAt = new Date(new Date().getTime() + 1000 * 60 * 60);

  try {
    await prisma.user.upsert({
      where: { address: address.toLowerCase() },
      create: {
        address: address.toLowerCase(),
        id: address.toLowerCase(),
        avatarUrl: '',
        name: '',
        WalletLogins: {
          create: {
            nonce,
            expiredAt,
          },
        },
      },
      update: {
        WalletLogins: {
          upsert: {
            create: {
              nonce,
              expiredAt,
            },
            update: {
              nonce,
              expiredAt,
            },
          },
        },
      },
    });
  } catch (error) {
    console.log('Error in generateNonce', error);
  }

  return res.status(200).json({
    nonce,
    expires: expiredAt.toISOString(),
  });
};

export default generateNonce;
