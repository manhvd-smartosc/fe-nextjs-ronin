import React from 'react';
import { Box, Image, Link, Text } from '@chakra-ui/react';

import WebIcon from '@/assets/icons/globe.svg';
import TwitterIcon from '@/assets/icons/twitter.svg';
import TelegramIcon from '@/assets/icons/telegram.svg';
import { Token } from '@prisma/client';

const SocialLink: React.FC<{ url: string; icon: string; name: string }> = ({
  name,
  url,
  icon,
}) => {
  return (
    <Link
      className="social-link"
      aria-label={name}
      variant="unstyled"
      href={url || undefined}
      isExternal
      onClick={(e) => !url && e.preventDefault()}
      pointerEvents={url ? 'auto' : 'none'}
      opacity={url ? 1 : 0.5}
    >
      <Image src={icon} boxSize="24px" cursor={url ? 'pointer' : 'none'} />
    </Link>
  );
};

interface TokenInfoProps {
  token: Token;
}

const TokenInfo: React.FC<TokenInfoProps> = ({ token }) => {
  return (
    <Box className="ticker-info">
      <Box display="flex" justifyContent="center" alignItems="center">
        <Image
          height="200px"
          width="auto"
          src={token?.imageUrl}
          alt="card-info"
        />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        justifyContent="center"
        alignItems="center"
      >
        <Text
          fontWeight={700}
          fontSize={20}
          lineHeight={'28px'}
          color="#FAF7ED"
        >
          {token?.name}
        </Text>
        <Text
          fontWeight={500}
          fontSize={16}
          lineHeight={'22px'}
          color="#BEBDBA"
        >
          {`[ticker: ${token?.ticker}]`}
        </Text>
        <Text
          fontWeight={400}
          fontSize={12}
          lineHeight={'16px'}
          color="#8A8986"
        >
          {token?.description}
        </Text>
      </Box>
      <Box>
        <Text
          fontWeight={500}
          fontSize={14}
          lineHeight={'20px'}
          color="#05AAD7"
        >
          Social Links:
        </Text>
        <Box
          mt={2}
          display="flex"
          gap={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <SocialLink
            name="website"
            url={token?.websiteUrl || ''}
            icon={WebIcon.src}
          />
          <SocialLink
            name="twitter"
            url={token?.twitterUrl || ''}
            icon={TwitterIcon.src}
          />
          <SocialLink
            name="telegram"
            url={token?.telegramUrl || ''}
            icon={TelegramIcon.src}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TokenInfo;
