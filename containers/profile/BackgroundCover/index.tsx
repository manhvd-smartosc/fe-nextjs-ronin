import { ReactNode } from 'react';
import { Image } from '@chakra-ui/react';
import BackgroundCoverImg from '@/assets/images/profileBackground.png';
import { StyledBackgroundCover } from './index.style';

const BackgroundCover = ({ children }: { children?: ReactNode | null }) => {
  return (
    <StyledBackgroundCover>
      <Image
        src={BackgroundCoverImg.src}
        width="100%"
        bgSize="cover"
        zIndex="1"
        mt="56px"
      />
      {children}
    </StyledBackgroundCover>
  );
};

export default BackgroundCover;
