"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Package, Factory, Settings } from 'lucide-react';
import './admin.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <Link href="/admin" className={`sidebar-link ${pathname === '/admin' ? 'active' : ''}`}>
                    <BarChart3 size={20} /> Stat & Analyse
                </Link>
                <Link href="/admin/orders" className={`sidebar-link ${pathname === '/admin/orders' ? 'active' : ''}`}>
                    <Package size={20} /> Commandes & Suivi
                </Link>
                <Link href="/admin/suppliers" className={`sidebar-link ${pathname === '/admin/suppliers' ? 'active' : ''}`}>
                    <Factory size={20} /> Fournisseurs (Bouaké)
                </Link>
                <Link href="/admin/settings" className={`sidebar-link ${pathname === '/admin/settings' ? 'active' : ''}`}>
                    <Settings size={20} /> Paramètres
                </Link>
            </aside>
            <main className="admin-main">
                {children}
            </main>
        </div>
    );
}
