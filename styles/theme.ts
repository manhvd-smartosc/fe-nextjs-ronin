import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: 'Helvetica Neue',
    body: 'Helvetica Neue',
  },
  styles: {
    global: {
      body: {
        fontSize: '14px',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        color: 'white',
        background: '#ac65f3',
        borderRadius: '40px',
      },
      variants: {
        solid: {
          bg: '#ac65f3',
          color: 'white',
        },
        outline: {
          background: 'transparent',
          color: 'white',
        },
      },
      defaultProps: {
        size: 'md',
      },
      sizes: {
        md: {
          fontSize: '14px',
        },
      },
    },
  },
});

export default theme;
