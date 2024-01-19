import React from 'react';

import HowWorks from './HowWorks';
import HomeProperties from './HomeProperties';
import Feature3 from './Feature3';
import Feature4 from './Feature4';
import Footer from '../components/Footer';
import NavFeature from '../components/nav-feature';

const LandingPage: React.FC = () => {
  return (
    <div>
      <NavFeature />
      <HowWorks />
      <HomeProperties />
      <Feature3 />
      <Feature4 />
      <Footer />
    </div>
  );
};

export default LandingPage;