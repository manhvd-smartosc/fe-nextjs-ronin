import React, { useState } from 'react';

import {
  Box,
  Button,
  FormErrorMessage,
  Image,
  Input,
  Text,
} from '@chakra-ui/react';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import UploadIcon from '@/assets/icons/upload.svg';
import { useDropzone } from 'react-dropzone';
import { UseFormRegisterReturn } from 'react-hook-form';
import { StyledFileUploadContainer } from './index.style';

interface CustomFileUploadProps extends UseFormRegisterReturn {
  file: File | null;
  error: string | undefined;
  onUpload: (file: File) => void;
  onError(message: string): void;
}

const CustomFileUpload = React.forwardRef<
  HTMLDivElement,
  CustomFileUploadProps
>((props, ref) => {
  const [isUploadedImage, setIsUploadedImage] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);

  const onRemovePreview = () => {
    if (props.disabled) return;
    setPreview(null);
    setIsUploadedImage(false);
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (props.disabled) return;
    const uploadedFile = acceptedFiles[0];
    const fileSizeKB = uploadedFile.size / 1024;
    const fileType = uploadedFile.type;
    const validFileTypes = ['image/png', 'image/jpeg'];
    if (fileSizeKB > 2048) {
      setIsUploadedImage(true);
      setPreview(null);
      props.onError('Invalid image size');
      return;
    }
    if (!validFileTypes.includes(fileType)) {
      setIsUploadedImage(true);
      setPreview(null);
      props.onError('Invalid image type');
      return;
    }
    setPreview(URL.createObjectURL(uploadedFile));
    props.onUpload(uploadedFile);
  };

  const {
    getRootProps,
    getInputProps,
    open: openFileBrowser,
  } = useDropzone({
    onDrop,
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <>
      {props.file && preview ? (
        <Box
          position="relative"
          width="100%"
          height="270px"
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Image
            src={preview}
            alt={props.file.name}
            objectFit="contain"
            width="270px"
            height="auto"
            maxHeight="270px"
          />
          <Box position="absolute" top="5px" right="5px" cursor="pointer">
            <IoIosCloseCircleOutline
              size="25px"
              color="#BEBDBA"
              onClick={onRemovePreview}
            />
          </Box>
        </Box>
      ) : (
        <StyledFileUploadContainer>
          <Box
            className="upload-container"
            {...getRootProps()}
            opacity={props.disabled ? 0.5 : 1}
            style={{
              border: `${
                ((props.required && !isUploadedImage) || !!props.error) &&
                '2px dashed #E53E3E'
              } `,
            }}
          >
            <Input type="file" {...(getInputProps() as any)} />
            <Image src={UploadIcon.src} />
            <Text className="drap-and-drop">Drag and drop file</Text>
            <Text className="max-size-text">Max size: 2MB. JPG, JPEG, PNG</Text>
            <Input type="file" id="file-upload" display="none" />
            <Button
              className="upload-btn"
              onClick={openFileBrowser}
              cursor={props.disabled ? 'not-allowed' : 'pointer'}
            >
              Upload file
            </Button>
          </Box>
          {props.error && <FormErrorMessage>{props.error}</FormErrorMessage>}
        </StyledFileUploadContainer>
      )}
    </>
  );
});

export default CustomFileUpload;
