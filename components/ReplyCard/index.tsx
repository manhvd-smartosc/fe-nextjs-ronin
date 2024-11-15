import React from 'react';
import { Box, Image, Text, Link } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import moment from 'moment';
import { CommentType } from '@/containers/profile/TabSection/RepliesTab';

interface ReplyCardProps {
  data: CommentType;
}

const ReplyCard: React.FC<ReplyCardProps> = ({ data }) => {
  return (
    <Box
      key={data.id}
      p={4}
      bg="#FFFFFF0A"
      border="2px solid"
      borderColor="#E9DFF233"
      borderRadius="16px"
      backdropFilter={'blur(40px)'}
      boxShadow="0px -2px 1px 1px #AC65F3 inset, 0px -2px 3px 0px #FFFFFF inset"
    >
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'start'}
      >
        <Box
          display={'flex'}
          justifyContent={'flex-start'}
          alignItems={'center'}
        >
          <Image
            src={data.user.avatarUrl}
            alt="avatar"
            boxSize="42px"
            borderRadius="full"
            bg="white"
            mr={3}
          />
          <Box>
            <Text
              fontWeight="700"
              color="#FAF7ED"
              fontSize="16px"
              lineHeight="22px"
            >
              {data.user.name}
            </Text>
            <Text
              fontWeight="400"
              color="#8A8986"
              fontSize="14px"
              lineHeight="20px"
            >
              {moment(data.createdAt).format('YYYY/MM/DD hh:mm')}
            </Text>
          </Box>
        </Box>
        <Box>
          <Text
            fontSize="14"
            fontWeight={400}
            lineHeight={'20px'}
            color="#8A8986"
          >
            #{data.id}
          </Text>
        </Box>
      </Box>
      <Box mt={3}>
        <Text
          fontSize="14"
          fontWeight={400}
          lineHeight={'21px'}
          color="#BEBDBA"
        >
          {data.text}
        </Text>
      </Box>
      <Box mt={4} borderTop="1px solid" borderColor="#E9DFF233" pt={2}>
        <Link
          href="#"
          isExternal
          fontSize="14"
          fontWeight={500}
          lineHeight={'20px'}
          color="#FAF7ED"
          _hover={{ color: 'purple.400' }}
        >
          View Thread
          <ExternalLinkIcon
            color={'#FAF7ED'}
            _hover={{ color: 'purple.400' }}
            mx="2px"
          />
        </Link>
      </Box>
    </Box>
  );
};

export default ReplyCard;
