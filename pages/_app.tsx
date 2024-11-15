import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Amplify } from 'aws-amplify';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import 'react-toastify/dist/ReactToastify.css';

import Layout from '@/components/Layout';
import '../styles/globals.css';
import getQueryClientConfig from '@/lib-client/react-query/queryClientConfig';

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

const App = ({
  Component,
  pageProps: { session, dehydratedState, ...pageProps },
}: AppProps) => {
  const [queryClient] = useState(() => new QueryClient(getQueryClientConfig()));

  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <Layout>
          <QueryClientProvider client={queryClient}>
            <Hydrate state={dehydratedState}>
              <Component {...pageProps} />
            </Hydrate>
          </QueryClientProvider>

          <ToastContainer />
        </Layout>
      </ChakraProvider>
    </SessionProvider>
  );
};
export default App;
