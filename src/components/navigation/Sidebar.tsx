'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Scan, CloudSun, History, BookOpen, Bot, Settings, MapPin, Sprout } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/analyze', label: 'Crop Analysis', icon: Scan, badge: 'AI' },
    { href: '/fields', label: 'My Fields', icon: Sprout },
    { href: '/weather', label: 'Weather', icon: CloudSun },
    { href: '/history', label: 'Crop History', icon: History },
    { href: '/advisories', label: 'Advisories', icon: BookOpen },
    { href: '/assistant', label: 'AI Assistant', icon: Bot, badge: 'Voice' },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 glass-card rounded-none border-r border-white/10 min-h-[calc(100vh-65px)] p-4 gap-6 sticky top-[65px]">
      
      {/* Quick Field Status Widget */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#123C29]/80 to-[#0B2A1D] border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#A8C99A]">ACTIVE FIELD</span>
          <span className="w-2 h-2 rounded-full bg-[#76B85A] animate-ping" />
        </div>
        <h4 className="font-bold text-sm text-[#F7FAF4]">East Paddy Field</h4>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-[#EEF3E5]/70">
          <MapPin className="w-3 h-3 text-[#76B85A]" />
          <span>Vijayawada (4.5 Acres)</span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col gap-1.5 flex-1">
        <span className="text-[10px] font-bold text-[#A8C99A] tracking-wider uppercase px-3 mb-1">Navigation</span>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#3D8B55] to-[#123C29] text-[#F7FAF4] shadow-[0_0_15px_rgba(61,139,85,0.3)] border border-[#76B85A]/40'
                  : 'text-[#EEF3E5]/75 hover:bg-white/5 hover:text-[#F7FAF4]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#76B85A]' : 'text-[#A8C99A]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-[#76B85A] text-[#071C14]' : 'bg-[#76B85A]/20 text-[#76B85A]'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Tagline */}
      <div className="p-3 text-center border-t border-white/5 text-xs text-[#A8C99A]/60">
        AgriPulse AI v2.5
      </div>
    </aside>
  );
};
