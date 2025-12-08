import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-secondary/20">
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                <AdminTopbar />

                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
