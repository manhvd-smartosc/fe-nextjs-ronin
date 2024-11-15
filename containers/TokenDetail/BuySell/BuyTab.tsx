import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Image,
  Input,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Token } from '@prisma/client';
import apis from '@/apis';
import { AppSyncEventType, socketEmitter } from '@/lib-client/EventEmitter';
import { getQuantityTokensByRon, handleBuy } from '@/contract/integration';
import SlippageModal, { Slippage } from './SlippageModal';
import AddCommentModal, { Comment } from './AddCommentModal';
import { StyledFormWrapper } from './index.style';

const BuyTab: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenAddCmtModal,
    onOpen: onOpenAddCmtModal,
    onClose: onCloseAddCmtModal,
  } = useDisclosure();
  const [checkedAddComment, setCheckedAddComment] = useState<boolean>(false);
  const router = useRouter();
  const { address: tokenAddressQuery } = router.query;
  const tokenAddress = Array.isArray(tokenAddressQuery)
    ? tokenAddressQuery[0]
    : tokenAddressQuery;
  const { connector } = useAccount();
  const [buyAmount, setBuyAmount] = useState<string>('');
  const [isValidBuyAmount, setIsValidBuyAmount] = useState<boolean>(true);
  const [tokenAmount, setTokenAmount] = useState<number>();
  const [tokenDetail, setTokenDetail] = useState<Token>();
  const [slippage, setSlippage] = useState<Slippage>();
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession({
    required: false,
  });

  const handleChangeBuyAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^0-9.]/g, '');
    setIsValidBuyAmount(!!value);
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value)) {
      setBuyAmount(value);
    }
  };

  const handleSetSlippage = ({ maxSlippage, priorityFee }: Slippage) => {
    setSlippage({ maxSlippage, priorityFee });
  };

  const handleChangeCheckedAddComment = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCheckedAddComment(e.target.checked);
  };

  const handleQuickChoseQuantity = (quantity: number) => {
    setBuyAmount(quantity.toString());
    setIsValidBuyAmount(true);
  };

  const fetchTokenDetail = async () => {
    if (!tokenAddress) {
      return;
    }
    const data = await apis.token.getTokenDetail(tokenAddress as string);
    if (!data) {
      return;
    }
    setTokenDetail(data);
  };

  const getTokensAmount = async () => {
    const estQuantityToken = await getQuantityTokensByRon(
      tokenDetail?.address as string,
      buyAmount,
    );

    setTokenAmount(estQuantityToken || 0);
  };

  const handleBuyToken = async (comment?: string) => {
    if (!connector) {
      return;
    }

    try {
      setLoading(true);
      const minReceivedAmount = Math.floor(
        tokenAmount
          ? tokenAmount * (1 - Number(slippage?.maxSlippage || 0) / 100)
          : 0,
      );

      const txHash = await handleBuy({
        connector,
        buyAmount,
        tokenAddress: tokenDetail?.address as string,
        minReceived: minReceivedAmount.toString(),
        priorityFee: slippage?.priorityFee?.toString() || '0',
      });

      if (txHash) {
        onCloseAddCmtModal();
        setBuyAmount('');
        setTokenAmount(0);
        if (comment) {
          await apis.comment.postComment({
            tokenId: tokenDetail?.id ? tokenDetail.id.toString() : '',
            content: comment,
          });
        }
        toast.success('Buy token successfully!');
      }
    } catch (error) {
      const errorMessage = (error as Error)?.message.toLowerCase() || '';

      if (errorMessage.includes('timeout')) {
        toast.warning(
          'The transaction is still processing. Please check your wallet for the status.',
        );
        return;
      }

      if (errorMessage.includes('user rejected')) {
        toast.error('Transaction is rejected by the user');
        return;
      }

      if (errorMessage.includes('insufficient funds')) {
        toast.error('Insufficient RON balance');
        return;
      }

      toast.error('Buy token failed. Please try again.');
    } finally {
      setLoading(false);
      setCheckedAddComment(false);
    }
  };

  const handlePlaceTrade = async () => {
    if (!session) {
      toast.warning('Please login to buy token');
      return;
    }

    if (!buyAmount) {
      setIsValidBuyAmount(false);
      return;
    }
    if (checkedAddComment) {
      onOpenAddCmtModal();
    } else {
      await handleBuyToken();
    }
  };

  useEffect(() => {
    fetchTokenDetail();
  }, [tokenAddress]);

  useEffect(() => {
    getTokensAmount();
  }, [buyAmount]);

  useEffect(() => {
    socketEmitter.on(
      `${tokenAddress?.toLowerCase()}_${AppSyncEventType.TRADE}`,
      getTokensAmount,
    );

    return () => {
      if (socketEmitter) {
        socketEmitter.off(
          `${tokenAddress?.toLowerCase()}_${AppSyncEventType.TRADE}`,
          getTokensAmount,
        );
      }
    };
  }, [tokenAddress, buyAmount]);

  return (
    <>
      <StyledFormWrapper>
        <Box display="flex" justifyContent="flex-end">
          <Button
            className="slippage-button"
            onClick={onOpen}
            disabled={loading}
          >
            Set max slippage
          </Button>
        </Box>
        <Box
          className="input-wrapper"
          style={{
            border: !isValidBuyAmount ? '2px solid #e53e3e' : undefined,
          }}
        >
          <Input
            variant="unstyled"
            className="input-amount"
            placeholder="0.0"
            onChange={handleChangeBuyAmount}
            value={buyAmount}
            disabled={loading}
            _placeholder={{
              color: '#8A8986',
            }}
          />
          <Box className="label">
            <Text>RON</Text>
            <Image
              w="24px"
              h="24px"
              borderRadius="50%"
              src="https://play-lh.googleusercontent.com/HGoGVDTQ5DuqZMy7w9kmuDlk_BNbVKDLCS7qNRE77puY4skfM1rptrDoifxIK5GJ06E"
              alt="ron"
            />
          </Box>
        </Box>
        {!isValidBuyAmount && (
          <Text color="red">This is a required field.</Text>
        )}

        {!!tokenAmount && buyAmount && (
          <Box display="flex" gap={1} className="note">
            <Text>You receive </Text>
            <Text fontWeight="bold">~{tokenAmount.toFixed(6)}</Text>
            <Text>{tokenDetail?.ticker}</Text>
          </Box>
        )}
        <Box className="option-wrapper">
          <Button
            variant="unstyled"
            disabled={loading}
            onClick={() => handleQuickChoseQuantity(0)}
          >
            Reset
          </Button>
          <Button
            variant="unstyled"
            disabled={loading}
            onClick={() => handleQuickChoseQuantity(10)}
          >
            10 RON
          </Button>
          <Button
            variant="unstyled"
            disabled={loading}
            onClick={() => handleQuickChoseQuantity(25)}
          >
            25 RON
          </Button>
          <Button
            variant="unstyled"
            disabled={loading}
            onClick={() => handleQuickChoseQuantity(50)}
          >
            50 RON
          </Button>
          <Button
            variant="unstyled"
            disabled={loading}
            onClick={() => handleQuickChoseQuantity(100)}
          >
            100 RON
          </Button>
        </Box>
        <Box>
          <Button
            disabled={loading}
            className="submit-button"
            onClick={handlePlaceTrade}
          >
            {loading ? <Spinner /> : 'Place trade'}
          </Button>
        </Box>

        <Checkbox
          disabled={loading}
          color="#FAF7ED"
          width="fit-content"
          isChecked={checkedAddComment}
          onChange={handleChangeCheckedAddComment}
        >
          Add comment
        </Checkbox>
      </StyledFormWrapper>
      <SlippageModal
        open={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        onConfirm={handleSetSlippage}
      />
      <AddCommentModal
        open={isOpenAddCmtModal}
        onOpen={onOpenAddCmtModal}
        onClose={onCloseAddCmtModal}
        previewMsg={
          !!tokenAmount && (
            <Box display="flex" mt={2} gap={1}>
              <Text>
                Buy <strong>{tokenAmount?.toFixed(6)}</strong>{' '}
                {tokenDetail?.ticker} for <strong>{buyAmount}</strong> RON
              </Text>
            </Box>
          )
        }
        onConfirm={({ comment }: Comment) => handleBuyToken(comment)}
      />
    </>
  );
};

export default BuyTab;
