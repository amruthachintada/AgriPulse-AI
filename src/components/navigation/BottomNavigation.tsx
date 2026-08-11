'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Sprout, Scan, CloudSun, Bot } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const isPublicRoute = ['/', '/login', '/signup', '/forgot-password'].includes(pathname);
  if (!isAuthenticated || isPublicRoute) {
    return null;
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/fields', label: 'Crops', icon: Sprout },
    { href: '/analyze', label: 'Analyze', icon: Scan, isProminent: true },
    { href: '/weather', label: 'Weather', icon: CloudSun },
    { href: '/assistant', label: 'Assistant', icon: Bot },
  ];

  return (
    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
      <nav className="glass-card p-2 border border-white/15 rounded-3xl flex items-center justify-around shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl bg-[#071C14]/90">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isProminent) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-6 group"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#3D8B55] to-[#76B85A] flex items-center justify-center text-[#F7FAF4] shadow-[0_0_20px_rgba(118,184,90,0.6)] border-4 border-[#071C14] group-hover:scale-110 transition-transform">
                  <Scan className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-bold text-[#76B85A] mt-1">Analyze</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
                isActive ? 'text-[#76B85A]' : 'text-[#EEF3E5]/60 hover:text-[#EEF3E5]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
