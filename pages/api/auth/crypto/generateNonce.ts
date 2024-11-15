import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

interface CryptoNonceResponse {
  nonce: string;
  expires: string;
}

const generateNonce = async (
  req: NextApiRequest,
  res: NextApiResponse<CryptoNonceResponse>,
) => {
  const { publicAddress } = req.body;

  const nonce = crypto.randomBytes(32).toString('hex');
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60);

  await prisma.user.upsert({
    where: { publicAddress },
    create: {
      publicAddress,
      cryptoLoginNonce: {
        create: {
          nonce,
          expires,
        },
      },
    },
    update: {
      cryptoLoginNonce: {
        upsert: {
          create: {
            nonce,
            expires,
          },
          update: {
            nonce,
            expires,
          },
        },
      },
    },
  });

  return res.status(200).json({
    nonce,
    expires: expires.toISOString(),
  });
};

export default generateNonce;
