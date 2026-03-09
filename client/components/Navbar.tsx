import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { NavItem } from '../types';
import { Link, NavLink } from 'react-router-dom';

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Store', href: '/store' },
  { label: 'Team', href: '/team' },
  { label: 'About Us', href: '/about' },
];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4 bg-white/80 backdrop-blur-md shadow-sm' : 'py-6 bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="relative w-10 h-10 flex items-center justify-center rounded-full overflow-hidden">
            <img src="/assets/go_techy_logo.png" alt="GoTechy Logo" className="w-full h-full object-contain relative z-10" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-xl text-gray-900 tracking-tight">GoTechy</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors relative group ${isActive ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-brand-500 transition-all duration-300 rounded-full ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                  ></span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-brand-600 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-5">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className="text-base font-medium text-gray-700 hover:text-brand-600 py-2 border-b border-gray-50 last:border-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};
