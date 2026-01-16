import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ErrorBoundary } from 'react-error-boundary';
import Navbar from '../components/Navbar';
import ErrorFallback from '../components/ErrorFallback';

// --- Public Pages (Updated Imports) ---
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import ForgotPassword from '../pages/public/ForgotPassword';
import ResetPassword from '../pages/public/ResetPassword';
import ErrorPage from '../pages/public/ErrorPage'; // <--- Import this!
import ShipList from '../pages/public/ShipList';   // Assuming you moved this too, or check path

// --- Internal Pages ---
import ShipDetail from '../pages/public/ShipDetail'; // Check path
import DashboardLayout from '../layouts/DashboardLayout';
import UserShips from '../pages/dashboard/UserShips';
import CreateShip from '../pages/admin/CreateShip';
import EditShip from '../pages/dashboard/EditShip';
import BuyShip from '../pages/dashboard/BuyShip';

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    return user?.role_id === 1 ? children : <Navigate to="/dashboard/userships" />;
};

export default function AppRouter() {
    return (
        <>
            <Navbar />
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/ships" element={<ShipList />} />
                    <Route path="/ships/:id" element={<ShipDetail />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Dashboard Routes (Protected) */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }>
                        <Route path="userships" element={<UserShips />} />
                        <Route path="edit-ship/:id" element={<EditShip />} />
                        <Route path="buy-ship" element={<BuyShip />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <AdminRoute>
                                <DashboardLayout />
                            </AdminRoute>
                        </ProtectedRoute>
                    }>
                        <Route path="create-ship" element={<CreateShip />} />
                    </Route>

                    {/* Fallback - UPDATED to show ErrorPage instead of redirecting */}
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </ErrorBoundary>
        </>
    );
}