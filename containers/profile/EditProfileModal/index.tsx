import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Image,
  Input,
  Textarea,
  Text,
} from '@chakra-ui/react';
import PepeImg from '@/assets/images/pepe.png';

import { StyledBodyWrapper } from './index.style';
import CustomModal from '@/components/CustomModal';

interface EditProfileModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSave: (profileData: {
    avatarUrl: string;
    name: string;
    bio: string;
  }) => void;
  initialData: { avatarUrl: string; name: string; bio: string };
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  initialData,
  isOpen,
  onClose,
  onOpen,
  onSave,
}) => {
  const [currentData, setCurrentData] = useState(initialData);
  const [isErrorImage, setIsErrorImage] = useState<boolean>();
  const [isChanged, setIsChanged] = useState(false);
  const [errorUsername, setErrorUsername] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validFileTypes = ['image/jpeg', 'image/png'];
    const fileSizeKB = file.size / 1024;

    if (!validFileTypes.includes(file.type)) {
      setIsErrorImage(true);
      return;
    }

    if (fileSizeKB > 2048) {
      setIsErrorImage(true);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCurrentData((prevData) => ({
        ...prevData,
        avatarUrl: reader.result as string,
        file,
      }));
      setIsErrorImage(false);
    };
    reader.readAsDataURL(file);
  };

  const validateInput = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    if (!usernameRegex.test(username)) {
      setErrorUsername(
        'Username must only contain letters, numbers, or underscores',
      );
      return false;
    }
    if (username?.length > 10) {
      setErrorUsername('Username must be 10 characters or less');
      return false;
    }
    setErrorUsername(null);
    return true;
  };

  const handleChangeInput = (e: React.ChangeEvent<any>, name: string) => {
    const value = e.target.value;
    setCurrentData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateInput(value);
  };

  const handleSave = async () => {
    const isValidInput = validateInput(currentData.name);
    if (!isValidInput) return;
    await onSave(currentData);
    onClose();
  };

  useEffect(() => {
    setCurrentData(initialData);
    setIsChanged(false);
  }, [initialData]);

  useEffect(() => {
    setIsChanged(JSON.stringify(currentData) !== JSON.stringify(initialData));
  }, [currentData, initialData]);

  return (
    <CustomModal
      headTitle="Edit Profile"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSave}
      bodyBg="#0A0A0A"
      cfButtonLabel="Save"
      closeButtonLabel="Cancel"
      isHasCloseButton={false}
      isDisabledSaveButton={!isChanged || !!errorUsername}
    >
      <StyledBodyWrapper>
        <Box className="image-wrap-container">
          <Box borderRadius="50%">
            <Image
              src={currentData.avatarUrl || PepeImg.src}
              alt="avatar"
              className="image-preview"
            />
          </Box>
          <Input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            display="none"
          />
          <Button
            className="upload-button"
            onClick={() => {
              document.getElementById('fileInput')?.click();
            }}
          >
            Upload image
          </Button>
        </Box>
        {isErrorImage && (
          <Text color="#e53e3e" mb={2}>
            Image is invalid
          </Text>
        )}
        <FormControl>
          <FormLabel className="form-label">Username</FormLabel>
          <Box
            className="input-wrap"
            style={{ border: errorUsername ? '2px solid #e53e3e' : undefined }}
          >
            <Input
              variant="unstyled"
              placeholder="Enter username"
              value={currentData.name}
              _placeholder={{ color: '#8A8986' }}
              onChange={(e) => handleChangeInput(e, 'name')}
            />
          </Box>
          {errorUsername && (
            <Text color="#e53e3e" mt={1}>
              {errorUsername}
            </Text>
          )}
          <Text color="#05AAD7" fontSize="14px" mt={1}>
            You can change your username once every day
          </Text>
        </FormControl>

        <FormControl mt={4}>
          <FormLabel className="form-label">Bio</FormLabel>
          <Box className="input-wrap">
            <Textarea
              variant={'unstyled'}
              placeholder="Enter bio..."
              value={currentData.bio}
              onChange={(e) => handleChangeInput(e, 'bio')}
              _placeholder={{
                color: '#8A8986',
              }}
              resize={'none'}
            />
          </Box>
        </FormControl>
      </StyledBodyWrapper>
    </CustomModal>
  );
};

export default EditProfileModal;
