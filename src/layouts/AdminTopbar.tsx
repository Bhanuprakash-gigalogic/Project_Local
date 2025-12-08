import React from 'react';
import { useUiStore } from '../store/ui.store';
import { useAuth } from '../hooks/useAuth';
import { Search, Moon, Sun, User as UserIcon, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminTopbar = () => {
    const { theme, setTheme } = useUiStore();
    const { user, logout } = useAuth();

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        // In a real app, this would also update the html class
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <header className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-10">

            {/* Search Placeholder */}
            <div className="flex items-center gap-2 max-w-md w-full">
                <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full h-9 pl-9 pr-4 rounded-md border bg-secondary text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Profile Dropdown Placeholder */}
                <div className="flex items-center gap-3 pl-4 border-l">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-medium">{user?.name || 'Admin User'}</p>
                        <p className="text-xs text-muted-foreground">{user?.email || 'admin@example.com'}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center border">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="rounded-full" />
                        ) : (
                            <UserIcon size={16} />
                        )}
                    </div>

                    <button
                        onClick={() => logout()}
                        className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-full"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminTopbar;
