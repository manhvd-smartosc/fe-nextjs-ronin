import { useCreateToken } from '@/lib-client/react-query/tokens/useCreateToken';
import { TokenCreateData } from '@/types/models/Token';
import { Button } from '@chakra-ui/react';

const Test = () => {
  const { mutate: createToken, ...restCreate } = useCreateToken();
  const handler = async () => {
    const res = await createToken({
      name: 'Bitcoin Baby Elephant',
      description: 'Bitcoin Baby Elephant',
      ticker: 'BBE',
      address: '1BhC99xL7vypbnGWgqSWxHzg5Ngufz5sn86r8LcWpump',
      createdBy: '0x9211f7b1d83f7db6a39d5eaebfa40d245019f269',
      imageUrl:
        'https://ipfs.io/ipfs/QmaMzCQsbEgPXWisPPAzsmLfkBXZnU2apfruYrSm6U8Pef',
      websiteUrl: 'https://x.com/Bitcoin/status/1859142058856116513/photo/1',
      twitterUrl: 'https://x.com/Bitcoin/status/1859142058856116513/photo/1',
    } as TokenCreateData);
  };
  return (
    <div>
      <Button colorScheme="white" margin="500px" onClick={handler}>
        Test API
      </Button>
    </div>
  );
};

export default Test;
