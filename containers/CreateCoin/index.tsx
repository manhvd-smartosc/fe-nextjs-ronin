import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import UploadIcon from '@/assets/icons/upload.svg';
import WebsiteIcon from '@/assets/icons/website.svg';
import InstagramIcon from '@/assets/icons/instagram.svg';
import TelegramIcon from '@/assets/icons/telegram-light.svg';
import { ROUTE } from '@/constants';
import {
  createTokenOnContract,
  validateRONBalance,
} from '@/contract/utils/contract';
import uploadFile from '@/apis/upload';
import ConfirmPopup from './ConfirmPopup';
import AlertPopup from './AlertPopup';
import { StyledCreateCoinContainer } from './index.style';

interface UploadedFile {
  file: File;
  preview: string;
}

type FormData = {
  name: string;
  ticker: string;
  description: string;
  webUrl: string;
  teleUrl: string;
  instaUrl: string;
  initAmount: string;
  imageUrl: string;
};

const CreateCoinContainer = () => {
  const router = useRouter();
  const {
    isOpen: isOpenPopup,
    onOpen: onOpenPopup,
    onClose: onClosePopup,
  } = useDisclosure();
  const [showMoreOption, setShowMoreOption] = useState<boolean>(false);
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const { data: session } = useSession({
    required: false,
  });
  const [isUploadedImage, setIsUploadedImage] = useState<boolean | null>(null);

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

  const handleChangeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setIsUploadedImage(true);
      setFile({
        file: uploadedFile,
        preview: URL.createObjectURL(uploadedFile),
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!session) {
      toast.warning('Please login to create a coin');
      return;
    }
    onOpenPopup();
  };

  const handleCreateCoin = async () => {
    const { name, ticker, initAmount, description, webUrl, instaUrl, teleUrl } =
      watch();
    let linkFile = '';
    setLoading(true);
    try {
      if (file?.file) {
        const response = await uploadFile(file.file);
        linkFile = response?.imageUrl;
      }

      const tokenInfo = {
        name,
        symbol: ticker,
        initAmountIn: initAmount || '0',
        description,
        extended: `${webUrl},${instaUrl},${teleUrl}`,
        tokenUrlImage: linkFile,
      };

      const isValidRonBalance = await validateRONBalance(
        tokenInfo,
        session?.user.publicAddress,
      );
      if (!isValidRonBalance) {
        toast.error('Insufficient account balance');
        return;
      }

      const hash = await createTokenOnContract(tokenInfo);

      if (hash) {
        toast.success(
          <AlertPopup
            title="Created new coin!"
            description="Click to view it"
            btnName="View"
            onClick={() => handleClickViewTransaction(hash)}
          />,
          {
            icon: false,
            autoClose: false,
          },
        );
      } else {
        toast.error('Token creation failed');
      }
      onClosePopup();
    } catch (error) {
      toast.error('Token creation failed');
    } finally {
      setLoading(false);
      setFile(null);
      setIsUploadedImage(null);
      reset({
        name: '',
        ticker: '',
        description: '',
        webUrl: '',
        teleUrl: '',
        instaUrl: '',
        initAmount: '',
      });
    }
  };

  const handleClickViewTransaction = (hash: string) => {
    window.open(
      `${process.env.NEXT_PUBLIC_TESNET_EXPORER}/tx/${hash}`,
      '_blank',
    );
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="create-coin-form-container">
            <Box
              display="flex"
              gap={{ base: '15px', md: '60px' }}
              flexDirection={{ base: 'column', md: 'row' }}
            >
              {/* upload file */}
              {file ? (
                <Box
                  position="relative"
                  width="270px"
                  height="270px"
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <Image
                    src={file?.preview}
                    alt={file?.file.name}
                    objectFit="contain"
                    width="270px"
                    height="auto"
                    maxHeight="270px"
                  />
                  <Box
                    position="absolute"
                    top="5px"
                    right="5px"
                    cursor="pointer"
                  >
                    <IoIosCloseCircleOutline
                      size="25px"
                      color="#BEBDBA"
                      onClick={() => {
                        setFile(null);
                        setIsUploadedImage(false);
                      }}
                    />
                  </Box>
                </Box>
              ) : (
                <Box display="flex" flexDirection="column">
                  <Box
                    className="upload-container"
                    {...getRootProps()}
                    style={{
                      border: `${
                        isUploadedImage === false && '2px dashed #E53E3E'
                      } `,
                    }}
                  >
                    <Input type="file" {...(getInputProps() as any)} />
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
                  {isUploadedImage === false && (
                    <Text fontSize="14px" pt={2} color="#E53E3E">
                      Image is required
                    </Text>
                  )}
                </Box>
              )}
              {/* form */}
              <Box className="form-container">
                <FormControl isInvalid={!!errors.name} mb="4">
                  <FormLabel className="label" htmlFor="name">
                    Name
                  </FormLabel>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    className="input"
                    {...register('name', { required: 'Name is required' })}
                  />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.ticker} mb="4">
                  <FormLabel className="label" htmlFor="ticker">
                    Ticker
                  </FormLabel>
                  <Input
                    id="ticker"
                    placeholder="Enter your ticker"
                    className="input"
                    {...register('ticker', { required: 'Ticker is required' })}
                  />
                  <FormErrorMessage>{errors.ticker?.message}</FormErrorMessage>
                </FormControl>

                <FormControl mb="4">
                  <FormLabel className="label" htmlFor="description">
                    Description
                  </FormLabel>
                  <Textarea
                    {...register('description')}
                    className="input"
                    placeholder="Enter your description"
                    style={{ height: '122px' }}
                  />
                </FormControl>
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
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Text className="label">Links</Text>
                      <FormControl mb="4">
                        <InputGroup>
                          <InputLeftElement pointerEvents="none" height="100%">
                            <Image src={WebsiteIcon.src} alt="website-icon" />
                          </InputLeftElement>
                          <Input
                            {...register('webUrl')}
                            className="input-group"
                            type="tel"
                            placeholder="Website"
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl mb="4">
                        <InputGroup>
                          <InputLeftElement pointerEvents="none" height="100%">
                            <Image src={TelegramIcon.src} alt="tele-icon" />
                          </InputLeftElement>
                          <Input
                            {...register('teleUrl')}
                            className="input-group"
                            type="tel"
                            placeholder="Verify Discord"
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl mb="4">
                        <InputGroup>
                          <InputLeftElement pointerEvents="none" height="100%">
                            <Image src={InstagramIcon.src} alt="insta-icon" />
                          </InputLeftElement>
                          <Input
                            {...register('instaUrl')}
                            className="input-group"
                            type="tel"
                            placeholder="Verify Instagram"
                          />
                        </InputGroup>
                      </FormControl>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              p={7}
              onClick={() => {
                if (!file) {
                  setIsUploadedImage(false);
                }
              }}
            >
              <Button type="submit" className="create-coin-btn">
                Create Coin
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
      <ConfirmPopup
        loading={loading}
        ticker={watch('ticker')}
        isOpen={isOpenPopup}
        onClose={onClosePopup}
        onChangeInitAmount={(value) => setValue('initAmount', value)}
        onCreateCoin={handleCreateCoin}
      />
    </StyledCreateCoinContainer>
  );
};

export default CreateCoinContainer;
