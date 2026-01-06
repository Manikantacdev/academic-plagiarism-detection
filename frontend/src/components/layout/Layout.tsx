import React from 'react';
import { Home, FileText, BarChart2, Shield, Menu, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

interface LayoutProps {
    children: React.ReactNode;
    onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
    const userInfo = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/10 selection:text-primary">
                {/* Sidebar */}
                <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border hidden md:flex flex-col">
                    <div className="p-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-landing-blue/20 flex items-center justify-center text-landing-blue">
                                <Shield size={20} strokeWidth={2.5} />
                            </div>
                            <span className="font-serif font-bold text-lg tracking-tight text-white">AcademicGuard</span>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 space-y-1 mt-6">
                        <div>
                            <NavItem
                                icon={<Home size={20} />}
                                label="Dashboard"
                                active={location.pathname === '/'}
                                onClick={() => navigate('/')}
                            />
                            <NavItem
                                icon={<FileText size={20} />}
                                label="My Reports"
                                active={location.pathname === '/my-reports'}
                                onClick={() => navigate('/my-reports')}
                            />
                            <NavItem
                                icon={<BarChart2 size={20} />}
                                label="Analytics"
                                active={location.pathname === '/analytics'}
                                onClick={() => navigate('/analytics')}
                            />
                        </div>
                    </nav>

                    <div className="p-4 border-t border-border mt-auto">
                        <div className="mt-4 flex items-center gap-3 px-3 py-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-landing-blue to-landing-purple text-white flex items-center justify-center text-sm font-medium">
                                {userInfo?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate text-white">{userInfo?.name || 'User'}</p>
                                <p className="text-xs text-muted-foreground truncate">{userInfo?.email || 'user@example.com'}</p>
                            </div>
                        </div>
                        <button
                            onClick={onLogout}
                            className="w-full mt-3 flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                        >
                            <LogOut size={20} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </aside>

                {/* Mobile Header */}
                <div className="md:hidden fixed top-0 inset-x-0 h-16 bg-card/80 backdrop-blur-md border-b border-border z-40 flex items-center px-4 justify-between">
                    <span className="font-serif font-bold text-lg text-white">AcademicGuard</span>
                    <button className="p-2 -mr-2 text-muted-foreground">
                        <Menu size={24} />
                    </button>
                </div>

                {/* Main Content */}
                <main className="flex-1 md:pl-64 pt-16 md:pt-0">
                    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
};

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${active
                    ? 'bg-landing-blue/10 text-landing-blue'
                    : 'text-muted-foreground hover:bg-muted hover:text-white'
                }
            `}
        >
            {icon}
            <span>{label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-landing-blue" />}
        </button>
    );
};
