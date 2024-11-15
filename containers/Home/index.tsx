import { Box, Grid } from '@chakra-ui/react';

import BackgroundContent from '@/assets/images/background-content.png';
import ElonMusk from '@/assets/images/elon-musk.png';
import BackgroundCover from './BackgroundCover';
import TokenContainer from './TokenContainer';
import { StyledHomePage } from './index.style';

const Home = () => {
  const cards = Array(12).fill({
    title: 'Pnut Mom Confirmed',
    marketCap: '43.87k',
    description:
      "The clock's ticking. Tired of scams and rugs? Real FOMO has arrived with #FOMOki.",
    replies: 33,
    time: '1h ago',
    imageUrl: ElonMusk.src,
  });

  return (
    <StyledHomePage>
      <BackgroundCover />
      <Box bgColor="#1A1A1A" gap="24px" borderRadius="40px" margin="0 auto">
        <Box position="relative">
          <Box
            position="relative"
            top="0"
            w="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            padding="32px 80px"
            bgImage={`url(${BackgroundContent.src})`}
          >
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
              {cards.map((card, index) => (
                <TokenContainer key={index} />
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    </StyledHomePage>
  );
};

export default Home;
