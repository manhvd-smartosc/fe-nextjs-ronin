import { signIn } from 'next-auth/react';

// Fix typescript errors for window.ronin
declare global {
  interface Window {
    ronin?: any;
  }
}

const Auth = () => {
  const onSignInWithCrypto = async () => {
    try {
      const provider = window.ronin.provider;
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });
      if (!accounts) {
        return;
      }
      const currentAccount = accounts[0];
      console.log({ currentAccount });

      const response = await fetch('/api/auth/crypto/generateNonce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicAddress: currentAccount,
        }),
      });
      const responseData = await response.json();

      const signedNonce = await provider.request({
        method: 'personal_sign',
        params: [responseData.nonce, currentAccount],
      });

      // Send the public address to generate a nonce associates with our account
      // Use NextAuth to sign in with our address and the nonce
      await signIn('crypto', {
        publicAddress: currentAccount,
        signedNonce: signedNonce,
        callbackUrl: '/',
      });
    } catch (error) {
      window.alert(`Error with signing, please try again. ${error}`);
    }
  };

  return (
    <main>
      <p>
        After clicking the button you will be prompted to connect your wallet
        with this site, then you will need to sign a nonce (random hex string)
        to prove you own the account.
      </p>
      <button onClick={onSignInWithCrypto}>Sign in with Ronin Wallet</button>
    </main>
  );
};

export default Auth;
