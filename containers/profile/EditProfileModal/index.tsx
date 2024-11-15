import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalOverlay,
  Textarea,
} from '@chakra-ui/react';
import { StyledModalContent, StyledModalHeader } from './index.style';

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentData((prev) => ({
          ...prev,
          avatarUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangeInput = (e: React.ChangeEvent<any>, name: string) => {
    setCurrentData((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };

  const handleSave = () => {
    onSave(currentData);
    onClose();
  };

  useEffect(() => {
    setCurrentData(initialData);
  }, [initialData]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <StyledModalContent>
          <StyledModalHeader>Edit Profile</StyledModalHeader>
          <ModalCloseButton className="close-button" />
          <ModalBody
            pb={6}
            backgroundColor={'#0A0A0A'}
            padding={'24px'}
            borderRadius={'24px'}
          >
            <Box className="image-wrap-container">
              <Box borderRadius="50%">
                <Image
                  src={currentData.avatarUrl}
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
            <FormControl>
              <FormLabel className="form-label">Username</FormLabel>
              <Box className="input-wrap">
                <Input
                  variant="unstyled"
                  placeholder="Enter username"
                  value={currentData.name}
                  _placeholder={{ color: '#8A8986' }}
                  onChange={(e) => handleChangeInput(e, 'name')}
                />
              </Box>
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
          </ModalBody>

          <ModalFooter p={0} display={'flex'} justifyContent={'center'}>
            <Button className="save-button" onClick={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </StyledModalContent>
      </Modal>
    </>
  );
};

export default EditProfileModal;
