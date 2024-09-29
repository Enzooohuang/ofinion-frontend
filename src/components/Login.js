import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';

const Login = ({ onLogin, axiosInstance, baseUrl }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        `${baseUrl}/api/user/email-login/`,
        {
          email,
          password,
        }
      );
      if (response.data) {
        onLogin(response.data);
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleGoogleLoginSuccess = (userData) => {
    onLogin(userData);
    navigate('/');
  };

  return (
    <div>
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
          required
        />
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          required
        />
        <button type='submit'>Log In</button>
      </form>
      <GoogleLoginButton
        onSuccess={handleGoogleLoginSuccess}
        buttonText='Log in with Google'
        axiosInstance={axiosInstance}
        baseUrl={baseUrl}
      />
    </div>
  );
};

export default Login;
