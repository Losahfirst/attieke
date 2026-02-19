import Link from 'next/link';
import { BarChart3, Package, Factory, Settings } from 'lucide-react';
import './admin.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <Link href="/admin" className="sidebar-link active">
                    <BarChart3 size={20} /> Stat & Analyse
                </Link>
                <Link href="/admin/orders" className="sidebar-link">
                    <Package size={20} /> Commandes & Suivi
                </Link>
                <Link href="/admin/suppliers" className="sidebar-link">
                    <Factory size={20} /> Fournisseurs (Bouaké)
                </Link>
                <Link href="/admin/settings" className="sidebar-link">
                    <Settings size={20} /> Paramètres
                </Link>
            </aside>
            <main className="admin-main">
                {children}
            </main>
        </div>
    );
}
