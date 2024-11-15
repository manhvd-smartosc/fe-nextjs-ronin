import Head from 'next/head';
import CreateTokenContainer from '@/containers/CreateToken';
import React from 'react';

const createToken = () => {
  return (
    <>
      <Head>
        <title>Create token - Tama.meme</title>
      </Head>
      <CreateTokenContainer />
    </>
  );
};

export default createToken;
