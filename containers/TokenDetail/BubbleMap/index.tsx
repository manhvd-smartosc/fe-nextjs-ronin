import CustomModal from '@/components/CustomModal';
import { Box, Button, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import Bubbles from './Bubbles';

const BubbleMap = ({ holder }: { holder: any[] }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const data = holder.map((item) => ({
    id: item.holderAddress.address,
    proportion: item.percent,
  }));

  return (
    <>
      <CustomModal
        headTitle="Bubble Map"
        isOpen={isOpen}
        onClose={onClose}
        modalContentStyle={{
          width: 'auto',
          maxWidth: '100%',
        }}
      >
        <Box>
          <Bubbles coins={data} />
        </Box>
      </CustomModal>
      <Button
        className="generate-bubble-map-button"
        variant="unstyled"
        onClick={onOpen}
        fontWeight={400}
      >
        Generate bubble map
      </Button>
    </>
  );
};

export default BubbleMap;
