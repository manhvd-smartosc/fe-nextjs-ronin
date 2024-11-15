import { http, createConfig } from 'wagmi';
import { ronin, saigon } from 'wagmi/chains';
import { roninWallet } from '@sky-mavis/tanto-wagmi';
import { walletConnect } from '@wagmi/connectors';

const roninWalletConnectConfigs = {
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  showQrModal: false,
  metadata: {
    name: 'Tama.meme',
    description: 'Tama.meme',
    icons: ['https://tama.meme/media/8bfb9a9d631a8cfe928a9238f9cbad0a.svg'],
    url: process.env.NEXTAUTH_URL!,
  },
};

const allowedChainId = Number(process.env.NEXT_PUBLIC_ALLOWED_CHAIN_ID);
const chain = allowedChainId === saigon.id ? saigon : ronin;

export const config = createConfig({
  chains: [chain],
  transports: {
    [saigon.id]: http(),
    [ronin.id]: http(),
  },
  connectors: [roninWallet(), walletConnect(roninWalletConnectConfigs)],
});
