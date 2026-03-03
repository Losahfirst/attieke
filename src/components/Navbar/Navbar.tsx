"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Utensils, LayoutDashboard, User, ShoppingBag, LogIn, LogOut, Package } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, profile, signOut, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLinkClick = (href: string) => {
    if (pathname === href) {
      router.refresh();
    }
  };

  const isHomePage = pathname === '/';

  return (
    <nav className={`navbar ${isHomePage ? 'enterprise-nav' : 'glass'}`}>
      <div className={`container nav-content ${isHomePage ? 'container-wide' : ''}`}>
        <Link href="/" className="logo" onClick={() => handleLinkClick('/')}>
          {isHomePage ? (
            <img src="/logo.png" alt="Logo" style={{ height: '70px', objectFit: 'contain' }} />
          ) : (
            <>
              <Utensils className="logo-icon-svg" size={32} />
              <span className="logo-text">
                ATTIÉKÉ <span className="highlight">EXPRESS</span>
              </span>
            </>
          )}
        </Link>

        {isHomePage ? null : (
          <div className="nav-links">
            <Link href="/order" className="nav-link-item" onClick={() => handleLinkClick('/order')}>
              <ShoppingBag size={20} />
              <span>Commander</span>
            </Link>

            {!loading && user ? (
              <>
                <Link href="/dashboard" className="nav-link-item user-profile-link" onClick={() => handleLinkClick('/dashboard')}>
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="nav-avatar" />
                  ) : (
                    <User size={20} />
                  )}
                  <span>{profile?.full_name?.split(' ')[0] || 'Client'}</span>
                </Link>
                {profile?.role === 'admin' && (
                  <Link href="/admin" className="nav-link-item seller-btn">
                    <LayoutDashboard size={20} />
                    <span>Vendeur</span>
                  </Link>
                )}
                <button onClick={signOut} className="nav-link-item nav-logout-btn" title="Se déconnecter">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-link-item">
                  <LogIn size={20} />
                  <span>Connexion</span>
                </Link>
                <Link href="/admin" className="nav-link-item seller-btn">
                  <LayoutDashboard size={20} />
                  <span>Vendeur</span>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
