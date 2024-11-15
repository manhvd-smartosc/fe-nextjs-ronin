import { Box, Grid } from '@chakra-ui/react';

import BackgroundContent from '@/assets/images/background-content.png';
import ElonMusk from '@/assets/images/elon-musk.png';
import BackgroundCover from './BackgroundCover';
import TokenContainer from './TokenContainer';
import { StyledHomeContainer } from './index.style';
import CustomSelect from '@/components/CustomSelect/index';
import { SORT_OPTIONS } from '@/constants';
import CustomSearchInput from '@/components/CustomSearchInput';

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
    <StyledHomeContainer>
      <BackgroundCover />
      <Box bgColor="#1A1A1A" gap="24px" borderRadius="40px" margin="0 auto">
        <Box position="relative">
          <Box
            position="relative"
            top="0"
            w="100%"
            padding={{ base: '10px', sm: '32px 80px' }}
            bgImage={`url(${BackgroundContent.src})`}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              marginBottom={30}
              gap={6}
              flexDirection={{ base: 'column', md: 'row' }}
            >
              <CustomSelect
                options={SORT_OPTIONS}
                onChange={(value) => console.log(value)}
              />
              <CustomSearchInput
                onSearch={(value) => {
                  console.log(value);
                }}
              />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Grid
                templateColumns={{
                  base: 'repeat(1, 1fr)',
                  lg: 'repeat(2, 1fr)',
                  xl: 'repeat(3, 1fr)',
                }}
                gap={6}
              >
                {cards.map((card, index) => (
                  <TokenContainer key={index} />
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledHomeContainer>
  );
};

export default Home;
