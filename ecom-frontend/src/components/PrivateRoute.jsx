import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = ({ publicPage = false, adminOnly = false }) => {
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");
    const isSeller = user && user?.roles?.includes("ROLE_SELLER");
    const location = useLocation();

    // For public pages (login, register) - redirect to home if already logged in
    if (publicPage) {
        return user ? <Navigate to="/" /> : <Outlet />
    }

    // Check if user is logged in
    if (!user) {
        return <Navigate to="/login" />;
    }

    // For admin-only pages
    if (adminOnly) {
        // Check if user is admin or seller
        if (!isAdmin && !isSeller) {
            return <Navigate to="/" replace />
        }

        // If seller (not admin), check allowed paths
        if (isSeller && !isAdmin) {
            const sellerAllowedPaths = ["/admin/orders", "/admin/products"];
            const sellerAllowed = sellerAllowedPaths.some(path => 
                location.pathname.startsWith(path)
            );
            if (!sellerAllowed) {
                return <Navigate to="/" replace />
            }
        }
    }
    
    // For regular protected routes (checkout, order-success, etc.)
    return <Outlet />;
}

export default PrivateRoute