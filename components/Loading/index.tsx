import { Spinner, Center } from '@chakra-ui/react';

const Loading = () => {
  return (
    <Center height="100vh">
      <Spinner size="xl" />
    </Center>
  );
};

export default Loading;
