import { THEME_COLOR } from '@/constants/color';
import {
  Box,
  Button,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

interface HowItWorkModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const HowItWorkModal = ({ isOpen, onOpen, onClose }: HowItWorkModalProps) => {
  return (
    <>
      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          backgroundColor="#1A1A1A"
          color={THEME_COLOR.text}
          border="1px solid #3A3A38"
        >
          <ModalHeader textAlign="center">How it works</ModalHeader>
          <ModalBody textAlign="center" backgroundColor="#1A1A1A">
            <Box marginBottom={4}>
              Ronin.fun prevents rugs by making sure that all created tokens are
              safe. Each coin on Ronin is a <strong>fair-launch</strong> with no
              <strong>presale</strong> and <strong>no team allocation</strong> .
            </Box>
            <List spacing={4}>
              <ListItem>step 1: pick a coin that you like</ListItem>
              <ListItem>step 2: buy the coin on the bonding curve</ListItem>
              <ListItem>
                step 3: sell at any time to lock in your profits or losses
              </ListItem>
              <ListItem>
                step 4: when enough people buy on the bonding curve it reaches a
                market cap of $69k
              </ListItem>
              <ListItem>
                step 5: $12k of liquidity is then deposited in raydium and
                burned
              </ListItem>
            </List>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button variant="solid" onClick={onClose} borderRadius="20px">
              I'm ready to Ronin.fun!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default HowItWorkModal;
