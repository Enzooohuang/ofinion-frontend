import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';

const JoinFree = ({ onLogin, axiosInstance, baseUrl }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        `${baseUrl}/api/user/email-signup/`,
        {
          email,
          password,
          given_name: firstName,
          family_name: lastName,
        }
      );
      onLogin(response.data);
      navigate('/');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleGoogleSignupSuccess = (userData) => {
    onLogin(userData);
    navigate('/');
  };

  return (
    <div>
      <h2>Join Free</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder='First Name'
          required
        />
        <input
          type='text'
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder='Last Name'
          required
        />
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
        <button type='submit'>Sign Up</button>
      </form>
      <GoogleLoginButton
        onSuccess={handleGoogleSignupSuccess}
        buttonText='Sign up with Google'
        axiosInstance={axiosInstance}
        baseUrl={baseUrl}
      />
    </div>
  );
};

export default JoinFree;
