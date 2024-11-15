import React, { useState } from 'react';

import { CommentType } from '@/containers/profile/TabSection/RepliesTab';

import { Box, Text } from '@chakra-ui/react';
import { StyledDiscussionThread } from '../index.style';
import { formatTimestring } from '@/utils';
import avatar from '@/assets/images/pepe.png';

interface DiscussionThreadProps {
  data: CommentType;
}

const DiscussionThread = ({ data }: DiscussionThreadProps) => {
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  return (
    <StyledDiscussionThread>
      <Box display={'flex'} gap={'12px'}>
        <Box borderRadius={'16px'}>
          <img
            src={data.user.avatarUrl || avatar.src}
            alt="avatar"
            width={40}
            height={40}
          />
        </Box>
        <Box display={'flex'} flexDir={'column'}>
          <Text fontSize={16} fontWeight={700} lineHeight={'22px'}>
            {data.user.name || `@${data.user.address.substring(2, 8)}`}
          </Text>
          <Text
            fontSize={14}
            fontWeight={400}
            lineHeight={'20px'}
            color={'#8a8986'}
          >
            {formatTimestring(data.createdAt)}
          </Text>
        </Box>
      </Box>
      <Box
        display={'flex'}
        flexDirection={isImageZoomed ? 'column' : 'row'}
        alignItems={isImageZoomed ? 'center' : 'flex-start'}
        gap={'16px'}
      >
        {data.imageUrl && (
          <Box
            borderRadius={'16px'}
            cursor={'pointer'}
            style={{
              maxHeight: isImageZoomed ? '256px' : '64px',
              maxWidth: isImageZoomed ? '256px' : '64px',
              overflow: 'hidden',
            }}
            onClick={() => setIsImageZoomed((prev) => !prev)}
          >
            <img
              src={data.imageUrl}
              alt="image"
              width={isImageZoomed ? 256 : 64}
              height={isImageZoomed ? 256 : 64}
            />
          </Box>
        )}
        <Text
          fontSize={'14px'}
          lineHeight={'20px'}
          fontWeight={400}
          width={'100%'}
        >
          {data.text}
        </Text>
      </Box>
    </StyledDiscussionThread>
  );
};

export default DiscussionThread;
