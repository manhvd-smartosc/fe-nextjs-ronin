import React, { useEffect, useState } from 'react';
import { Box, Grid, Flex, Text, Spinner } from '@chakra-ui/react';
import Pagination from '@/components/Pagination';
import ReplyCard from '@/components/ReplyCard';
import apis from '@/apis';
import { DEFAULT_ITEMS_PER_PAGE } from '@/constants';
import { toast } from 'react-toastify';

type User = {
  id: string;
  name: string;
  avatarUrl: string;
};
export type CommentType = {
  imageUrl: string;
  user: User;
  createdAt: string;
  text: string;
  id: string;
};

const RepliesTab = () => {
  const [listComment, setListComment] = useState<Array<CommentType>>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const getListComment = async () => {
    try {
      setLoading(true);
      const data = await apis.comment.fetchListComment({
        page: pagination.page,
        limit: DEFAULT_ITEMS_PER_PAGE,
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
  }, [pagination.page]);

  return (
    <Box p={4} borderRadius="lg">
      <Flex justify="space-between" align="center" mb={4}>
        <Text>Only you can view your profile</Text>
      </Flex>
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        gap={4}
      >
        {listComment.map((comment, index) => (
          <ReplyCard data={comment} />
        ))}
      </Grid>

      {!!pagination?.totalPages && (
        <Pagination
          totalPages={pagination.totalPages}
          currentPage={pagination.page}
          onPageChange={handleChangePage}
        />
      )}
    </Box>
  );
};

export default RepliesTab;
