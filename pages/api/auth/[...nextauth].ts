import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { ethers } from 'ethers';
import NextAuth, { AuthOptions, RequestInternal } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const NEXT_AUTH_SECRET = process.env.NEXT_AUTH_SECRET;

/**
 * Authorization function for crypto login
 * takes publicAdress and signature from credentials and returns
 * either a user object on success or null on failure
 * @param credentials
 * @param req
 * @returns
 */

async function authorizeCrypto(
  credentials: Record<'publicAddress' | 'signedNonce', string> | undefined,
  req: Pick<RequestInternal, 'body' | 'headers' | 'method' | 'query'>,
) {
  if (!credentials) return null;

  const { publicAddress, signedNonce } = credentials;

  // Get user from database with their generated nonce
  const user = await prisma.user.findUnique({
    where: { publicAddress },
    include: { cryptoLoginNonce: true },
  });

  if (!user?.cryptoLoginNonce) return null;

  // Compute the signer address from the saved nonce and the received signature
  const signerAddress = ethers.verifyMessage(
    user.cryptoLoginNonce.nonce,
    signedNonce,
  );

  // Check that the signer address matches the public address that is trying to sign in
  if (signerAddress.toLowerCase() !== publicAddress.toLowerCase()) return null;

  // Check that the nonce is not expired
  if (user.cryptoLoginNonce.expires < new Date()) return null;

  // Everything is fine, clear the nonce and return the user
  await prisma.cryptoLoginNonce.delete({ where: { userId: user.id } });

  return {
    id: user.id,
    publicAddress: user.publicAddress,
  };
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'crypto',
      name: 'Crypto Wallet Auth',
      credentials: {
        publicAddress: { label: 'Public Address', type: 'text' },
        signedNonce: { label: 'Signed Nonce', type: 'text' },
      },
      authorize: authorizeCrypto,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  secret: NEXT_AUTH_SECRET || 'default_secret',
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      // `token` is the JWT token that will be returned to the client
      // `user` is the user object returned from the `authorize` function
      if (user) {
        token.id = user.id;
        token.publicAddress = user.publicAddress;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id;
      session.user.publicAddress = token.publicAddress;
      return session;
    },
  },
};

export default NextAuth(authOptions);
