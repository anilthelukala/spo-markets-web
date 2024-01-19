import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from 'reducers/AppContext';
import smart_invester from '../assets/images/smart_invester.jpg';
const Feature4: React.FC = () => {
  const { dispatch } = useAppContext();
  const navigate = useNavigate();
  const tokenStorage = localStorage.getItem('token')
  const [emailValue, setEmailValue] = useState('');
  const containerStyle = {
    backgroundImage: `url(${smart_invester})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    height: '400px',
    // Add other background-related styles if needed, such as backgroundSize, backgroundPosition, etc.
  };
  const handleSignUpClick = () => {
    const tempEmail = emailValue; // Set your single value here

    dispatch({ type: 'SET_EMAIL', payload: tempEmail });
    navigate(`/signup`);
  };
  return (
    <section id='Feature4' className='' style={containerStyle}>
    {/* Flex Container */}
    <div className='container flex flex-col-reverse items-center px-6 mx-auto space-y-0 md:space-y-0 md:flex-row'>
      <div className="border-t-8 bg-white mt-32 rounded-lg border-primaryBtn p-4 w-full md:w-1/2">
        <h2 className='max-w-md text-3xl pt-4 pb-4 font-extrabold text-start'>
          Create your portfolio with SPO Markets today
        </h2>

        {/* Conditional rendering based on tokenStorage */}
        {!tokenStorage && (
          <div className='flex flex-col md:flex-row items-center md:items-start'>
            <TextField
              id="outlined-size-small"
              placeholder="Email Address"
              size='small'
              onChange={(e) => setEmailValue(e.target.value)}
              value={emailValue}
              className='mb-4 md:mr-4'
            />
            <button
              onClick={handleSignUpClick}
              className='p-2 px-6 md:ml-4 mt-4 md:mt-0 text-white bg-primaryBtn rounded-md baseline hover:bg-primaryHoverBtn'
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  </section>
  );
};

export default Feature4;
