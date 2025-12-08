import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUiStore } from '../store/ui.store';
import {
    LayoutDashboard,
    Users,
    Store,
    Package,
    ShoppingCart,
    Receipt,
    Wallet,
    FileText,
    BarChart2,
    Megaphone,
    Settings,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const AdminSidebar = () => {
    const { sidebarOpen, toggleSidebar } = useUiStore();

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
        { path: '/admin/users', label: 'Users', icon: Users },
        { path: '/admin/sellers', label: 'Sellers', icon: Store },
        { path: '/admin/products', label: 'Products', icon: Package },
        { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
        { path: '/admin/refunds', label: 'Refunds', icon: Receipt },
        { path: '/admin/payouts', label: 'Payouts', icon: Wallet },
        { path: '/admin/cms', label: 'CMS', icon: FileText },
        { path: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
        { path: '/admin/campaigns', label: 'Campaigns', icon: Megaphone },
        { path: '/admin/settings/rbac', label: 'Settings', icon: Settings },
    ];

    return (
        <aside
            className={`
        flex flex-col border-r bg-card transition-all duration-300 h-screen sticky top-0
        ${sidebarOpen ? 'w-64' : 'w-16'}
      `}
        >
            <div className="h-16 flex items-center justify-between px-4 border-b">
                {sidebarOpen && <span className="font-bold text-xl truncate">Admin Panel</span>}
                <button
                    onClick={toggleSidebar}
                    className="p-1 hover:bg-secondary rounded-md"
                >
                    {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-2">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                end={item.exact}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors
                  ${isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                    }
                `}
                            >
                                <item.icon size={20} />
                                {sidebarOpen && <span className="truncate">{item.label}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {sidebarOpen && (
                <div className="p-4 text-xs text-muted-foreground border-t">
                    v1.0.0
                </div>
            )}
        </aside>
    );
};

export default AdminSidebar;
