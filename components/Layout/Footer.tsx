import React from 'react';
import { THEME_COLOR } from '@/constants/color';
import TwitterIcon from '@/assets/icons/twitter.svg';
import TelegramIcon from '@/assets/icons/telegram.svg';
import { Box, Image, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { StyledFooter } from './index.style';

const Footer: React.FC = () => {
  const router = useRouter();

  return (
    <StyledFooter>
      <Box
        color="#BEBDBA"
        fontSize="14px"
        display="flex"
        gap={6}
        width={{ base: 'none', xl: '270px' }}
      >
        <Text cursor="pointer">Term and Condition</Text>
        <Text cursor="pointer">Privacy And Policy</Text>
      </Box>
      <Box>
        <Text>
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </Text>
      </Box>
      <Box
        display="flex"
        justifyContent="flex-end"
        width={{ base: 'none', xl: '270px' }}
      >
        <Link href={process.env.NEXT_PUBLIC_TWITTER_LINK || ''} target="_blank">
          <Image src={TwitterIcon.src} alt="twitter" objectFit="cover" />
        </Link>
        <Link
          href={process.env.NEXT_PUBLIC_TELEGRAM_LINK || ''}
          target="_blank"
        >
          <Image src={TelegramIcon.src} alt="twitter" objectFit="cover" />
        </Link>
      </Box>
    </StyledFooter>
  );
};

export default Footer;
