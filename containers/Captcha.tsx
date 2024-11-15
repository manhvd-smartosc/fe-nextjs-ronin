import { useState } from 'react';
import { Button } from '@chakra-ui/react';
import Captcha from '@/components/Capcha';
import { API_URL } from '@/constants';

const CaptchaContainer: React.FC = () => {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!captchaToken) {
      alert('Please complete the CAPTCHA.');
      return;
    }

    const response = await fetch(API_URL.VERIFY_CAPTCHA, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: captchaToken }),
    });
    const data = await response.json();

    if (data?.success) {
      alert('Form submitted successfully!');
    } else {
      alert('CAPTCHA verification failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Next.js Turnstile CAPTCHA</h1>
      <Captcha onVerify={handleCaptchaVerify} />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default CaptchaContainer;
