import ProfileContainer from '@/containers/profile';
import { GetServerSideProps } from 'next';
import { Metadata } from '..';
import Head from 'next/head';
import { getUser } from '@/lib-server/services/users';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};
  if (!id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  const userAddress = Array.isArray(id) ? id[0] : id;
  // const data = await fetch(
  //   `${process.env.NEXTAUTH_URL}/api/profile/${userAddress}`,
  // ).then((res) => res.json());
  try {
    const data = await getUser(userAddress);

    if (!data?.address) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const title = data?.name ? data.name : `@${data.address.slice(2, 8)}`;

    return {
      props: {
        metadata: {
          title: `${title} - Tama.meme`,
          description: data?.bio ? data.bio : 'Tama.meme',
          image: !!data?.avatarUrl ? data.avatarUrl : '/images/pepe.png',
          type: 'website',
          card: 'summary_large_image',
        },
      },
    };
  } catch (error) {
    console.error('Error fetching user data', error);
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};

interface ProfileProps {
  metadata: Metadata;
}

function Profile({ metadata }: ProfileProps) {
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
      <ProfileContainer />
    </>
  );
}

export default Profile;
