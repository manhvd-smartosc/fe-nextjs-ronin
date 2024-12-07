import { handleError } from '@/utils';
import { toast } from 'react-toastify';

jest.mock('@sky-mavis/tanto-connect', () => ({
  ConnectorError: class ConnectorError {
    constructor(public name: string) {}
  },
  ConnectorErrorType: {
    NOT_INSTALLED: 'NOT_INSTALLED',
    CONNECT_FAILED: 'CONNECT_FAILED',
    PROVIDER_NOT_FOUND: 'PROVIDER_NOT_FOUND',
    SWITCH_CHAIN_NOT_SUPPORTED: 'SWITCH_CHAIN_NOT_SUPPORTED',
  },
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('handleError', () => {
  const defaultMessage = 'An unknown error occurred';
  const {
    ConnectorError,
    ConnectorErrorType,
  } = require('@sky-mavis/tanto-connect');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display the correct toast message for NOT_INSTALLED error', () => {
    const error = new ConnectorError(ConnectorErrorType.NOT_INSTALLED);
    handleError(error, defaultMessage);
    expect(toast.error).toHaveBeenCalledWith(
      'Please install Ronin Wallet to continue',
    );
  });

  it('should display the correct toast message for CONNECT_FAILED error', () => {
    const error = new ConnectorError(ConnectorErrorType.CONNECT_FAILED);
    handleError(error, defaultMessage);
    expect(toast.error).toHaveBeenCalledWith('Connection failed');
  });

  it('should display the correct toast message for PROVIDER_NOT_FOUND error', () => {
    const error = new ConnectorError(ConnectorErrorType.PROVIDER_NOT_FOUND);
    handleError(error, defaultMessage);
    expect(toast.error).toHaveBeenCalledWith('Provider not found');
  });

  it('should display the correct toast message for SWITCH_CHAIN_NOT_SUPPORTED error', () => {
    const error = new ConnectorError(
      ConnectorErrorType.SWITCH_CHAIN_NOT_SUPPORTED,
    );
    handleError(error, defaultMessage);
    expect(toast.error).toHaveBeenCalledWith('Please switch to Ronin Network');
  });

  it('should display the error message for a generic Error instance', () => {
    const error = new Error('A generic error occurred');
    handleError(error, defaultMessage);
    expect(toast.error).toHaveBeenCalledWith('A generic error occurred');
  });

  it('should display the error.message if error is an object with a message property', () => {
    const error = { message: 'Custom error message' };
    handleError(error, defaultMessage);
    expect(toast.error).toHaveBeenCalledWith('Custom error message');
  });

  it('should display the default message if error does not have a message property', () => {
    const error = {};
    handleError(error, defaultMessage);
    expect(toast.error).toHaveBeenCalledWith(defaultMessage);
  });

  it('should log the error to the console', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const error = new Error('Error for logging');
    handleError(error, defaultMessage);
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    consoleErrorSpy.mockRestore();
  });
});
