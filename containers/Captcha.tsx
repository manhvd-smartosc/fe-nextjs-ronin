import { useState } from 'react';
import { Button } from '@chakra-ui/react';
import Captcha from '@/components/Capcha';
import api from '@/apis';

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

    const data = await api.auth.verifyCaptcha({ token: captchaToken });

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
