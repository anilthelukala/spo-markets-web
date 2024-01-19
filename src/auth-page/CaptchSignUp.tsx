import React from 'react';
import SignUp from './signup/SignUp';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { reCaptchaKey } from 'enviornment';

const CaptchSignUp: React.FC = () => {
  return (
    <div>
      <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey}>
      <SignUp />
      </GoogleReCaptchaProvider>
    </div>
  );
};

export default CaptchSignUp;