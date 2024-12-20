import React, { useEffect, useState } from 'react';
import { Box, Grid, Flex, Text, useBreakpointValue } from '@chakra-ui/react';
import Pagination from '@/components/Pagination';
import ReplyCard from '@/components/ReplyCard';
import apis from '@/apis';
import { DEFAULT_ITEMS_PER_PAGE } from '@/constants';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';

type User = {
  id: string;
  name: string;
  avatarUrl: string;
  address: string;
};

export type CommentType = {
  imageUrl: string;
  user: User;
  tokenId: string;
  userId: string;
  createdAt: string;
  text: string;
  id: string;
  token?: any;
};

const RepliesTab = () => {
  const [listComment, setListComment] = useState<Array<CommentType>>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession({
    required: false,
  });
  const params = useParams();
  const currentSize = useBreakpointValue({
    base: 'small',
    md: 'medium',
    lg: 'large',
    xl: 'extra large',
  });

  const getListComment = async () => {
    let createdBy = '';
    if (!createdBy && params?.id) createdBy = params.id?.[0] as string;
    if (!createdBy) createdBy = session?.user?.publicAddress;
    if (!createdBy) return;

    try {
      setLoading(true);
      const data = await apis.comment.fetchListComment({
        page: pagination.page,
        limit: DEFAULT_ITEMS_PER_PAGE,
        createdBy,
      });
      setPagination({ ...pagination, totalPages: data?.pagination.pagesCount });
      setListComment(data?.items);
      setLoading(false);
    } catch (error) {
      toast.error('Get list comment error');
    }
  };

  const handleChangePage = (page: number) => {
    setPagination({ ...pagination, page });
  };

  useEffect(() => {
    getListComment();
  }, [pagination.page, params?.id, session]);

  return (
    <Box p={4} borderRadius="lg">
      <Flex justify="space-between" align="center" mb={4}>
        <Text>Only you can view your profile</Text>
      </Flex>
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          lg: 'repeat(2, 1fr)',
          xl: 'repeat(3, 1fr)',
        }}
        gap={4}
      >
        {listComment.map((comment, index) => (
          <ReplyCard data={comment} />
        ))}
      </Grid>

      {!!pagination?.totalPages && (
        <Box
          display="flex"
          justifyContent={currentSize === 'small' ? 'center' : 'flex-end'}
        >
          <Pagination
            totalPages={pagination.totalPages}
            currentPage={pagination.page}
            onPageChange={handleChangePage}
          />
        </Box>
      )}
    </Box>
  );
};

export default RepliesTab;
