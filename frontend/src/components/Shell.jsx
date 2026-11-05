import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import {
    Boxes,
    LayoutDashboard,
    Package,
    Settings,
    LogOut
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export default function Shell() {

    const { user, logout } = useAuth();
    const nav = useNavigate();

    // Navigation Links
    const links = [
        ['Dashboard', '/', LayoutDashboard],
        ['Products', '/products', Package],
        ['Settings', '/settings', Settings]
    ];

    return (
        <div className="min-h-screen md:flex">

            {/* Sidebar */}
            <aside className="bg-[#111b35] text-white md:w-64 md:min-h-screen p-5 flex md:flex-col justify-between gap-5">

                <div>

                    {/* Logo */}
                    <div className="flex items-center gap-3 text-xl font-bold mb-10">

                        <span className="bg-blue-500 rounded-lg p-2">
                            <Boxes size={21} />
                        </span>

                        StockFlow

                    </div>

                    {/* Navigation */}
                    <nav className="flex md:flex-col gap-2">

                        {links.map(([name, to, Icon]) => (

                            <NavLink
                                key={to}
                                to={to}
                                end
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-3 rounded-lg text-sm ${
                                        isActive
                                            ? 'bg-white/15 text-white'
                                            : 'text-slate-300 hover:bg-white/10'
                                    }`
                                }
                            >
                                <Icon size={18} />
                                {name}

                            </NavLink>

                        ))}

                    </nav>

                </div>

                {/* User Profile and Logout */}
                <div className="flex items-center justify-between md:block">

                    <div className="text-sm">

                        <div className="font-semibold truncate">
                            {user?.organizationName}
                        </div>

                        <div className="text-slate-400 text-xs truncate">
                            {user?.email}
                        </div>

                    </div>

                    {/* Sign Out Button */}
                    <button
                        onClick={() => {
                            logout();
                            nav('/login');
                        }}
                        className="mt-3 flex gap-2 items-center text-sm text-slate-300 hover:text-white"
                    >
                        <LogOut size={16} />
                        Sign out
                    </button>

                </div>

            </aside>

            {/* Main Content */}
            <main className="flex-1 p-5 md:p-9 max-w-[1500px] mx-auto w-full">

                <Outlet />

            </main>

        </div>
    );
}