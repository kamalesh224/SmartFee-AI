// agent-notes: { ctx: "Student login page delegating to unified simple LoginPage portal", deps: ["src/types.ts", "./LoginPage.tsx"], state: active, last: "antigravity@2026-08-18" }
import React from 'react';
import type { User, AIRiskPrediction } from '../types';
import { LoginPage } from './LoginPage';

interface StudentLoginPageProps {
  onLogin: (user: User) => void;
  onSwitchToAdmin: () => void;
  registeredStudents?: AIRiskPrediction[];
}

export const StudentLoginPage: React.FC<StudentLoginPageProps> = ({
  onLogin,
  registeredStudents,
}) => {
  return (
    <LoginPage
      initialRole="student"
      onLogin={(_role, user) => {
        if (user) onLogin(user);
      }}
      registeredStudents={registeredStudents}
    />
  );
};

export default StudentLoginPage;
