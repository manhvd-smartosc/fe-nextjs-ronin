'use client';
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
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { socketEmitter } from '@/lib-client/EventEmitter';
import { getFirstSixChars } from '@/utils/address';
import api from '@/apis';
import BackgroundCover from './BackgroundCover';
import AvatarNameBox from './AvatarNameBox';
import EditProfileModal from './EditProfileModal';
import TabSection from './TabSection';
import PepeImg from '@/assets/images/pepe.png';
import Loading from '@/components/Loading';
import { StyledProfilePage } from './index.style';

const Profile: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const userAddress = params?.id?.[0];
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
    defaultAvatar: '',
    defaultName: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const {
    isOpen: isOpenEditmodal,
    onOpen: onOpenEditModal,
    onClose: onCloseEditModal,
  } = useDisclosure();

  const getProfileDetail = async () => {
    if (!userAddress && !session?.user.publicAddress) {
      return;
    }
    try {
      setLoading(true);
      const data = await api.profile.fetchProfileDetail({
        address: userAddress || session?.user.publicAddress,
      });

      if (!data?.address) {
        router.push('/');
        return;
      }
      setProfileDetail({
        avatarUrl: data?.avatarUrl,
        name: data?.name,
        followers: 100,
        address: data?.address,
        bio: data?.bio || '',
        defaultAvatar: PepeImg.src,
        defaultName: `@${getFirstSixChars(data?.address)}`,
      });
      setLoading(false);
    } catch (error) {
      toast.error((error as any)?.message || 'Get profile detail failed');
    }
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
          defaultAvatar: PepeImg.src,
          defaultName: `@${getFirstSixChars(data?.address)}`,
        });
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

  useEffect(() => {
    getProfileDetail();
  }, [session, userAddress]);

  useEffect(() => {
    const handleUpdateProfileFromSocket = (data: any) => {
      const { name, avatarUrl, bio } = data.msg;
      setProfileDetail({
        ...profileDetail,
        name,
        avatarUrl,
        bio,
        defaultAvatar: PepeImg.src,
        defaultName: `@${getFirstSixChars(data?.address)}`,
      });
    };
    socketEmitter.on('update-profile', handleUpdateProfileFromSocket);
    return () => {
      socketEmitter &&
        socketEmitter.off('update-profile', handleUpdateProfileFromSocket);
    };
  }, []);

  const shouldShowEditButton =
    !userAddress ||
    (userAddress && userAddress === session?.user.publicAddress);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <StyledProfilePage>
        <BackgroundCover>
          <AvatarNameBox
            avatarUrl={profileDetail.avatarUrl || profileDetail.defaultAvatar}
            name={profileDetail.name || profileDetail.defaultName}
            address={profileDetail?.address}
            followers={profileDetail.followers}
          />
        </BackgroundCover>
        <Box
          display={'flex'}
          justifyContent={'flex-end'}
          margin={'24px 24px'}
          minH="36px"
        >
          {shouldShowEditButton && (
            <Button className="edit-button" onClick={onOpenEditModal}>
              <AiFillEdit color="#FAF7ED" />
              Edit Profile
            </Button>
          )}
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
