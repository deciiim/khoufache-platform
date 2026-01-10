import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, PlayCircle } from 'lucide-react';
import logoImg from '../assets/KHOFO.jpg';
import './Navbar.css';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        
        <Link to="/" className="nav-logo-link" onClick={closeMenu}>
          <img src={logoImg} alt="Khoufache.shop" className="main-logo-img" />
        </Link>

        {/* Updated Links with Dynamic Class */}
        <div className={`nav-links ${isOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>الرئيسية</Link>
          <Link to="/recharge" className="nav-link" onClick={closeMenu}>الشحن</Link>
          <Link to="/withdraw" className="nav-link" onClick={closeMenu}>السحب</Link>
          <Link to="/video" className="nav-link" onClick={closeMenu}>
            <span>شرح طريقة السحب</span>
            <PlayCircle size={16} color="#dc2626" />
          </Link>
          <Link to="/contact" className="nav-link" onClick={closeMenu}>اتصل بنا</Link>
        </div>

        {/* Mobile Button Toggle */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isOpen ? <X color="white" size={28} /> : <Menu color="white" size={28} />}
        </button>

      </div>
    </nav>
  );
};