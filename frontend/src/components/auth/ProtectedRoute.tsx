import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { createLoginRedirect } from '../../lib/auth';
import { useMockAuth } from '../../hooks/useMockAuth';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const location = useLocation();
    const { isAuthenticated, isLoading } = useMockAuth();

    if (isLoading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate replace to={createLoginRedirect(`${location.pathname}${location.search}`)} />;
    }

    return children;
};

export default ProtectedRoute;
