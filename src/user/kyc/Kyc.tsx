import React from 'react';
import SmartUiKyc from './SmartUiKyc';
import useScript from 'hooks/useScript';


const Kyc: React.FC = () => {
    useScript('https://assets.frankiefinancial.io/onboarding/v4/ff-onboarding-widget.umd.js');
  return (
    <div>
      <SmartUiKyc />
    </div>
  );
};

export default Kyc;