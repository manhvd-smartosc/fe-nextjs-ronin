import { Box, Button, Image } from '@chakra-ui/react';
import BackgroundCoverImg from '@/assets/images/background-cover.png';
import { StyledBackgroundCover } from './index.style';

const BackgroundCover = () => {
  return (
    <StyledBackgroundCover>
      <Image
        src={BackgroundCoverImg.src}
        width="100%"
        bgSize="cover"
        zIndex="1"
        mt="56px"
      />
      <Box className="text-container">
        <Button className="get-start-btn">Get Started</Button>
      </Box>
    </StyledBackgroundCover>
  );
};

export default BackgroundCover;
