import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../utils/auth';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to appropriate page
    if (isAuthenticated()) {
      if (isAdmin()) {
        navigate('/super-admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  return <LoginForm />;
};

export default LoginPage;
