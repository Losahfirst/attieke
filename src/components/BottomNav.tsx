'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Home, ShoppingBag, Package, User } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();

    // Don't show on admin pages or auth pages
    if (
        pathname?.includes('/admin') ||
        pathname?.includes('/login') ||
        pathname?.includes('/signup') ||
        pathname?.includes('/auth')
    ) return null;

    const finalTabs = [
        { href: '/', icon: Home, label: 'Accueil' },
        { href: '/order', icon: ShoppingBag, label: 'Acheter' },
        { href: '/dashboard', icon: Package, label: 'Suivi' },
        { href: '/dashboard/profile', icon: User, label: 'Compte' },
    ];

    return (
        <nav className="bottom-nav glass">
            {finalTabs.map((tab) => {
                const Icon = tab.icon;

                // Refined active logic
                let isActive = false;
                if (tab.href === '/') {
                    isActive = pathname === '/';
                } else if (tab.href === '/dashboard/profile') {
                    isActive = pathname === '/dashboard/profile';
                } else if (tab.href === '/dashboard') {
                    // Active for dashboard but NOT for profile
                    isActive = pathname === '/dashboard' || (pathname?.startsWith('/dashboard') && !pathname?.includes('/profile'));
                } else {
                    isActive = pathname?.startsWith(tab.href);
                }

                return (
                    <Link
                        key={tab.label}
                        href={tab.href}
                        className={`bottom-tab ${isActive ? 'active' : ''}`}
                    >
                        <div className="tab-icon-wrap">
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className="tab-label">{tab.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
