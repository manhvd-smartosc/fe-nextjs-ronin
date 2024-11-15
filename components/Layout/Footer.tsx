import React from 'react';
import { THEME_COLOR } from '@/constants/color';
import TwitterIcon from '@/assets/icons/twitter.svg';
import TelegramIcon from '@/assets/icons/telegram.svg';
import { Box, Image, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Footer: React.FC = () => {
  const router = useRouter();

  return (
    <Box style={styles.footer}>
      <Box color="#BEBDBA" fontSize="14px" display="flex" gap={6}>
        <Text cursor="pointer">Term and Condition</Text>
        <Text cursor="pointer">Privacy And Policy</Text>
      </Box>
      <Box>
        <Text>
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </Text>
      </Box>
      <Box display="flex" justifyContent="flex-end" gap={2}>
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
    </Box>
  );
};

const styles = {
  footer: {
    backgroundColor: THEME_COLOR.headerBg,
    color: THEME_COLOR.text,
    textAlign: 'center' as const,
    padding: '1.5rem 2rem',
    marginTop: 'auto',
    minHeight: '56px',
    fontSize: '14px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
};

export default Footer;
