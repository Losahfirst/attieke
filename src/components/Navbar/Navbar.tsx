"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Utensils, LayoutDashboard, User, ShoppingBag, LogIn, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, profile, signOut, loading } = useAuth();

  return (
    <nav className="navbar glass">
      <div className="container nav-content">
        <Link href="/" className="logo">
          <Utensils className="logo-icon-svg" size={32} />
          <span className="logo-text">Attiéké <span className="highlight">Express</span> CI</span>
        </Link>
        <div className="nav-links">
          <Link href="/order" className="nav-link-item">
            <ShoppingBag size={20} />
            <span>Commander</span>
          </Link>

          {!loading && user ? (
            <>
              <Link href="/dashboard" className="nav-link-item user-profile-link">
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
      </div>
    </nav>
  );
};

export default Navbar;
