import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';

const StyledBodyWrapper = styled(Box)`
  .image-wrap-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
    margin-bottom: 10px;
  }

  .image-preview {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .upload-button {
    height: 32px;
    padding: 6px 12px;
    gap: 8px;
    border-radius: 16px;
    opacity: 0px;
    background: #302e2c;
    color: #faf7ed;
    font-weight: 700;
    line-height: 20px;
    backdrop-filter: blur(118.8px);
    box-shadow: 0px -2px 0px 0px #bfc3b826 inset;
  }

  .form-label {
    font-weight: 500;
    line-height: 20px;
    color: #faf7ed;
  }

  .input-wrap {
    min-height: 48px;
    padding: 13px 16px 13px 16px;
    gap: 10px;
    border-radius: 12px;
    border: 2px solid #6b6b69;
    opacity: 0px;
    display: flex;
    align-items: center;
  }
`;

export { StyledBodyWrapper };
