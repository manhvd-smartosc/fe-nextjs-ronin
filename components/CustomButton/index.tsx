import React from 'react';

import { Button, HTMLChakraProps } from '@chakra-ui/react';

type ButtonVariant = 'primary' | 'secondary' | 'neutral';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const styles: Record<
  ButtonVariant,
  { backgroundColor: string; boxShadow: string; backdropFilter?: string }
> = {
  primary: {
    backgroundColor: '#AC65F3',
    boxShadow: '0px -2px 4px 3px #6F1EC0 inset',
  },
  secondary: {
    backgroundColor: '#1A1A1A',
    boxShadow: '0px -2px 2px 3px #FFFFFF1F inset',
  },
  neutral: {
    backgroundColor: '#302E2C',
    boxShadow: '0px -2px 0px 0px #BFC3B826 inset',
  },
};

const sizes: Record<
  ButtonSize,
  { width?: string; height: string; padding: string; borderRadius?: string }
> = {
  sm: {
    height: '36px',
    padding: '12px 32px',
  },
  md: {
    height: '40px',
    padding: '10px 28px',
  },
  lg: {
    height: '52px',
    padding: '6px 20px',
  },
  icon: {
    width: '40px',
    height: '40px',
    padding: '10px',
    borderRadius: '8px',
  },
};

const hoverStyles: Record<ButtonVariant, { backgroundColor: string }> = {
  primary: {
    backgroundColor: '#8B43D2',
  },
  secondary: {
    backgroundColor: '#302E2C',
  },
  neutral: {
    backgroundColor: '#121211',
  },
};

const generalStyles = {
  borderRadius: '60px',
  borderWidth: '1px',
};

interface CustomButtonProps extends HTMLChakraProps<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  onClick?: () => void;
}

const CustomButton = ({
  variant = 'primary',
  size = 'lg',
  children,
  onClick,
  ...props
}: CustomButtonProps) => {
  return (
    <Button
      _hover={hoverStyles[variant]}
      onClick={onClick}
      {...{ ...generalStyles, ...sizes[size], ...styles[variant], ...props }}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
