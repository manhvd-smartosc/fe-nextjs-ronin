import { Button, Flex } from '@chakra-ui/react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => onPageChange(i)}
          isActive={i === currentPage}
          mx={1}
          variant={i === currentPage ? 'solid' : 'outline'}
          backgroundColor={i === currentPage ? '#AC65F3' : 'transparent'}
          colorScheme="#AC65F3"
          borderColor="#AC65F3"
          borderRadius={'6px'}
          fontSize={14}
          fontWeight={400}
          lineHeight={'21px'}
          w={'40px'}
          h={'40px'}
        >
          {i}
        </Button>,
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
