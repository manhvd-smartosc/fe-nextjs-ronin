// types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      publicAddress: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    publicAddress: string | null;
  }
}
