import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import axiosInstance from 'lib-client/react-query/axios';
import { Routes } from 'lib-client/constants';
import { TokenCreateData } from 'types/models/Token';

const createToken = async (post: TokenCreateData) => {
  const { data } = await axiosInstance.post<TokenCreateData>(
    Routes.API.TOKENS,
    post,
  );
  return data;
};

export const useCreateToken = () => {
  const router = useRouter();

  const mutation = useMutation<
    TokenCreateData,
    AxiosError,
    TokenCreateData,
    unknown
  >((token) => createToken(token), {
    onSuccess: async () => {
      console.log('onSuccess CreateToken');
    },
  });

  return mutation;
};
