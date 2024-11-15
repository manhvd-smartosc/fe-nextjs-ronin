import { Box, FormControl, Image, Input, Text } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import CustomModal from '@/components/CustomModal';
import { DEFAULT_MAX_SLIPPAGE } from '@/constants';
import { StyledSlippageContentModal } from './index.style';

export type Slippage = { maxSlippage: string; priorityFee: string };

interface SlippageModalProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onConfirm: (data: Slippage) => void;
}

const SlippageModal: React.FC<SlippageModalProps> = ({
  open,
  onOpen,
  onClose,
  onConfirm,
}) => {
  const { register, handleSubmit, setValue } = useForm<Slippage>();

  const onSubmit = async (data: Slippage) => {
    onConfirm({ maxSlippage: data.maxSlippage, priorityFee: data.priorityFee });
    onClose();
  };
  return (
    <CustomModal
      headTitle="Set max slippage"
      isOpen={open}
      onOpen={onOpen}
      onClose={handleSubmit(onSubmit)}
      closeButtonLabel="Close"
      bodyBg="#0A0A0A"
    >
      <StyledSlippageContentModal>
        <FormControl onSubmit={handleSubmit(onSubmit)}>
          <Text className="label">Set max slippage (%)</Text>
          <Box className="input-wrapper">
            <Input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              variant="unstyled"
              className="input-amount"
              placeholder="0.0"
              _placeholder={{
                color: '#8A8986',
              }}
              {...register('maxSlippage', { value: DEFAULT_MAX_SLIPPAGE })}
              onChange={(e) => {
                let value = e.target.value;
                value = value.replace(/[^0-9.]/g, '');
                const regex = /^\d*\.?\d*$/;
                if (regex.test(value)) {
                  setValue('maxSlippage', value);
                }
              }}
            />
          </Box>
          <Text className="disclamer">
            This is the maximum amount of slippage you are willing to accept
            when placing trades
          </Text>
        </FormControl>

        <FormControl>
          <Text className="label">Priority fee</Text>
          <Box className="input-wrapper">
            <Input
              variant="unstyled"
              className="input-amount"
              placeholder="0.0 (optional)"
              _placeholder={{
                color: '#8A8986',
              }}
              {...register('priorityFee')}
              onChange={(e) => {
                let value = e.target.value;
                value = value.replace(/[^0-9.]/g, '');
                const regex = /^\d*\.?\d*$/;
                if (regex.test(value)) {
                  setValue('priorityFee', value);
                }
              }}
            />

            <Box className="label-image">
              <Text>RON</Text>
              <Image
                w="24px"
                h="24px"
                borderRadius="50%"
                src="https://play-lh.googleusercontent.com/HGoGVDTQ5DuqZMy7w9kmuDlk_BNbVKDLCS7qNRE77puY4skfM1rptrDoifxIK5GJ06E"
                alt="ron"
              />
            </Box>
          </Box>
          <Text className="disclamer">
            A higher priority fee will make your transactions confirm faster.
            This is the transaction fee that you pay to the Ronin network on
            each trade
          </Text>
        </FormControl>
      </StyledSlippageContentModal>
    </CustomModal>
  );
};

export default SlippageModal;
