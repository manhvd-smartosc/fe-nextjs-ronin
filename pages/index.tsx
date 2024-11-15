import Head from 'next/head';
import HomeContainer from '@/containers/Home';

export async function getServerSideProps() {
  return {
    props: {
      metadata: {
        title: 'Tama.meme',
        description: 'Tama.meme',
        image: '/images/tamameme.png',
        type: 'website',
        card: 'summary_large_image',
      },
    },
  };
}

export interface Metadata {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  card?: string;
  url?: string;
}

interface HomeProps {
  metadata: Metadata;
}

export default function Home({ metadata }: HomeProps) {
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
      <HomeContainer />
    </>
  );
}
