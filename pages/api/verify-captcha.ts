import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token } = req.body;

  const secretKey = process.env.NEXT_CAPTCHA_SECRET_KEY || '';
  const verifyUrl = process.env.NEXT_CAPTCHA_VERIFY_URL || '';

  try {
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: secretKey, response: token }),
    });

    const data = await response.json();

    if (data.success) {
      return res
        .status(200)
        .json({ success: 1, message: 'CAPTCHA verified successfully' });
    } else {
      return res
        .status(400)
        .json({ success: 0, message: 'CAPTCHA verification failed' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
}
