import EmailIcon from '@mui/icons-material/Email';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import { Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from 'reducers/AuthContext';
import companyLogoWhite from '../assets/images/spo_logo.png';
const Footer: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user, setIntendedDestination } = useAuth();
  const location = useLocation();
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []); // Empty dependency array to run the effect only once during component mount

  const handleDownload = async (documentName: string) => {
    try {
      // Fetch the PDF content from a local file
      const pdfPath = `/assets/documents/${documentName}.pdf`;
      window.open(pdfPath, '_blank');
    } catch (error) {
      console.error('Error fetching or creating PDF:', error);
    }
  };
  const handleProfile = (profile: string) => {
    navigate(`/profileDetails/${profile}`, { replace: true })

  }
  const handleUpdatePassword = (password: string) => {
    navigate(`/profileDetails/${password}`, { replace: true });

  }
  const handleLoginClick = () => {
    setIntendedDestination(location.pathname);
    navigate('/login');
  };
  const handleSignupClick = () => {
    setIntendedDestination(location.pathname);
    navigate('/signup');
  }
  // ... rest of your component code

  return (
    <div className="footer">
      {/* Flex Container */}
      <div className='container flex flex-col justify-between px-6  pb-4 mx-auto space-y-8 md:flex-row md:space-y-0'>
        {/* Logo and social links container */}
        <div className='flex flex-col items-center justify-between space-y-12 md:flex-col md:space-y-0 md:items-start'>
          <div className='cursor-pointer'>
            <img src={companyLogoWhite} className='h-18 pr-10' alt='' />
          </div>
        </div>
        {/* List Container */}
        <div className='flex flex-col space-y-8 md:space-y-0 md:flex-row md:space-x-8'>
          <div className='flex flex-col space-y-1 text-left text-black'>
            <Link to='#' className='font-extrabold mb-4'>
              Invest
            </Link>
            {/* <Link to='#'>How it Works </Link> */}
            <Link to="#" onClick={() => handleDownload("fee")} >Fees</Link>
            <Link to='#' >Developments</Link>
          </div>
        </div>
        <div className='flex flex-col space-y-8 md:space-y-0 md:flex-row md:space-x-8'>
          <div className='flex flex-col space-y-1 text-left text-black'>
            <Link to='#' className='font-extrabold mb-4'>
              Company
            </Link>
            <Link to='#' onClick={() => handleDownload("Disclosure_Notice")} > Disclosure Notice</Link>
            <Link to='#' onClick={() => handleDownload("PSD_FSG_TMD")} >PSD, FSG & TMD</Link>
            <Link to='#' onClick={() => handleDownload("RG46_Schedule_other")}  >RG46 Schedule & other</Link>
            <Link to='#' onClick={() => handleDownload("project")} >Documents</Link>
            <Link to='#' onClick={() => handleDownload("terms_conditions")} > Terms & Conditions</Link>
            <Link to='#' onClick={() => handleDownload("privacy_policy")}>Privacy Policy </Link>
          </div>
          {/* Repeat the structure for other sections */}
        </div>
        {!isLoggedIn && (
          <div className='flex flex-col space-y-8 md:space-y-0 md:flex-row md:space-x-8'>
            <div className='flex flex-col space-y-1 text-left text-black'>
              <Link to='#' className='font-extrabold mb-4'>
                My Accounts
              </Link>

              <>
                <Link to='/login' onClick={() => handleLoginClick()} > Login</Link>
                <Link to='/signup' onClick={() => handleSignupClick()}>Signup </Link>

                {/* <Link to='#'>Forgot Password</Link> */}
              </>


            </div>
          </div>
        )}
        <div className='flex flex-col space-y-8 md:space-y-0 md:flex-row md:space-x-8'>
          <div className='flex flex-col space-y-1 text-left text-black'>
            <Link to='#' className='font-extrabold mb-4'>
              Support
            </Link>
            <Link to='#' >Contact Us</Link>

            <div className='text-blue-500 hover:cursor-auto'>
              <PhoneIphoneIcon/> +61 784235142
            </div>
            <div className='text-blue-500 hover:underline cursor-pointer' >
              <EmailIcon/> <a href="mailto:contact@spomarkets.com?subject=Contact Us Question: General" >contact@spomarkets.com</a>
            </div>
          </div>
       
        </div>
      </div>

      <Divider style={{ background: 'black' }} variant="middle" />
      <p className='w-full text-sm justify-between px-6 text-center text-darkGrayishBlue md:text-left'>
        SPO Markets products are issued by SPO Markets Financial Services Limited (<span className="text-red-600">ABN 12 345 678 901</span>) (<span className="text-red-600">AFSL 123456</span>) (SPO Markets Financial Services).
        The SPO Markets Pty Ltd (<span className="text-red-600">ABN 12 345 678 901</span>) (SPO Markets) is the manager of the SPO Markets Platform (<span className="text-red-600">ARSN 999 999 999</span>).
        SPO Markets is an authorised representative (<span className="text-red-600">No. 001234567</span>) of SPO Markets Financial Services Limited.
        The advice provided in relation to the SPO Markets Platform and Blocks, including on this website, is general advice only and has been prepared without
        taking into account your objectives, financial situation, or needs. Before making any decision in relation to the SPO Markets Platform or Blocks,
        you should read the Product Disclosure Statement (PDS) and consider whether they are right for you. The PDS is available at SPO <a href="https://www.markets.com/pds"
          className="text-blue-500 hover:underline"
          onClick={() => handleDownload('PDS_File')}
        >
          Marktes.com/pds
        </a>
        . Past performance is no indication of future performance. Any forecasts are subject to change without notice. Income and capital returns are not guaranteed.
        By accessing and using this website, you agree to be bound by our terms and conditions. Terms and Conditions. Copyright © 2024 The SPO Markets Pty Ltd (<span className="text-red-600">ABN 12 345 678 901</span>). All rights reserved.
      </p>
    </div>
  );
};

export default Footer;