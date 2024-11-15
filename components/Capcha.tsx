import Turnstile from 'react-turnstile';

interface CaptchaProps {
  onVerify: (token: string) => void;
}

const CAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY || '';

const Captcha: React.FC<CaptchaProps> = ({ onVerify }) => {
  const handleVerify = (token: string) => {
    onVerify(token);
  };

  return (
    <div>
      <Turnstile
        sitekey={CAPTCHA_SITE_KEY}
        onSuccess={handleVerify}
        theme="light"
      />
    </div>
  );
};

export default Captcha;
