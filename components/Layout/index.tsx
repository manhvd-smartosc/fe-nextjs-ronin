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
    <div>
      <Header />
      <main>
        <Box
          padding={'24px 140px'}
          backgroundColor={THEME_COLOR.bodyColor}
          color={THEME_COLOR.text}
          minHeight={`calc(100vh - 56px - 56px)`}
        >
          {children}
        </Box>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
