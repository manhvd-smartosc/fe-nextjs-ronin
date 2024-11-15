import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { AiFillEdit } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { socketEmitter } from '@/lib-client/EventEmitter';
import { getFirstSixChars } from '@/utils/address';
import api from '@/apis';
import BackgroundCover from './BackgroundCover';
import AvatarNameBox from './AvatarNameBox';
import EditProfileModal from './EditProfileModal';
import TabSection from './TabSection';
import PepeImg from '@/assets/images/pepe.png';
import { StyledProfilePage } from './index.style';

const Profile: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession({
    required: false,
  });
  const currentSize = useBreakpointValue({
    base: 'small',
    md: 'medium',
    lg: 'large',
    xl: 'extra large',
  });

  const [profileDetail, setProfileDetail] = useState({
    avatarUrl: '',
    name: '',
    followers: 0,
    address: '',
    bio: '',
  });
  const {
    isOpen: isOpenEditmodal,
    onOpen: onOpenEditModal,
    onClose: onCloseEditModal,
  } = useDisclosure();

  const getProfileDetail = async () => {
    const data = await api.profile.fetchProfileDetail({
      address: session?.user.publicAddress,
    });

    setProfileDetail({
      avatarUrl: data?.avatarUrl,
      name: data?.name,
      followers: 100,
      address: data?.address,
      bio: data?.bio,
    });
  };

  const handleUpdateProfile = async (profileData: any) => {
    try {
      const params = {
        name: profileData.name,
        bio: profileData.bio,
        file: profileData.file,
      };

      const data = await api.profile.updateProfile({ ...params });
      if (data.id) {
        setProfileDetail({
          avatarUrl: data?.avatarUrl,
          name: data?.name,
          followers: 100,
          address: data?.address,
          bio: data?.bio,
        });
        socketEmitter.emit('update-profile', {
          msg: {
            name: data?.name,
            avatarUrl: data?.avatarUrl,
          },
        });
        toast.success('Update profile successfully');
      }
    } catch (error) {
      toast.error('Update profile failed');
    }
  };

  useEffect(() => {
    getProfileDetail();
  }, [session]);

  return (
    <>
      <StyledProfilePage>
        <BackgroundCover>
          <AvatarNameBox
            avatarUrl={profileDetail.avatarUrl || PepeImg.src}
            name={
              profileDetail.name ||
              `@${getFirstSixChars(session?.user.publicAddress)}`
            }
            address={session?.user.publicAddress}
            followers={profileDetail.followers}
          />
        </BackgroundCover>
        <Box display={'flex'} justifyContent={'flex-end'} margin={'24px 24px'}>
          <Button className="edit-button" onClick={onOpenEditModal}>
            <AiFillEdit color="#FAF7ED" />
            Edit Profile
          </Button>
        </Box>
        <TabSection />
      </StyledProfilePage>
      <EditProfileModal
        initialData={{
          name: profileDetail.name,
          avatarUrl: profileDetail.avatarUrl,
          bio: profileDetail.bio,
        }}
        isOpen={isOpenEditmodal}
        onOpen={onOpenEditModal}
        onClose={onCloseEditModal}
        onSave={handleUpdateProfile}
      />
    </>
  );
};

export default Profile;
