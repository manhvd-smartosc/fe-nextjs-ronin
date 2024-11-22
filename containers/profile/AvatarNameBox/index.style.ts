import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';

const StyledProfileAvatarNameBox = styled(Box)`
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  align-items: center;
  z-index: 10;
  left: 50%;
  transform: translateX(-50%);
  bottom: -145px;
  color: #faf7ed;

  .name {
    font-size: 24px;
    font-weight: 700;
    line-height: 32px;
  }

  .followers {
    font-size: 16px;
    font-weight: 400;
    line-height: 20px;
    color: #8a8986;
  }

  .address {
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 16px 8px 16px;
    gap: 12px;
    border-radius: 40px;
    opacity: 0px;
    border: 1px solid #6b6b69;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }
`;

export { StyledProfileAvatarNameBox };
