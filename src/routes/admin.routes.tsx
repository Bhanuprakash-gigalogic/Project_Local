import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import { Loader2 } from 'lucide-react';

// Feature Screens
const Dashboard = lazy(() => import('../features/dashboard/screens/Dashboard'));
const UsersList = lazy(() => import('../features/users/screens/UsersList'));
const SellerApprovals = lazy(() => import('../features/sellers/screens/SellerApprovals'));
const ProductApprovals = lazy(() => import('../features/products/screens/ProductApprovals'));
const OrdersList = lazy(() => import('../features/orders/screens/OrdersList'));
const RefundsList = lazy(() => import('../features/refunds/screens/RefundsList'));
const CommissionsPayouts = lazy(() => import('../features/payouts/screens/CommissionsPayouts'));
const CMSHome = lazy(() => import('../features/cms/screens/CMSHome'));
const AnalyticsSales = lazy(() => import('../features/analytics/screens/AnalyticsSales'));
const CampaignsList = lazy(() => import('../features/campaigns/screens/CampaignsList'));
const RolesList = lazy(() => import('../features/rbac/screens/RolesList'));
const RolePermissions = lazy(() => import('../features/rbac/screens/RolePermissions'));

// Loading fallback
const PageLoader = () => (
    <div className="flex h-full w-full items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
);

const AdminRoutes = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route element={<AdminLayout />}>
                    <Route path="/" element={<Navigate to="/admin" replace />} />

                    <Route path="/admin">
                        <Route index element={<Dashboard />} />
                        <Route path="users" element={<UsersList />} />
                        <Route path="sellers" element={<SellerApprovals />} />
                        <Route path="products" element={<ProductApprovals />} />
                        <Route path="orders" element={<OrdersList />} />
                        <Route path="refunds" element={<RefundsList />} />
                        <Route path="payouts" element={<CommissionsPayouts />} />
                        <Route path="cms" element={<CMSHome />} />
                        <Route path="analytics" element={<AnalyticsSales />} />
                        <Route path="campaigns" element={<CampaignsList />} />

                        <Route path="settings/rbac" element={<RolesList />} />
                        <Route path="settings/rbac/:roleId" element={<RolePermissions />} />
                    </Route>
                </Route>

                {/* 404 Route could be added here */}
                <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
        </Suspense>
    );
};

export default AdminRoutes;
