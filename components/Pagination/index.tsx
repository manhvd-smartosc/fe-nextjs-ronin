import { Button, Flex, Text } from '@chakra-ui/react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PageButton = ({
  page,
  currentPage,
  onPageChange,
}: {
  page: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => (
  <Button
    onClick={() => onPageChange(page)}
    isActive={page === currentPage}
    mx={1}
    variant={page === currentPage ? 'solid' : 'outline'}
    backgroundColor={page === currentPage ? '#AC65F3' : 'transparent'}
    colorScheme="#AC65F3"
    borderColor="#AC65F3"
    borderRadius={'6px'}
    fontSize={14}
    fontWeight={400}
    lineHeight={'21px'}
    w={'40px'}
    h={'40px'}
  >
    {page}
  </Button>
);

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 3;
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfMaxPagesToShow);
    let endPage = Math.min(totalPages, currentPage + halfMaxPagesToShow);

    if (currentPage <= halfMaxPagesToShow) {
      endPage = Math.min(totalPages, maxPagesToShow);
    }

    if (currentPage + halfMaxPagesToShow >= totalPages) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(
        <PageButton
          key={1}
          page={1}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />,
      );
      if (startPage > 2) {
        pages.push(
          <Text key="start-ellipsis" mx={1}>
            ...
          </Text>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PageButton
          key={i}
          page={i}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <Text key="end-ellipsis" mx={1}>
            ...
          </Text>,
        );
      }
      pages.push(
        <PageButton
          key={totalPages}
          page={totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />,
      );
    }

    return pages;
  };

  return (
    <Flex align="center" justify="end" mt={4}>
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        size="sm"
        colorScheme="#AC65F3"
        variant={'ghost'}
      >
        <FaChevronLeft />
      </Button>

      {renderPageNumbers()}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        size="sm"
        colorScheme="#AC65F3"
        variant={'ghost'}
      >
        <FaChevronRight />
      </Button>
    </Flex>
  );
};

export default Pagination;
