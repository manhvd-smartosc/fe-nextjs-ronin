import TokenDetailContainer from 'containers/TokenDetail';
import Head from 'next/head';
import { Metadata } from '..';
import { GetServerSideProps } from 'next';
import { getToken } from '@/lib-server/services/tokens';

import { redirect } from 'next/navigation';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { address } = context.params || {};
  if (!address) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  const tokenAddress = Array.isArray(address) ? address[0] : address;
  try {
    const data = await getToken(tokenAddress);

    return {
      props: {
        metadata: {
          title: data?.ticker
            ? `Token ${data?.ticker} - Tama.meme`
            : 'Tama.meme',
          description: data?.description ? data.description : 'Tama.meme',
          image: data?.imageUrl ? data.imageUrl : '/images/tamameme.png',
          type: 'website',
          card: 'summary_large_image',
        },
      },
    };
  } catch (error) {
    console.error('Error fetching token data', error);
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};

interface TokenDetailProps {
  metadata: Metadata;
}

function TokenDetail({ metadata }: TokenDetailProps) {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta itemProp="description" content={metadata.description} />
        <meta property="og:description" content={metadata.description} />
        <meta name="twitter:description" content={metadata.description} />
        <meta itemProp="image" content={metadata.image} />
        <meta property="og:image" content={metadata.image} />
        <meta name="twitter:image" content={metadata.image} />
        <meta property="og:type" content={metadata.type} />
        <meta name="twitter:card" content={metadata.card} />
      </Head>
      <TokenDetailContainer />
    </>
  );
}

export default TokenDetail;
