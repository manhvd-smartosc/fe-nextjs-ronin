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
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { Token } from '@prisma/client';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { useSession } from 'next-auth/react';
import apis from '@/apis';
import { DEFAULT_MAX_SLIPPAGE } from '@/constants';
import {
  checkTokenBalance,
  getQuantityRonsByToken,
  handleSell,
} from '@/contract/integration';
import { AppSyncEventType, socketEmitter } from '@/lib-client/EventEmitter';
import SlippageModal, { Slippage } from './SlippageModal';
import AddCommentModal, { Comment } from './AddCommentModal';
import { StyledFormWrapper } from './index.style';

const SellTab: React.FC = () => {
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

  const { connector, address } = useAccount();
  const [sellAmount, setSellAmount] = useState<string>('');
  const [isValidSellAmount, setIsValidSellAmount] = useState<boolean>(true);
  const [ronAmount, setRonAmount] = useState<number>();
  const [tokenDetail, setTokenDetail] = useState<Token>();
  const [slippage, setSlippage] = useState<Slippage>({
    maxSlippage: DEFAULT_MAX_SLIPPAGE,
    priorityFee: '0',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession({
    required: false,
  });

  const handleChangeSellAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^0-9.]/g, '');
    setIsValidSellAmount(!!value);
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value)) {
      setSellAmount(value);
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

  const getSellAmount = async (rate: number) => {
    if (address && tokenAddress) {
      const balance = await checkTokenBalance({
        address,
        tokenAddress,
      });

      let amount: any =
        (BigInt(rate * 10 ** 18) * BigInt(balance.toString())) /
        BigInt(10 ** 18);
      amount = ethers.formatUnits(amount, 18).toString();

      setSellAmount(amount.toString());
      setIsValidSellAmount(true);
    }
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

  const getRonsAmount = async () => {
    const estQuantityRon = await getQuantityRonsByToken(
      tokenDetail?.address as string,
      sellAmount,
    );
    setRonAmount(estQuantityRon || 0);
  };

  const handleSellToken = async (comment?: string) => {
    if (!connector) {
      return;
    }
    try {
      setLoading(true);

      const minReceivedAmount = ronAmount
        ? ronAmount * (1 - Number(slippage?.maxSlippage || 0) / 100)
        : 0;

      const txHash = await handleSell({
        connector,
        sellAmount,
        tokenAddress: tokenDetail?.address as string,
        minReceived: minReceivedAmount.toString(),
        priorityFee: slippage?.priorityFee?.toString() || '0',
      });

      if (txHash) {
        setSellAmount('');
        fetchTokenDetail();
        setRonAmount(0);
        if (comment) {
          await apis.comment.postComment({
            tokenId: tokenDetail?.id ? tokenDetail.id.toString() : '',
            content: comment,
          });
        }
        toast.success('Sell token successfully!');
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

      toast.error('Sell token failed. Please try again.');
    } finally {
      setLoading(false);
      setCheckedAddComment(false);
    }
  };
  const handlePlaceTrade = async () => {
    if (!session) {
      toast.warning('Please login to sell token');
      return;
    }

    if (!sellAmount) {
      setIsValidSellAmount(false);
      return;
    }

    if (checkedAddComment) {
      onOpenAddCmtModal();
    } else {
      await handleSellToken();
    }
  };

  useEffect(() => {
    fetchTokenDetail();
  }, [tokenAddress, address]);

  useEffect(() => {
    getRonsAmount();
  }, [sellAmount]);

  useEffect(() => {
    socketEmitter.on(
      `${tokenAddress?.toLowerCase()}_${AppSyncEventType.TRADE}`,
      getRonsAmount,
    );

    return () => {
      if (socketEmitter) {
        socketEmitter.off(
          `${tokenAddress?.toLowerCase()}_${AppSyncEventType.TRADE}`,
          getRonsAmount,
        );
      }
    };
  }, [tokenAddress, sellAmount]);

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
            border: !isValidSellAmount ? '2px solid #e53e3e' : undefined,
          }}
        >
          <Input
            variant="unstyled"
            className="input-amount"
            placeholder="0.0"
            disabled={loading}
            _placeholder={{
              color: '#8A8986',
            }}
            onChange={handleChangeSellAmount}
            value={sellAmount}
          />
          <Box className="label">
            <Text>{tokenDetail?.ticker}</Text>
            <Image
              w="24px"
              h="24px"
              borderRadius="50%"
              src={tokenDetail?.imageUrl}
              alt="ron"
            />
          </Box>
        </Box>
        {!isValidSellAmount && (
          <Text color="red">This is a required field.</Text>
        )}
        {!!ronAmount && sellAmount && (
          <Box display="flex" gap={1} className="note">
            <Text>You receive </Text>
            <Text fontWeight="bold">~{ronAmount.toFixed(6)}</Text>
            <Text>RON</Text>
          </Box>
        )}
        <Box className="option-wrapper">
          <Button
            variant="unstyled"
            onClick={() => getSellAmount(0)}
            disabled={loading}
          >
            Reset
          </Button>
          <Button
            variant="unstyled"
            onClick={() => getSellAmount(0.25)}
            disabled={loading}
          >
            25%
          </Button>
          <Button
            variant="unstyled"
            onClick={() => getSellAmount(0.5)}
            disabled={loading}
          >
            50%
          </Button>
          <Button
            variant="unstyled"
            onClick={() => getSellAmount(1)}
            disabled={loading}
          >
            100%
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
          width="fit-content"
          isChecked={checkedAddComment}
          disabled={loading}
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
          !!ronAmount && (
            <Box display="flex" mt={2} gap={1}>
              <Text>
                Sell <strong>{Number(sellAmount).toFixed(6)}</strong>{' '}
                {tokenDetail?.ticker} for{' '}
                <strong>{ronAmount.toFixed(6)}</strong> RON
              </Text>
            </Box>
          )
        }
        onConfirm={({ comment }: Comment) => handleSellToken(comment)}
      />
    </>
  );
};

export default SellTab;
