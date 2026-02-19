import Link from 'next/link';
import { Utensils, LayoutDashboard, User, ShoppingBag } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
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
          <Link href="/dashboard" className="nav-link-item">
            <User size={20} />
            <span>Client</span>
          </Link>
          <Link href="/admin" className="nav-link-item seller-btn">
            <LayoutDashboard size={20} />
            <span>Vendeur</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
