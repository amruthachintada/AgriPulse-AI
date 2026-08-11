'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sprout, MapPin, Bell, Volume2, VolumeX, Menu, X, Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/storage/db';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const [location] = useState(() => {
    if (typeof window === 'undefined') return 'Vijayawada, AP';
    const activeUser = db.getUser();
    return activeUser?.location ? activeUser.location.split(',')[0] : 'Vijayawada, AP';
  });

  const [ambientActive, setAmbientActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notificationsCount = 2;

  const toggleAmbientSound = () => {
    setAmbientActive(prev => !prev);
  };

  const isPublicRoute = ['/', '/login', '/signup', '/forgot-password'].includes(pathname);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/analyze', label: 'Crop Analysis' },
    { href: '/weather', label: 'Weather' },
    { href: '/fields', label: 'My Fields' },
    { href: '/advisories', label: 'Advisories' },
    { href: '/assistant', label: 'AI Assistant', highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-white/10 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Identity */}
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3D8B55] to-[#76B85A] flex items-center justify-center shadow-[0_0_15px_rgba(118,184,90,0.3)] group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6 text-[#F7FAF4]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xl tracking-tight text-[#F7FAF4]">AgriPulse</span>
              <span className="text-xs font-extrabold px-1.5 py-0.5 rounded bg-[#76B85A]/20 text-[#76B85A] border border-[#76B85A]/30">AI</span>
            </div>
            <p className="text-[10px] text-[#A8C99A] hidden sm:block">Smarter Fields. Safer Decisions.</p>
          </div>
        </Link>

        {/* Desktop Navigation Links (Only shown when authenticated and not on public landing) */}
        {isAuthenticated && !isPublicRoute && (
          <nav className="hidden md:flex items-center gap-1 bg-[#0B2A1D]/60 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#3D8B55] text-[#F7FAF4] shadow-[0_0_12px_rgba(61,139,85,0.4)]'
                      : 'text-[#EEF3E5]/80 hover:text-[#F7FAF4] hover:bg-white/5'
                  } ${link.highlight && !isActive ? 'text-[#76B85A] font-semibold' : ''}`}
                >
                  {link.highlight && <Sparkles className="w-3.5 h-3.5 text-[#76B85A] animate-pulse" />}
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          
          {isAuthenticated && (
            <>
              {/* Location Badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#123C29]/70 border border-white/10 text-xs text-[#A8C99A]">
                <MapPin className="w-3.5 h-3.5 text-[#76B85A]" />
                <span className="font-medium text-[#EEF3E5]">{location}</span>
              </div>

              {/* Ambient Sound Control */}
              <button
                onClick={toggleAmbientSound}
                title={ambientActive ? 'Mute Ambient Farm Sound' : 'Enable Ambient Farm Sound'}
                className={`p-2 rounded-full border transition-all ${
                  ambientActive
                    ? 'bg-[#76B85A]/20 text-[#76B85A] border-[#76B85A]/40 shadow-[0_0_10px_rgba(118,184,90,0.3)]'
                    : 'bg-white/5 text-[#EEF3E5]/70 border-white/10 hover:text-[#F7FAF4]'
                }`}
              >
                {ambientActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Notifications */}
              <Link
                href="/advisories"
                className="relative p-2 rounded-full bg-white/5 border border-white/10 text-[#EEF3E5]/80 hover:text-[#F7FAF4] transition-all"
              >
                <Bell className="w-4 h-4" />
                {notificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E8B85A] text-[#071C14] text-[10px] font-bold flex items-center justify-center">
                    {notificationsCount}
                  </span>
                )}
              </Link>

              {/* User Profile / Logout */}
              <div className="flex items-center gap-2">
                <Link
                  href="/settings"
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-gradient-to-r from-[#123C29] to-[#0B2A1D] border border-white/10 hover:border-[#76B85A]/40 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-[#3D8B55] flex items-center justify-center text-[#F7FAF4] font-bold text-xs">
                    🌱
                  </div>
                  <span className="text-xs font-semibold text-[#EEF3E5] hidden md:inline">{user?.name?.split(' ')[0] || 'Farmer'}</span>
                </Link>

                <button
                  onClick={logout}
                  title="Logout from session"
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-[#EEF3E5]/70 hover:text-red-400 hover:border-red-500/40 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {!isAuthenticated && (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-full bg-white/5 border border-white/15 text-xs font-bold text-[#EEF3E5] hover:bg-white/10 transition-all"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-full gradient-btn-green font-bold text-xs shadow-[0_0_12px_rgba(118,184,90,0.3)]"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          {isAuthenticated && !isPublicRoute && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/5 text-[#EEF3E5]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && isAuthenticated && !isPublicRoute && (
        <div className="md:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-2 pb-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === link.href
                  ? 'bg-[#3D8B55] text-[#F7FAF4]'
                  : 'text-[#EEF3E5]/80 hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
