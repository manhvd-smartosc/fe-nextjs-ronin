import { Box, Button, Image } from '@chakra-ui/react';
import BackgroundCoverImg from '@/assets/images/background-cover.png';
import { StyledBackgroundCover } from './index.style';
import { useRouter } from 'next/router';
import { ROUTE } from '@/constants';
import useEventSubscription from '@/hooks/useEventSubscription';

const BackgroundCover = () => {
  useEventSubscription({ channel: 'default/channel' });
  const router = useRouter();
  return (
    <StyledBackgroundCover>
      <Image src={BackgroundCoverImg.src} className="image" />
      <Box className="text-container">
        <Button
          onClick={() => router.push(ROUTE.CREATE_COIN)}
          className="get-start-btn"
        >
          Get Started
        </Button>
      </Box>
    </StyledBackgroundCover>
  );
};

export default BackgroundCover;
