'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Home, ShoppingBag, LayoutGrid, Compass } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav() {
    const pathname = usePathname();
    const { user } = useAuth();

    // Don't show on admin pages or auth pages
    if (
        pathname?.startsWith('/admin') ||
        pathname?.startsWith('/login') ||
        pathname?.startsWith('/signup') ||
        pathname?.startsWith('/auth')
    ) return null;

    const tabs = [
        { href: '/', icon: Home, label: 'Accueil' },
        { href: '/order', icon: ShoppingBag, label: 'Commander' },
        { href: '/dashboard', icon: LayoutGrid, label: 'Commandes' },
        { href: '/discover', icon: Compass, label: 'Découvrir' },
    ];

    return (
        <nav className="bottom-nav glass">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = tab.href === '/'
                    ? pathname === '/'
                    : pathname?.startsWith(tab.href) && tab.href !== '/';
                return (
                    <Link key={tab.href} href={tab.href} className={`bottom-tab ${isActive ? 'active' : ''}`}>
                        <div className="tab-icon-wrap">
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                            {isActive && <div className="tab-indicator" />}
                        </div>
                        <span className="tab-label">{tab.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
