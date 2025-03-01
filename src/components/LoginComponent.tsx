import InputWithLabel from './InputWithLabel'; // Adjust the path as necessary
import SimpleInput from './SimpleInput';
import WhiteButton from './WhiteButton';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/apiService';
import { useAuth } from '../context/AuthContext';

const LoginComponent = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await login(identifier, password);
      console.log("response", response); // Log the entire response object
      const token = response.token; // Assuming the token is returned in response.token
      console.log("token", token);
      authLogin(token); // Store the token and update the authentication state
      setLoginError('');
      navigate('/'); // Redirect to HomeLayout
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('Invalid login credentials');
    }
  };

  return (
    <div className="w-[500px] h-[750px] dark:bg-gray-900 bg-white flex flex-col justify-between items-center py-10 max-sm:w-[400px] max-[420px]:w-[320px] max-sm:h-[750px]">
      <div className="flex flex-col items-center gap-10">
        <h2 className="text-2xl dark:text-whiteSecondary text-blackPrimary font-medium max-sm:text-xl">
          Welcome to the dashboard!
        </h2>
        <div className="w-full flex flex-col gap-5">
          <InputWithLabel label="Identifier">
            <SimpleInput type="identifier" placeholder="Enter a email..." value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
          </InputWithLabel>

          <InputWithLabel label="Password">
            <SimpleInput type="password" placeholder="Enter a password..." value={password} onChange={(e) => setPassword(e.target.value)} />
          </InputWithLabel>
        </div>
        {loginError && (
          <p className="text-red-500 text-base max-sm:text-sm">
            {loginError}
          </p>
        )}
        <WhiteButton
          link="#"
          textSize="lg"
          width="full"
          py="2"
          text="Login now"
          onClick={handleLogin}
        ></WhiteButton>
      </div>
    </div>
  );
};

export default LoginComponent;