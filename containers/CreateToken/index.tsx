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
import { useAccount } from 'wagmi';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import UploadIcon from '@/assets/icons/upload.svg';
import WebsiteIcon from '@/assets/icons/website.svg';
import TelegramIcon from '@/assets/icons/telegram-light.svg';
import TwitterIcon from '@/assets/icons/twitter.svg';
import { ROUTE } from '@/constants';
import {
  createTokenOnContract,
  validateRONBalance,
} from '@/contract/integration';
import uploadFile from '@/apis/upload';
import ConfirmPopup from './ConfirmPopup';
import AlertPopup from './AlertPopup';
import { removeEmptyValues } from '@/utils';
import { StyledCreateTokenContainer } from './index.style';

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
  twitterUrl: string;
  initAmount: string;
  imageUrl: string;
};

const CreateTokenContainer = () => {
  const router = useRouter();
  const {
    isOpen: isOpenPopup,
    onOpen: onOpenPopup,
    onClose: onClosePopup,
  } = useDisclosure();
  const [showMoreOption, setShowMoreOption] = useState<boolean>(false);
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { connector, isDisconnected } = useAccount();

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
  const [isFileValid, setIsFileValid] = useState<boolean>(true);

  const onDrop = (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (!uploadFile) return;
    const fileSizeKB = uploadedFile.size / 1024;
    const fileType = uploadedFile.type;
    const validFileTypes = ['image/png', 'image/jpeg'];
    if (fileSizeKB > 2048 || !validFileTypes.includes(fileType)) {
      setIsFileValid(false);
      setIsUploadedImage(true);
      setFile(null);
      return;
    }
    setIsFileValid(true);
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

  const onSubmit = async (data: FormData) => {
    if (!session) {
      toast.warning('Please login to create a token');
      return;
    }
    onOpenPopup();
  };

  const handleCreateToken = async () => {
    const {
      name,
      ticker,
      initAmount,
      description,
      webUrl,
      teleUrl,
      twitterUrl,
    } = watch();
    let linkFile = '';
    if (!connector) {
      return;
    }
    if (isDisconnected) {
      // @ts-expect-error
      await connector?.connect();
    }

    setLoading(true);

    try {
      if (file?.file) {
        const response = await uploadFile(file.file);
        linkFile = response?.imageUrl;
      }
    } catch (error) {
      toast.error((error as any)?.message);
      setLoading(false);
    }

    const extendedObj = removeEmptyValues({
      twitterUrl,
      teleUrl,
      webUrl,
    });

    const tokenInfo = {
      name,
      symbol: ticker,
      initAmountIn: initAmount || '0',
      description: description || '',
      extended: JSON.stringify(extendedObj),
      tokenUrlImage: linkFile,
    };

    const isValidRonBalance = await validateRONBalance(
      tokenInfo,
      session?.user.publicAddress,
    );
    if (!isValidRonBalance) {
      toast.error('Insufficient account balance');
      setLoading(false);
      return;
    }

    try {
      const result = await createTokenOnContract(connector, tokenInfo);

      if (result?.txHash) {
        const { tokenAddress, txHash } = result;
        toast.success(
          <AlertPopup
            title="Created new token!"
            description="Click to view it"
            btnName="View"
            onClick={() => router.push(`${ROUTE.TOKEN}/${tokenAddress}`)}
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
      const errorMessage = (error as Error)?.message.toLowerCase() || '';

      if (errorMessage.includes('timeout')) {
        toast.warning(
          'The transaction is still processing. Please check your wallet for the status.',
        );
        return;
      }

      if (errorMessage.includes('user rejected')) {
        toast.error('Transaction is rejected by the user');
        return;
      }

      if (errorMessage.includes('insufficient funds')) {
        toast.error('Insufficient RON balance');
        return;
      }

      toast.error('Token creation failed.');
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
        twitterUrl: '',
        initAmount: '',
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
    <StyledCreateTokenContainer>
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
            Start a New Token
          </Text>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="create-token-form-container">
            <Box
              display="flex"
              gap={{ base: '15px', md: '60px' }}
              flexDirection={{ base: 'column', md: 'row' }}
            >
              {/* upload file */}
              <Box>
                <Box display="flex" gap={1}>
                  <Text className="label">Upload Image</Text>
                  <Text color="red">*</Text>
                </Box>
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
                          (isUploadedImage === false ||
                            isFileValid === false) &&
                          '2px dashed #E53E3E'
                        } `,
                      }}
                    >
                      <Input type="file" {...(getInputProps() as any)} />
                      <Image src={UploadIcon.src} />
                      <Text className="drap-and-drop">Drag and drop file</Text>
                      <Text className="max-size-text">
                        Max size: 2MB. JPG, PNG
                      </Text>
                      <Input type="file" id="file-upload" display="none" />
                      <Button className="upload-btn" onClick={openFileBrowser}>
                        Upload file
                      </Button>
                    </Box>
                    {isUploadedImage === false && (
                      <Text fontSize="14px" pt={2} color="#E53E3E">
                        This is a required field
                      </Text>
                    )}
                    {isUploadedImage === true && isFileValid === false && (
                      <Text fontSize="14px" pt={2} color="#E53E3E">
                        Image is invalid
                      </Text>
                    )}
                  </Box>
                )}
              </Box>

              {/* form */}
              <Box className="form-container">
                <FormControl isInvalid={!!errors.name} mb="4">
                  <FormLabel className="label" htmlFor="name">
                    Name
                    <Text color="red">*</Text>
                  </FormLabel>
                  <Input
                    id="name"
                    placeholder="Enter token name"
                    className="input"
                    {...register('name', {
                      required: 'This is a required field',
                      validate: (value) =>
                        value.trim() !== '' || 'This is a required field',
                    })}
                  />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.ticker} mb="4">
                  <FormLabel className="label" htmlFor="ticker">
                    Ticker
                    <Text color="red">*</Text>
                  </FormLabel>
                  <Input
                    id="ticker"
                    placeholder="Enter your ticker"
                    className="input"
                    {...register('ticker', {
                      required: 'This is a required field',
                      validate: (value) =>
                        value.trim() !== '' || 'This is a required field',
                    })}
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
                            <Image src={TwitterIcon.src} alt="twitter-icon" />
                          </InputLeftElement>
                          <Input
                            {...register('twitterUrl')}
                            className="input-group"
                            type="tel"
                            placeholder="Twitter"
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
                            placeholder="Telegram"
                          />
                        </InputGroup>
                      </FormControl>

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
              <Button type="submit" className="create-token-btn">
                Create Token
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
        initAmount={watch('initAmount')}
        onChangeInitAmount={(value) => setValue('initAmount', value)}
        onCreateToken={handleCreateToken}
      />
    </StyledCreateTokenContainer>
  );
};

export default CreateTokenContainer;
