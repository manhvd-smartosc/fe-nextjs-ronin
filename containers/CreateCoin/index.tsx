import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import { FaChevronUp } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { useRouter } from 'next/router';
import UploadIcon from '@/assets/icons/upload.svg';
import WebsiteIcon from '@/assets/icons/website.svg';
import InstagramIcon from '@/assets/icons/instagram.svg';
import TelegramIcon from '@/assets/icons/telegram-light.svg';
import { StyledCreateCoinContainer } from './index.style';
import { ROUTE } from '@/constants';
import ConfirmPopup from './ConfirmPopup';

interface UploadedFile {
  file: File;
  preview: string;
}

const CreateCoinContainer = () => {
  const router = useRouter();
  const {
    isOpen: isOpenPopup,
    onOpen: onOpenPopup,
    onClose: onClosePopup,
  } = useDisclosure();
  const [showMoreOption, setShowMoreOption] = useState<boolean>(true);
  const [file, setFile] = useState<UploadedFile | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    setFile({
      file: uploadedFile,
      preview: URL.createObjectURL(uploadedFile),
    });
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

  const handleToggleMoreOption = () => {
    setShowMoreOption((prev) => !prev);
  };

  const handleOpenConfirmPopup = () => {
    onOpenPopup();
  };

  const handleChangeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile({
        file: uploadedFile,
        preview: URL.createObjectURL(uploadedFile),
      });
    }
  };

  useEffect(() => {
    return () => {
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  return (
    <StyledCreateCoinContainer>
      <Box className="content">
        <Box
          display="flex"
          gap={2}
          cursor="pointer"
          onClick={() => router.push(ROUTE.HOME)}
        >
          <IoArrowBackCircleOutline size="36px" color="#6B6B69" />
          <Text
            display="flex"
            alignItems="center"
            fontSize="20px"
            fontWeight="700"
          >
            Start a New Coin
          </Text>
        </Box>
        <Box className="create-coin-form-container">
          <Box display="flex" gap="60px">
            {/* upload file */}
            {file ? (
              <Box position="relative" width="270px" height="270px">
                <Image
                  src={file?.preview}
                  alt={file?.file.name}
                  objectFit="contain"
                  width="270px"
                  height="auto"
                />
                <Box position="absolute" top="5px" right="5px" cursor="pointer">
                  <IoIosCloseCircleOutline
                    size="25px"
                    color="#BEBDBA"
                    onClick={() => setFile(null)}
                  />
                </Box>
              </Box>
            ) : (
              <Box className="upload-container" {...getRootProps()}>
                <input {...getInputProps()} />
                <Image src={UploadIcon.src} />
                <Text className="drap-and-drop">Drag and drop file</Text>
                <Text className="max-size-text">
                  Max size - 5Mb. Jpg, Png, Gif
                </Text>
                <Input
                  type="file"
                  id="file-upload"
                  display="none"
                  onChange={handleChangeFileUpload}
                />
                <Button className="upload-btn" onClick={openFileBrowser}>
                  Upload file
                </Button>
              </Box>
            )}

            {/* form */}
            <Box className="form-container">
              <Box>
                <Text className="label">Name</Text>
                <Input className="input" placeholder="Name" />
              </Box>
              <Box>
                <Text className="label">Ticket</Text>
                <Input className="input" placeholder="Ticket" />
              </Box>
              <Box>
                <Text className="label">Description</Text>
                <Textarea
                  className="input"
                  placeholder="Description"
                  style={{ height: '122px' }}
                />
              </Box>
              <Box
                display="flex"
                gap={2}
                cursor="pointer"
                onClick={handleToggleMoreOption}
              >
                <Text>Show more option</Text>
                <Box display="flex" alignItems="center">
                  {showMoreOption ? <FaChevronUp /> : <FaChevronDown />}
                </Box>
              </Box>
              {showMoreOption && (
                <Box mt={4}>
                  <Box display="flex" flexDirection="column" gap={3}>
                    <Text className="label" style={{ marginBottom: '-5px' }}>
                      Links
                    </Text>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" height="100%">
                        <Image src={WebsiteIcon.src} alt="website-icon" />
                      </InputLeftElement>
                      <Input
                        className="input-group"
                        type="tel"
                        placeholder="Website"
                      />
                    </InputGroup>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" height="100%">
                        <Image src={TelegramIcon.src} alt="tele-icon" />
                      </InputLeftElement>
                      <Input
                        className="input-group"
                        type="tel"
                        placeholder="Verify Discord"
                      />
                    </InputGroup>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" height="100%">
                        <Image src={InstagramIcon.src} alt="insta-icon" />
                      </InputLeftElement>
                      <Input
                        className="input-group"
                        type="tel"
                        placeholder="Verify Instagram"
                      />
                    </InputGroup>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
          <Box display="flex" justifyContent="center" p={7}>
            <Button
              className="create-coin-btn"
              onClick={handleOpenConfirmPopup}
            >
              Create Coin
            </Button>
          </Box>
        </Box>
      </Box>
      <ConfirmPopup
        isOpen={isOpenPopup}
        onClose={onClosePopup}
        onCreateCoin={() => {}}
      />
    </StyledCreateCoinContainer>
  );
};

export default CreateCoinContainer;
