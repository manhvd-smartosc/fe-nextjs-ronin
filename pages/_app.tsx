import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { Amplify } from 'aws-amplify';

import Layout from '@/components/Layout';

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
      <ChakraProvider value={defaultSystem}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </SessionProvider>
  );
};
export default App;
