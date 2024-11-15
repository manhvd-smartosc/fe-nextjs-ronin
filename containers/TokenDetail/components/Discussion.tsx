'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import apis from '@/apis';

import { User } from '@prisma/client';
import { API_URL, DEFAULT_ITEMS_PER_PAGE } from '@/constants';
import { CommentType } from '@/containers/profile/TabSection/RepliesTab';
import { FaArrowDownLong, FaArrowUpLong } from 'react-icons/fa6';
import { PaginatedResponse, Pagination } from '@/types';

import { Box, Spinner, Text } from '@chakra-ui/react';
import DiscussionThread from './DiscussionThread';
import CreateCommentPopup from './CreateCommentPopup';
import CustomButton from '@/components/CustomButton';
import { StyledDiscussionSection } from '../index.style';
import { useSession } from 'next-auth/react';
import { AppSyncEventType, socketEmitter } from '@/lib-client/EventEmitter';

enum ScrollDirection {
  UP = 0,
  DOWN = 1,
}

const DiscussionSection = ({
  id,
  startRef,
  isMobile = false,
  tokenAddress,
}: {
  id: string;
  startRef: React.RefObject<HTMLDivElement>;
  isMobile?: boolean;
  tokenAddress: string;
}) => {
  const { data: session } = useSession({
    required: false,
  });
  const endRef = useRef<HTMLDivElement>(null);
  const { ref: loadRef, inView } = useInView({ threshold: 0 });
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<CommentType[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    pagesCount: 0,
    currentPage: 0,
    perPage: 0,
    from: 0,
    to: 0,
    hasMore: true,
  });

  const scrollToRef = async (
    ref: React.RefObject<HTMLDivElement>,
    direction: ScrollDirection,
  ) => {
    if (direction === ScrollDirection.DOWN && pagination.hasMore) {
      await getListComment(true);
    }
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchProfileDetail = async () => {
    if (!session || !session.user.publicAddress) return;
    const response = await fetch(
      `${API_URL.PROFILE}/${session.user.publicAddress}`,
    );

    const data = await response.json();
    setUser(data);
  };

  const getListComment = async (fetchAll = false) => {
    try {
      setLoading(true);
      const searchParams = {
        page: fetchAll ? 1 : pagination.currentPage + 1,
        limit: fetchAll
          ? Math.min(pagination.total, 100)
          : DEFAULT_ITEMS_PER_PAGE,
        tokenId: id,
      };
      const data = (await apis.comment.fetchListComment(
        searchParams,
      )) as PaginatedResponse<CommentType>;
      if (!data) {
        console.error('Get list comment error');
        setError(true);
        return;
      }
      setPagination(data.pagination);
      fetchAll
        ? setData(data.items)
        : setData((prev) => prev.concat(data.items));
    } catch (error) {
      console.error('Get list comment error');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const onCommentSuccess = (comment: CommentType) => {
    if (!user) return;
    // setData((prev) => {
    //   return [{ ...comment, user }, ...prev];
    // });
  };

  useEffect(() => {
    if (inView && pagination.hasMore) {
      getListComment();
    }
  }, [inView]);

  useEffect(() => {
    if (!user) {
      fetchProfileDetail();
    }
  }, [session]);

  if (error) {
    return (
      <Box
        width={'100%'}
        display={'flex'}
        flexDir={'column'}
        alignItems={'center'}
        paddingTop={'20%'}
      >
        <Text fontSize={'2xl'} fontWeight={700} textAlign={'center'}>
          An error occured when fetching the comments
        </Text>
        <Text fontSize={'lg'} textAlign={'center'}>
          Please try again later
        </Text>
      </Box>
    );
  }
  const timestampToUTC = (timestamp: string) => {
    return new Date(+timestamp).toISOString();
  };
  // watching events
  useEffect(() => {
    const handleComment = (data: any) => {
      setData((prev) => {
        const thisComment = {
          id: Math.random().toString(),
          text: data?.text,
          createdAt: timestampToUTC(data?.timestamp),
          userId: data?.senderAddress?.id,
          tokenId: data?.token?.id,
          imageUrl: data?.imageUrl,
          user: {
            id: data?.senderAddress?.id,
            address: data?.senderAddress?.address,
            avatarUrl: data?.senderAddress?.avatarUrl,
            name: data?.senderAddress?.name,
          },
        };
        const isExist = (prev || []).find((item) => {
          return (
            item.userId === thisComment.userId &&
            item.createdAt === thisComment.createdAt &&
            item.text === thisComment.text &&
            item.imageUrl === thisComment.imageUrl
          );
        });
        if (isExist) return prev;
        return [thisComment, ...prev];
      });
    };

    if (!loading && tokenAddress && socketEmitter) {
      // console.log('regis event', `${tokenAddress?.toLowerCase()}_${AppSyncEventType.TRADE}`);
      socketEmitter.on(
        `${tokenAddress?.toLowerCase()}_${AppSyncEventType.COMMENT}`,
        handleComment,
      );
    }
    return () => {
      if (socketEmitter) {
        // console.log('off event', `${tokenAddress?.toLowerCase()}_${AppSyncEventType.TRADE}`);
        socketEmitter.off(
          `${tokenAddress?.toLowerCase()}_${AppSyncEventType.COMMENT}`,
          handleComment,
        );
      }
    };
  }, [loading]);

  if (data?.length === 0 && !loading) {
    return (
      <Box
        width={'100%'}
        display={'flex'}
        flexDir={'column'}
        alignItems={'center'}
        paddingTop={'20'}
        ref={loadRef}
      >
        <Text fontSize={'2xl'} fontWeight={700} textAlign={'center'}>
          There isn't no comment yet
        </Text>
        {session && (
          <Text fontSize={'lg'} marginBottom={'8px'} textAlign={'center'}>
            Be the first one to comment
          </Text>
        )}
        <CreateCommentPopup tokenId={id} onCommentSuccess={onCommentSuccess} />
      </Box>
    );
  }

  return (
    <StyledDiscussionSection>
      <Box width={'100%'} display={'flex'} justifyContent={'flex-end'}>
        {isMobile ? (
          <Box
            width={'100%'}
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Text fontWeight={700} fontSize={'24px'} lineHeight={'22px'}>
              Discussion
            </Text>
            <Box display={'flex'} gap={'16px'}>
              <CreateCommentPopup
                tokenId={id}
                onCommentSuccess={onCommentSuccess}
              />
              <CustomButton
                variant="neutral"
                size="icon"
                onClick={async () =>
                  await scrollToRef(endRef, ScrollDirection.DOWN)
                }
                display={
                  !data || data.length < DEFAULT_ITEMS_PER_PAGE
                    ? 'none'
                    : 'flex'
                }
                justifyContent={'center'}
              >
                <FaArrowDownLong />
              </CustomButton>
            </Box>
          </Box>
        ) : (
          <Box display={'flex'} gap={'16px'}>
            <CreateCommentPopup
              tokenId={id}
              onCommentSuccess={onCommentSuccess}
            />
            <CustomButton
              variant="neutral"
              size="icon"
              onClick={async () =>
                await scrollToRef(endRef, ScrollDirection.DOWN)
              }
              display={
                !data || data.length < DEFAULT_ITEMS_PER_PAGE ? 'none' : 'flex'
              }
            >
              <FaArrowDownLong />
            </CustomButton>
          </Box>
        )}
      </Box>
      <Box display={'flex'} flexDirection={'column'} gap={'24px'}>
        {data?.map((item: CommentType, index) => (
          // Load new data if scroll to the 3rd last item
          <div key={item.id} ref={index === data.length - 3 ? loadRef : null}>
            <DiscussionThread data={item} />
          </div>
        ))}

        {loading && (
          <Box display={'flex'} justifyContent={'center'}>
            <Spinner />
          </Box>
        )}
      </Box>
      <Box
        ref={endRef}
        width={'100%'}
        display={
          !data || data.length < DEFAULT_ITEMS_PER_PAGE ? 'none' : 'flex'
        }
        justifyContent={'space-between'}
      >
        <CreateCommentPopup tokenId={id} onCommentSuccess={onCommentSuccess} />
        <CustomButton
          variant="neutral"
          size="icon"
          onClick={async () => await scrollToRef(startRef, ScrollDirection.UP)}
        >
          <FaArrowUpLong />
        </CustomButton>
      </Box>
    </StyledDiscussionSection>
  );
};

export default DiscussionSection;
