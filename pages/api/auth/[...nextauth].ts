import { prisma } from '@/lib-server/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { AuthOptions, RequestInternal } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SiweMessage } from 'siwe';
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
  credentials:
    | Record<'publicAddress' | 'signature' | 'message', string>
    | undefined,
  req: Pick<RequestInternal, 'body' | 'headers' | 'method' | 'query'>,
) {
  if (!credentials) return null;
  const { publicAddress: address, signature, message } = credentials;
  // Get user from database with their generated nonce
  const user = await prisma.user.findFirst({
    where: {
      address: {
        equals: address,
        mode: 'insensitive',
      },
    },
    include: { WalletLogins: true },
  });

  if (!user?.WalletLogins) return null;
  const siwe = new SiweMessage(JSON.parse(message));
  const nextAuthUrl = new URL(process.env.NEXTAUTH_URL || '');

  const result = await siwe.verify({
    signature,
    domain: nextAuthUrl.hostname,
    nonce: user.WalletLogins.nonce,
  });

  if (!result.success) return null;
  if (user.WalletLogins.expiredAt < new Date()) return null;
  await prisma.walletLogins.delete({ where: { userId: user.id } });

  return {
    id: user.id,
    publicAddress: user.address,
  };
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'crypto',
      name: 'Crypto Wallet Auth',
      credentials: {
        publicAddress: { label: 'Public Address', type: 'text' },
        signature: { label: 'Signature', type: 'text' },
        message: { label: 'Message', type: 'text' },
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
