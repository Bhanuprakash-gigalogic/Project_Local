import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import { Loader2 } from 'lucide-react';
import RequireAuth from '../features/auth/components/RequireAuth';

// Feature Screens
const AdminLogin = lazy(() => import('../features/admin-setup/screens/AdminLogin'));
const Dashboard = lazy(() => import('../features/dashboard/screens/Dashboard'));
const AdminSetupWizard = lazy(() => import('../features/admin-setup/screens/AdminSetupWizard'));
const ZonesList = lazy(() => import('../features/zones/screens/ZonesList'));
const ZonesMapEditor = lazy(() => import('../features/zones/screens/ZonesMapEditor'));
const ZoneSellerAllocation = lazy(() => import('../features/zones/screens/ZoneSellerAllocation'));
const ZoneDetail = lazy(() => import('../features/zones/screens/ZoneDetail'));
const StoresList = lazy(() => import('../features/stores/screens/StoresList'));
const StoreDetail = lazy(() => import('../features/stores/screens/StoreDetail'));
const AllocateSellers = lazy(() => import('../features/stores/screens/AllocateSellers'));
const CategoriesTree = lazy(() => import('../features/categories/screens/CategoriesTree'));
const UsersList = lazy(() => import('../features/users/screens/UsersList'));
const SellerApprovals = lazy(() => import('../features/sellers/screens/SellerApprovals'));
const ProductApprovals = lazy(() => import('../features/products/screens/ProductApprovals'));
const OrdersList = lazy(() => import('../features/orders/screens/OrdersList'));
const RefundsList = lazy(() => import('../features/refunds/screens/RefundsList'));
const CommissionsPayouts = lazy(() => import('../features/payouts/screens/CommissionsPayouts'));
const CMSHome = lazy(() => import('../features/cms/screens/CMSHome'));
const AnalyticsSales = lazy(() => import('../features/analytics/screens/AnalyticsSales'));
const CampaignsList = lazy(() => import('../features/campaigns/screens/CampaignsList'));
const BannersList = lazy(() => import('../features/banners/screens/BannersList'));
const BannerDetail = lazy(() => import('../features/banners/screens/BannerDetail'));
const Module13List = lazy(() => import('../features/module-13/screens/Module13List'));
const Module13Detail = lazy(() => import('../features/module-13/screens/Module13Detail'));
const Module14List = lazy(() => import('../features/module-14/screens/Module14List'));
const Module14Detail = lazy(() => import('../features/module-14/screens/Module14Detail'));
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
                {/* Public Route - Login */}
                <Route path="/login" element={<Navigate to="/admin/login" replace />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Protected Admin Routes */}
                <Route element={<RequireAuth />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/" element={<Navigate to="/admin" replace />} />

                        <Route path="/admin">
                            <Route index element={<Dashboard />} />
                            <Route path="setup" element={<AdminSetupWizard />} />
                            <Route path="zones" element={<ZonesList />} />
                            <Route path="zones/create" element={<ZonesMapEditor />} />
                            <Route path="zones/:zoneId" element={<ZoneDetail />} />
                            <Route path="zones/:zoneId/edit" element={<ZonesMapEditor />} />
                            <Route path="zones/:zoneId/sellers" element={<ZoneSellerAllocation />} />
                            <Route path="stores" element={<StoresList />} />
                            <Route path="stores/:storeId" element={<StoreDetail />} />
                            <Route path="stores/:storeId/allocate" element={<AllocateSellers />} />
                            <Route path="categories" element={<CategoriesTree />} />
                            <Route path="users" element={<UsersList />} />
                            <Route path="sellers" element={<SellerApprovals />} />
                            <Route path="products" element={<ProductApprovals />} />
                            <Route path="orders" element={<OrdersList />} />
                            <Route path="refunds" element={<RefundsList />} />
                            <Route path="payouts" element={<CommissionsPayouts />} />
                            <Route path="cms" element={<CMSHome />} />
                            <Route path="analytics" element={<AnalyticsSales />} />
                            <Route path="campaigns" element={<CampaignsList />} />
                            <Route path="banners" element={<BannersList />} />
                            <Route path="banners/:bannerId" element={<BannerDetail />} />
                            <Route path="module-13" element={<Module13List />} />
                            <Route path="module-13/:id" element={<Module13Detail />} />
                            <Route path="module-14" element={<Module14List />} />
                            <Route path="module-14/:id" element={<Module14Detail />} />

                            <Route path="settings/rbac" element={<RolesList />} />
                            <Route path="settings/rbac/:roleId" element={<RolePermissions />} />
                        </Route>
                    </Route>
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
        </Suspense>
    );
};

export default AdminRoutes;
