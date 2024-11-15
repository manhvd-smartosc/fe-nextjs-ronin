import React from 'react';
import TwitterIcon from '@/assets/icons/twitter.svg';
import TelegramIcon from '@/assets/icons/telegram.svg';
import { Box, Image, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { StyledFooter } from './index.style';

const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <Box
        color="#BEBDBA"
        fontSize="14px"
        display="flex"
        gap={6}
        width={{ base: 'none', xl: '270px' }}
      >
        <Link
          href={process.env.NEXT_PUBLIC_TERM_AND_CONDITION || ''}
          target="_blank"
        >
          Term and Condition
        </Link>
        <Link
          href={process.env.NEXT_PUBLIC_TERM_AND_CONDITION || ''}
          target="_blank"
        >
          Privacy Policy
        </Link>
      </Box>
      <Box>
        <Text>© Tama Mart 2024 copyright</Text>
      </Box>
      <Box
        display="flex"
        gap={1}
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
