import { TokensGetData } from '@/types/models/Token';
import axiosInstance from '../axios';
import { Routes } from '@/lib-client/constants';
import { useMutation, useQuery } from 'react-query';
import { AxiosError } from 'axios';

const getTokenList = async (params: TokensGetData) => {
  const { data } = await axiosInstance.get<TokensGetData>(Routes.API.TOKENS, {
    params,
  });
  return data;
};

export const useGetToken = () => {
  const query = useQuery<TokensGetData, AxiosError, TokensGetData>(
    ['getToken'],
    ({ queryKey }) => getTokenList(queryKey[1] as TokensGetData),
    {
      onSuccess: async () => {
        console.log('onSuccess getTokenList');
      },
    },
  );

  return query;
};
