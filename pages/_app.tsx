'use client';

import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Amplify } from 'aws-amplify';
import { ToastContainer } from 'react-toastify';
import { WagmiProvider } from 'wagmi';
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import 'react-toastify/dist/ReactToastify.css';
import { config as wagmiConfig } from '@/configs/wagmi';
import { PriceProvider } from '@/contexts/price';

import { Layout } from '@/components/Layout';
import '../styles/globals.css';
import '../styles/font.css';
import theme from '@/styles/theme';

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

const queryClient = new QueryClient();

const App = ({
  Component,
  pageProps: { session, dehydratedState, ...pageProps },
}: AppProps) => {
  // const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <Layout>
              <PriceProvider>
                <HydrationBoundary state={dehydratedState}>
                  <Component {...pageProps} />
                </HydrationBoundary>
                <ToastContainer position="bottom-right" />
              </PriceProvider>
            </Layout>
          </QueryClientProvider>
        </WagmiProvider>
      </ChakraProvider>
    </SessionProvider>
  );
};
export default App;
