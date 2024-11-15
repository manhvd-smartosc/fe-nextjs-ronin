import { ConnectorError, ConnectorErrorType } from '@sky-mavis/tanto-connect';
import { toast } from 'react-toastify';

export const handleError = (error: any, defaultMessage: string) => {
  console.error(error);
  if (error instanceof ConnectorError) {
    switch (error.name) {
      case ConnectorErrorType.NOT_INSTALLED:
        toast.error('Please install Ronin Wallet to continue');
        break;
      case ConnectorErrorType.CONNECT_FAILED:
        toast.error('Connection failed');
        break;
      case ConnectorErrorType.PROVIDER_NOT_FOUND:
        toast.error('Provider not found');
        break;
      case ConnectorErrorType.SWITCH_CHAIN_NOT_SUPPORTED:
        toast.error('Please switch to Ronin Network');
        break;
    }
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    if (error.message) {
      toast.error(error.message);
    } else {
      toast.error(defaultMessage);
    }
  }
};
