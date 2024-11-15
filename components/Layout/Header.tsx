import { Box } from '@chakra-ui/react';
import React from 'react';

import { THEME_COLOR } from '@/constants/color';

const Header: React.FC = () => {
  return (
    <header style={styles.header}>
      <Box
        display="flex"
        alignItems={'center'}
        justifyContent={'space-between'}
        minHeight={'56px'}
        padding="8px 140px"
      >
        <img
          src="https://tama.meme/media/8bfb9a9d631a8cfe928a9238f9cbad0a.svg"
          height={40}
          width={40}
          alt="logo"
        />
        <Box>login here</Box>
      </Box>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: THEME_COLOR.headerBg,
    color: THEME_COLOR.text,
    textAlign: 'center' as const,
    marginTop: 'auto',
    minHeight: '56px',
  },
};

export default Header;
