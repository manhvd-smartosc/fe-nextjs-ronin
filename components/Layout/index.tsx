import React from 'react';
import Header from './Header';
import { Box } from '@chakra-ui/react';
import { THEME_COLOR } from '@/constants/color';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box>
      <Header />
      <main>
        <Box
          backgroundColor={THEME_COLOR.headerBg}
          color={THEME_COLOR.text}
          minHeight={`calc(100vh - 56px - 56px)`}
        >
          {children}
        </Box>
      </main>
      <Footer />
    </Box>
  );
};

export default Layout;
