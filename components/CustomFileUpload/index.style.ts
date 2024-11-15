import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const StyledFileUploadContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;

  .upload-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 32px 16px;
    gap: 5px;
    width: 100%;
    border: 2px dashed #6b6b69;
    border-radius: 16px;
    flex: none;
    order: 0;
    flex-grow: 0;

    @media (max-width: 768px) {
      width: auto;
      height: 200px;
    }

    .drap-and-drop {
      font-weight: 500;
      font-size: 16px;
      line-height: 22px;
      text-align: center;
      letter-spacing: -0.01em;
      color: #faf7ed;
    }

    .max-size-text {
      height: 16px;
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      display: flex;
      align-items: center;
      letter-spacing: -0.005em;
      color: #8a8986;
    }

    .upload-btn {
      padding: 10px 12px;
      width: 150px;
      height: 40px;
      border: 2px solid #ac65f3;
      border-radius: 256px;
      background-color: transparent;
      color: white;
      margin-top: 16px;

      @media (max-width: 768px) {
        margin-top: 20px;
      }
    }
  }
`;
