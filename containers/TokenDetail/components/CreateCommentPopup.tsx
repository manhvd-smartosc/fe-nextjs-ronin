import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import apis from '@/apis';

import { sanitizeString } from '@/utils/string';
import { CommentType } from '@/containers/profile/TabSection/RepliesTab';

import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import CustomModal from '@/components/CustomModal';
import CustomButton from '@/components/CustomButton';
import CustomFileUpload from '@/components/CustomFileUpload';
import { StyledCommentPopup } from '../index.style';
import { useSession } from 'next-auth/react';

type Comment = { content: string; file: File | null };

interface CreateCommentPopupProps {
  tokenId: string;
  onCommentSuccess: (comment: CommentType) => void;
}

const CreateCommentPopup = ({
  tokenId,
  onCommentSuccess,
}: CreateCommentPopupProps) => {
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession({
    required: false,
  });
  const {
    handleSubmit,
    register,
    watch,
    getValues,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors, isValid },
  } = useForm<Comment>({
    defaultValues: { content: '', file: null },
  });

  const onCloseModal = () => {
    if (loading) return;
    onClose();
  };

  const onUploadImage = (file: File) => {
    setValue('file', file);
    clearErrors('file');
  };
  const onUploadImageError = (message: string) => setError('file', { message });

  const onSubmit = async () => {
    setLoading(true);
    const { content, file } = getValues();
    const result = await apis.comment.postComment({
      tokenId,
      content: sanitizeString(content),
      file,
    });
    onCommentSuccess(result);
    setLoading(false);
    reset();
    onCloseModal();
    return result;
  };

  return (
    <>
      <CustomModal
        headTitle="Post a reply"
        isOpen={isOpen}
        onClose={onCloseModal}
        bodyBg="#0A0A0A"
      >
        <StyledCommentPopup>
          <FormControl isInvalid={!!errors.content}>
            <FormLabel htmlFor="content" className="label required">
              Add a comment
            </FormLabel>
            <Box>
              <Textarea
                id="content"
                placeholder="Enter comment..."
                className="input-wrapper"
                variant={'unstyled'}
                {...register('content', {
                  required: 'This is a required field',
                  validate: (value) =>
                    value.trim() !== '' || 'This is a required field',
                })}
                _placeholder={{
                  color: '#8A8986',
                }}
                resize={'none'}
                disabled={loading}
                style={{ border: errors.content && '2px solid #e53e3e' }}
              />
              <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
            </Box>
          </FormControl>
          <FormControl isInvalid={!!errors.file}>
            <CustomFileUpload
              file={watch('file')}
              error={errors.file?.message}
              onUpload={onUploadImage}
              onError={onUploadImageError}
              {...register('file')}
              disabled={loading}
            />
            <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
          </FormControl>
        </StyledCommentPopup>
        <CustomButton
          width={'100%'}
          marginTop={'24px'}
          onClick={handleSubmit(onSubmit)}
          disabled={!!errors.content || loading}
        >
          {loading ? 'Posting...' : 'Post reply'}
        </CustomButton>
      </CustomModal>
      {session && (
        <CustomButton variant="neutral" size="md" onClick={onOpen}>
          Post a reply
        </CustomButton>
      )}
    </>
  );
};

export default CreateCommentPopup;
