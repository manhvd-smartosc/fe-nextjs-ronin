import {
  Box,
  Text,
  Image,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverBody,
  Popover,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { IoMdArrowDropdown } from 'react-icons/io';
import { LuExternalLink } from 'react-icons/lu';
import { useAccount } from 'wagmi';
import { signOut } from 'next-auth/react';
import { handleError } from '@/utils';
import apis from '@/apis';

import { ROUTE } from '@/constants';
import PepeImg from '@/assets/images/pepe.png';
import EditIcon from '@/assets/icons/edit.svg';
import CopyIcon from '@/assets/icons/copy.svg';
import { getFirstSixChars, shortenAddress } from '@/utils/address';
import EditProfileModal from '@/containers/profile/EditProfileModal';
import { socketEmitter } from '@/lib-client/EventEmitter';

import { StyledAddressInfoBtn } from './index.style';

type AddressInfoBtnProps = {
  name: string;
  address?: string;
  avatarUrl: string;
  bio: string;
};

export const AddressInfoBtn = ({
  name,
  address,
  avatarUrl,
  bio,
}: AddressInfoBtnProps) => {
  const router = useRouter();
  const { connector } = useAccount();
  const {
    isOpen: isOpenEditmodal,
    onOpen: onOpenEditModal,
    onClose: onCloseEditModal,
  } = useDisclosure();

  const onLogout = async () => {
    try {
      if (connector) {
        await connector.disconnect();
      }
      router.push(ROUTE.HOME);
      await signOut({ redirect: false });
      toast.success('Logout successfully!');
    } catch (error) {
      handleError(error, 'Failed to logout');
    }
  };

  const handleUpdateProfile = async (profileData: any) => {
    try {
      const params = {
        name: profileData.name,
        bio: profileData.bio,
        file: profileData.file,
      };

      const data = await apis.profile.updateProfile({ ...params });
      if (data.id) {
        socketEmitter.emit('update-profile', {
          msg: {
            name: data?.name,
            avatarUrl: data?.avatarUrl,
            bio: data?.bio,
          },
        });
        toast.success('Update profile successfully');
      } else {
        toast.error(data?.message || 'Update profile failed');
      }
    } catch (error) {
      toast.error('Update profile failed');
    }
  };

  return (
    <StyledAddressInfoBtn>
      <Popover placement="bottom-end">
        {({ onClose }) => (
          <>
            <PopoverTrigger>
              <Button className="address-info-btn" size="sm" variant="outline">
                <Image
                  src={avatarUrl || PepeImg.src}
                  width="20px"
                  height="20px"
                  borderRadius="50%"
                />
                <Text>{name || getFirstSixChars(address)}</Text>
                <IoMdArrowDropdown size="20px" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverBody>
                <Box display="flex" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Text fontSize="16px" fontWeight="700">
                      My Account
                    </Text>
                  </Box>
                  <Button onClick={onLogout} className="logout-btn">
                    Log Out
                  </Button>
                </Box>
                <Box
                  mt={5}
                  display="flex"
                  gap={2}
                  pb={5}
                  borderBottom="1px solid #302E2C"
                >
                  <Box>
                    <Image
                      src={avatarUrl || PepeImg.src}
                      width="48px"
                      height="48px"
                      borderRadius="50%"
                    />
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="center"
                    flexDirection="column"
                    gap={1}
                  >
                    <Box display="flex" gap={2} alignItems="center">
                      <Text textAlign="left" fontSize="16px" fontWeight="500">
                        {name || `@${getFirstSixChars(address)}`}
                      </Text>
                      <Image
                        src={EditIcon.src}
                        onClick={onOpenEditModal}
                        boxSize="16px"
                        cursor="pointer"
                      />
                    </Box>
                    <Box display="flex" gap={2} alignItems="center">
                      <Text textAlign="left" color="#BEBDBA" fontSize="16px">
                        {shortenAddress(address, 5) || '0x205...2ee8'}
                      </Text>
                      <Image
                        src={CopyIcon.src}
                        boxSize="24px"
                        cursor="pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(address || '');
                          toast.success('Address copied to clipboard!');
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  gap={2}
                  mt={5}
                  cursor="pointer"
                  onClick={() => {
                    router.push(`${ROUTE.PROFILE}/${address}`);
                    onClose();
                  }}
                >
                  <Text className="view-profile">View Profile</Text>
                  <LuExternalLink color="#AC65F3" size={18} />
                </Box>
              </PopoverBody>
              <EditProfileModal
                initialData={{
                  name,
                  avatarUrl,
                  bio,
                }}
                isOpen={isOpenEditmodal}
                onOpen={onOpenEditModal}
                onClose={onCloseEditModal}
                onSave={handleUpdateProfile}
              />
            </PopoverContent>
          </>
        )}
      </Popover>
    </StyledAddressInfoBtn>
  );
};
