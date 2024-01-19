import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Menu, MenuItem } from '@mui/material';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { AxiosResponse } from 'axios';
import { useCart } from 'property/cart/CartContext';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from 'reducers/AuthContext';
import profile from '../assets/images/profile.png';
import companyLogo from '../assets/images/spo_logo.png';
import { apiURL } from '../enviornment';
import axiosInstance from '../utils/intercepter';
import { User } from '../utils/models/User';

interface LinkItem {
  name: string;
  link: string;
}
interface SuccessMessage {
  messageType: string;
  message: string;
}

interface ApiResponse {
  data: {
    user: User;
  };
  errorMsg: any[]; // Change this to a more specific type if needed
  successMsgList: SuccessMessage[];
}

interface CartResponse {
  data: {
    CartSummary: any[];
  };
  errorMsg: any[]; // Change this to a more specific type if needed
  successMsgList: SuccessMessage[];
}
const Navbar: React.FC = () => {
  const { dispatch } = useCart();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isTopNavCollapse, setTopNavCollapse] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [itemCount, setItemCount] = useState<number>(0);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const location = useLocation();
  const { state } = useCart();
  const { user, setIntendedDestination } = useAuth();
  const mobileHeaderStyle = {
    backgroundColor: '#f1f9fc',
  };

  const [links, setLinks] = useState<LinkItem[]>([
    { name: 'Home', link: '/' },
    { name: 'How it works', link: '/#how-ifs-works' },
    { name: 'Project', link: '/propertyList' },
    { name: 'About Us', link: '/' },
  ]);


  const getCartSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const userName = localStorage.getItem("username");
      const response: AxiosResponse<CartResponse> = await axiosInstance.get(apiURL + '/userCart/summary/' + userName, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const { successMsgList } = response.data;

      if (successMsgList != null && successMsgList.length > 0) {
          setItemCount(state.totalItems);
      } else {
      

      }
      // Assuming the response contains the data property
      console.log(response.data);
      // Additional actions or logic based on the response data can be added here

      console.log(response);
    } catch (error) {
      console.error('Error fetching property data:', error);
      // Handle the error, e.g., display an error message to the user
    }
  };
  const handleLoginClick = () => {
    setIntendedDestination(location.pathname);
    navigate('/login');
  };
  const handleSignupClick = () => {
    setIntendedDestination(location.pathname);
    navigate('/signup');
  }
  useEffect(() => {
    setIsLoggedIn(!!token);
    const container = document.body;


    if (!isLoggedIn) {
      return;
    }

    const fetchData = async () => {
      try {
        if (!username || !token) {
          // Handle the case where username or token is missing
          return;
        }

        const response = await axiosInstance.get(apiURL + '/user/userDetail/' + username, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const {  successMsgList, data } = response.data;

        if (successMsgList != null && successMsgList.length > 0) {
          setUserData(data.user);
          localStorage.setItem("firstName", data.user.firstName);
          localStorage.setItem("lastName", data.user.lastName);
          localStorage.setItem("userKyc", data.user.kycVerification);
          localStorage.setItem("kycVerificationBlocked", data.user.kycVerificationBlocked);
        } else {
          
        }

        console.log(response);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    if (isLoggedIn) {
      fetchData();
      getCartSummary();
    }


    const handleScroll = () => {

    };

    container.addEventListener('ps-scroll-y', handleScroll);
    setLinks((prevLinks) =>
      isLoggedIn
        ? prevLinks.filter((link) => link.name !== 'Login' && link.name !== 'Sign Up')
        : prevLinks
    );

    return () => {


    };


  }, [isLoggedIn, username, token, setTopNavCollapse, setLinks]);
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    // Clear the token and update the isLoggedIn state
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login', { replace: true });
    handleCloseMenu();
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleCart = () => {
    navigate('/cart', { replace: true });
  };
  const Home = () => {
    navigate('/', { replace: true });
  }
  const handleProfile = (profile: string) => {
    navigate(`/profileDetails/${profile}`, { replace: true })
    handleCloseMenu();
  }
  const handleUpdatePassword = (password: string) => {
    navigate(`/profileDetails/${password}`, { replace: true });
    handleCloseMenu();
  }
  const handleHowItWorksClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === '/') {
      event.preventDefault();
      const targetId = 'howitworks';
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
      
    } else {
      navigate('/');
      event.preventDefault();
      const targetId = 'howitworks';
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth',
        block: 'start', // align to the top of the viewport
        inline: 'nearest' });
      }
    }
  };
  return (
    <nav className={`w-full navbar fixed-top top-nav-collapse  ${isTopNavCollapse ? 'top-nav-collapse' : ''}`}>
      {/* Flex Container */}
      <div className='md:pl-6 md:pr-6 mx-auto'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <div className='pt-2 cursor-pointer ' onClick={Home} >
            <img src={companyLogo} alt='' className='w-12 md:w-16 lg:w-16' />
          </div>
          {/* Menu Items */}
          <div className='hidden space-x-6 md:flex'>
            <ul className="flex">
              {links.map((link, index) => (
                <li key={index} className="mr-4">
                  {link.name === 'How it works' ? (
                    // Custom logic for "How it works" link
                    <a
                      
                      className="nav-link page-scroll cursor-pointer"
                      onClick={(event) => handleHowItWorksClick(event)}
                    >
                      {link.name}
                    </a>
                  ) : (
                    // Normal link behavior for other links
                    <Link to={link.link} className="nav-link page-scroll cursor-pointer">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
              {!isLoggedIn && (
                <div className='flex'>

                  <button className='nav-link page-scroll' onClick={handleLoginClick}>Login</button>
                  <button className='nav-link page-scroll' onClick={handleSignupClick}>Sign Up</button>
                </div>

              )}



              {isLoggedIn && (
                <div className='flex'>
                  <li className='relative group'>
                    {<IconButton
                      edge='start'
                      color="inherit"
                      aria-label="cart"
                    >
                      <Badge badgeContent={state.totalItems} color="error">
                        <ShoppingCartIcon onClick={handleCart} />
                      </Badge>
                    </IconButton>}
                  </li>
                  <li className="relative group" >

                    <div ref={dropdownRef}>
                      <span onClick={handleOpenMenu} className=" transition duration-300 cursor-pointer">
                        <img
                          src={profile} // Replace with your actual profile image source
                          alt="Profile"
                          className="w-8 h-8 rounded-full inline-block"
                        />
                        <span className="ml-2">{userData?.firstName} </span>
                      </span>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        classes={{ paper: 'bg-white border rounded shadow-md' }}

                      >
                        <MenuItem>
                          <button
                            className='block px-4 py-2 text-sm text-gray-700'
                            onClick={() => handleProfile('profile')}>
                            Profile
                          </button>
                        </MenuItem>
                        <MenuItem>
                          <button
                            className='block px-4 py-2 text-sm text-gray-700'
                            onClick={() => handleUpdatePassword('password')}>
                            Update Password
                          </button>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                          <span className='block px-4 py-2 text-sm text-gray-700'>Logout</span>
                        </MenuItem>
                      </Menu>
                    </div>

                  </li>
                </div>

              )}
            </ul>
          </div>

          {/* Hamburger Icon */}

          <button
            className={
              toggleMenu
                ? 'open block hamburger md:hidden focus:outline-none'
                : 'block hamburger md:hidden focus:outline-none'
            }
            onClick={() => setToggleMenu(!toggleMenu)}
          >
            <span className='hamburger-top'></span>
            <span className='hamburger-middle'></span>
            <span className='hamburger-bottom'></span>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className='md:hidden' >
        {isLoggedIn && (
          <div>
            {<IconButton
              edge='start'
              color="inherit"
              aria-label="cart"
            >
              <Badge badgeContent={state.totalItems} color="error">
                <ShoppingCartIcon onClick={handleCart} />
              </Badge>
            </IconButton>}
          </div>
        )}
        <div style={mobileHeaderStyle}
          className={
            toggleMenu
              ? 'absolute flex flex-col items-center self-end py-8 mt-2 space-y-6 font-bold  rounded-lg sm:w-auto sm:self-center left-0 right-0 drop-shadow-md'
              : 'absolute flex-col items-center hidden self-end py-8 mt-2 space-y-6 font-bold  rounded-lg sm:w-auto sm:self-center left-0 right-0 drop-shadow-md'
          }
        >
          <ul className="block">
            {links.map((link, index) => (
              <li key={index} className="mr-4">
                <Link
                  to={link.link}
                  className="nav-link page-scroll"
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {!isLoggedIn && (
              <div className='grid'>
                <button className='nav-link page-scroll' onClick={handleLoginClick}>Login</button>
                <button className='nav-link page-scroll' onClick={handleSignupClick}>Sign Up</button>
              </div>

            )}
            {isLoggedIn && (
              <li className="relative group" >
                <div ref={dropdownRef}>
                  <span onClick={handleOpenMenu} className=" transition duration-300 cursor-pointer">
                    <img
                      src={profile} // Replace with your actual profile image source
                      alt="Profile"
                      className="w-8 h-8 rounded-full inline-block"
                    />
                    <span className="ml-2">{userData?.firstName} </span>
                  </span>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    classes={{ paper: 'bg-white border rounded shadow-md' }}

                  >
                    <MenuItem>
                      <button
                        className='block px-4 py-2 text-sm text-gray-700'
                        onClick={() => handleProfile('profile')}>
                        Profile
                      </button>
                    </MenuItem>
                    <MenuItem>
                      <button
                        className='block px-4 py-2 text-sm text-gray-700'
                        onClick={() => handleUpdatePassword('password')}>
                        Update Password
                      </button>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <span className='block px-4 py-2 text-sm text-gray-700'>Logout</span>
                    </MenuItem>
                  </Menu>
                </div>

              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;