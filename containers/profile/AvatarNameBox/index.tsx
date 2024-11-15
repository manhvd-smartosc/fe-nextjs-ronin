import React from 'react';
import { Box, Image, useBreakpointValue } from '@chakra-ui/react';
import { LuExternalLink } from 'react-icons/lu';

import { StyledProfileAvatarNameBox } from './index.style';
import { shortenAddress } from '@/utils/address';

interface AvatarNameBoxProps {
  avatarUrl: string;
  name: string;
  followers: number;
  address: string;
}

const AvatarNameBox: React.FC<AvatarNameBoxProps> = ({
  avatarUrl,
  name,
  followers,
  address,
}) => {
  const currentSize = useBreakpointValue({
    base: 'small',
    md: 'medium',
    lg: 'large',
    xl: 'extra large',
  });
  return (
    <StyledProfileAvatarNameBox>
      <Box
        border={'2px solid #6B6B69'}
        borderRadius="full"
        backgroundColor={'#1A1A1A'}
      >
        <Image
          src={avatarUrl}
          borderRadius="full"
          boxSize={currentSize === 'small' ? '80px' : '120px'}
        />
      </Box>
      <Box className="name">{name}</Box>
      {/* <Box className="followers">
        <strong color="#BEBDBA">{followers}</strong> followers
      </Box> */}
      <Box className="address">
        <Box>
          {currentSize === 'small' ? shortenAddress(address, 6) : address}
        </Box>
        <Box
          color={'#05AAD7'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          gap={1}
          cursor={'pointer'}
          onClick={() =>
            window.open(
              `${process.env.NEXT_PUBLIC_EXPLORER_URL}/address/${address}`,
              '_blank',
            )
          }
        >
          <LuExternalLink />
          View on explorer
        </Box>
      </Box>
    </StyledProfileAvatarNameBox>
  );
};

export default AvatarNameBox;
