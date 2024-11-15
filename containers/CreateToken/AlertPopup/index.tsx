import { FC } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import { StyledAlertPopup } from './index.style';

interface AlertPopupProps {
  title: string;
  description: string;
  btnName: string;
  onClick: () => void;
}

const AlertPopup: FC<AlertPopupProps> = ({
  title,
  description,
  btnName,
  onClick,
}) => (
  <StyledAlertPopup>
    <FaCheckCircle color="#3DD37C" size="24px" />
    <Box display="flex" flexDirection="column" ml={2}>
      <Text fontWeight="700" fontSize="14px">
        {title}
      </Text>
      <Text fontSize="12px" color="#8A8986">
        {description}
      </Text>
      <Button className="view-btn" onClick={onClick}>
        {btnName}
      </Button>
    </Box>
  </StyledAlertPopup>
);

export default AlertPopup;
