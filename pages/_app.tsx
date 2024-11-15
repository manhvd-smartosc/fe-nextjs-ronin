import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  API: {
    Events: {
      endpoint: process.env.NEXT_PUBLIC_AMPLIFY_ENDPOINT || '',
      region: process.env.NEXT_PUBLIC_AMPLIFY_REGION || '',
      defaultAuthMode: 'apiKey',
      apiKey: process.env.NEXT_PUBLIC_AMPLIFY_API_KEY || '',
    },
  },
});

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};
export default App;
