import React from 'react';
import type { UserRole, User } from '../types';
import { LoginPage } from './LoginPage';

interface LoginModalProps {
  onLogin: (role: UserRole, user?: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLogin }) => {
  return <LoginPage onLogin={onLogin} />;
};

export default LoginModal;
