import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleLoginButton = ({ onSuccess, buttonText }) => {
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const accessToken = tokenResponse.access_token;
        const response = await fetch(
          'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }

        const userInfo = await response.json();
        console.log('User Info:', userInfo);

        const result = await axios.post(
          'http://localhost:8000/api/user/google-login/',
          {
            email: userInfo.email,
            family_name: userInfo.family_name,
            given_name: userInfo.given_name,
          },
          {
            // withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('Result:', result.data);
        onSuccess(result.data);
      } catch (error) {
        console.error('Error with Google login:', error);
      }
    },
    onError: () => {
      console.error('Google Sign-In Error');
    },
  });

  return <button onClick={() => googleLogin()}>{buttonText}</button>;
};

export default GoogleLoginButton;
