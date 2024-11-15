import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Textarea,
} from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import CustomModal from '@/components/CustomModal';
import { StyledAddCommentModal } from './index.style';

export type Comment = { comment: string };

interface AddCommentModalProps {
  open: boolean;
  previewMsg: React.ReactNode;
  onOpen: () => void;
  onClose: () => void;
  onConfirm: (data: Comment) => void;
}

const AddCommentModal: React.FC<AddCommentModalProps> = ({
  open,
  onOpen,
  onClose,
  onConfirm,
  previewMsg,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Comment>();

  const onSubmit = async (data: Comment) => {
    setValue('comment', '');
    onConfirm({ comment: data.comment });
    onClose();
  };

  return (
    <CustomModal
      headTitle="Add comment"
      isOpen={open}
      onOpen={onOpen}
      onClose={onClose}
      onConfirm={handleSubmit(onSubmit)}
      closeButtonLabel="Close"
      cfButtonLabel="Place trade"
      bodyBg='#0A0A0A'
    >
      <StyledAddCommentModal>
        <FormControl
          isInvalid={!!errors?.comment}
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormLabel className="label">
            Add a comment
            <Text color="red">*</Text>
          </FormLabel>
          <Box>
            <Textarea
              id="content"
              placeholder="Enter comment..."
              className="input"
              variant={'unstyled'}
              resize={'none'}
              {...register('comment', { required: 'This is a required field' })}
              style={{
                border: `${
                  !!errors?.comment ? '2px solid #E53E3E' : '1px solid #6b6b69'
                } `,
              }}
            />
            <FormErrorMessage>{errors.comment?.message}</FormErrorMessage>
          </Box>
          {previewMsg}
        </FormControl>
      </StyledAddCommentModal>
    </CustomModal>
  );
};

export default AddCommentModal;
