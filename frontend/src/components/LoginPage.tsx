import React, { useState } from 'react';
import type { UserRole, User, AIRiskPrediction } from '../types';
import { StudentLoginPage } from './StudentLoginPage';
import { AdminLoginPage } from './AdminLoginPage';

interface LoginPageProps {
  onLogin: (role: UserRole, user?: User) => void;
  initialRole?: UserRole;
  registeredStudents?: AIRiskPrediction[];
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  initialRole = 'student',
  registeredStudents,
}) => {
  const [activePortal, setActivePortal] = useState<UserRole>(initialRole);

  const handleStudentLogin = (user: User) => {
    onLogin('student', user);
  };

  const handleAdminLogin = (user: User) => {
    onLogin('admin', user);
  };

  if (activePortal === 'admin') {
    return (
      <AdminLoginPage
        onLogin={handleAdminLogin}
        onSwitchToStudent={() => setActivePortal('student')}
      />
    );
  }

  return (
    <StudentLoginPage
      onLogin={handleStudentLogin}
      onSwitchToAdmin={() => setActivePortal('admin')}
      registeredStudents={registeredStudents}
    />
  );
};

export default LoginPage;
