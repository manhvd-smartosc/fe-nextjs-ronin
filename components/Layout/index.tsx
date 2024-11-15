import React from 'react';
import Header from './Header';
import { Box, useDisclosure } from '@chakra-ui/react';
import { THEME_COLOR } from '@/constants/color';
import Footer from './Footer';
import HowItWorkModal from '../HowItWorkModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Header handleOpenHowItWork={onOpen} />

      <main>
        <Box
          backgroundColor="#1A1A1A"
          color={THEME_COLOR.text}
          minHeight={`calc(100vh - 76px - 56px)`}
        >
          {children}
        </Box>
      </main>
      <HowItWorkModal isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
      <Footer />
    </Box>
  );
};

export default Layout;
