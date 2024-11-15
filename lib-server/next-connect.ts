import { NextApiRequest, NextApiResponse } from 'next';
import ApiError, { handleApiError, handleSsrError } from './errors/apiError';
import nc from 'next-connect';

export const ncOptions = {
  onError(error: Error, req: NextApiRequest, res: NextApiResponse) {
    handleApiError(error, req, res);
  },
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    const error = new ApiError(`Method '${req.method}' not allowed`, 405);
    //not in api, handle it manually
    handleApiError(error, req, res);
  },
};

/**
 * single instance must be default exported from file
 */
export const apiHandler = () => {
  return nc<NextApiRequest, NextApiResponse>(ncOptions);
};

// ---------- getServerSideProps error handler

export type NextApiRequestWithResult<T> = NextApiRequest & { result: T };

export default nc;
