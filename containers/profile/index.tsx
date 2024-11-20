import React, { useEffect, useState } from 'react';
import { StyledProfilePage } from './index.style';
import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { AiFillEdit } from 'react-icons/ai';

import BackgroundCover from './BackgroundCover';
import AvatarNameBox from './AvatarNameBox';
import EditProfileModal from './EditProfileModal';
import TabSection from './TabSection';

const profileData = {
  avatarUrl:
    'https://fastly.picsum.photos/id/951/200/300.jpg?hmac=88jOMC9sFPf_Y7l4aMvDLBsqNuoprR9_Rvvbqb0oRPA',
  name: '@8XhtK7',
  followers: 100,
  address: '0x8d04a8c79ceb0889bdd12acdf3fa9d207ed3ff63',
};

const Profile: React.FC = () => {
  const [profileDetail, setProfileDetail] = useState({
    avatarUrl: '',
    name: '',
    followers: 0,
    address: '',
  });
  const {
    isOpen: isOpenEditmodal,
    onOpen: onOpenEditModal,
    onClose: onCloseEditModal,
  } = useDisclosure();

  const fetchProfileDetail = async () => {
    // fetch profile detail
    setProfileDetail(profileData);
  };

  useEffect(() => {
    fetchProfileDetail();
  }, []);

  return (
    <>
      <StyledProfilePage>
        <BackgroundCover>
          <AvatarNameBox
            avatarUrl={profileDetail.avatarUrl}
            name={profileDetail.name}
            address={profileDetail.address}
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
          bio: '',
        }}
        isOpen={isOpenEditmodal}
        onOpen={onOpenEditModal}
        onClose={onCloseEditModal}
        onSave={(profileData) => {
          console.log(profileData);
        }}
      />
    </>
  );
};

export default Profile;
