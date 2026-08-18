// agent-notes: { ctx: "Admin login page delegating to unified simple LoginPage portal", deps: ["src/types.ts", "./LoginPage.tsx"], state: active, last: "antigravity@2026-08-18" }
import React from 'react';
import type { User } from '../types';
import { LoginPage } from './LoginPage';

interface AdminLoginPageProps {
  onLogin: (user: User) => void;
  onSwitchToStudent: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin }) => {
  return (
    <LoginPage
      initialRole="admin"
      onLogin={(_role, user) => {
        if (user) onLogin(user);
      }}
    />
  );
};

export default AdminLoginPage;
