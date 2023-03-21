import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, currentUserClaims } from './firebase';

const GuardedRoute: React.FunctionComponent<any> = ({ children }) => {
    const [user, loading] = useAuthState(auth);

    if (loading) {
      return;
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (!(currentUserClaims.role === 'admin' || currentUserClaims.role === 'owner' || currentUserClaims.role === 'staff')) {
      return <Navigate to="/login" replace />;
    }
    
    return children;
  };

export default GuardedRoute;