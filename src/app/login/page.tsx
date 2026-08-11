'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sprout, Lock, Mail, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    login(email);
  };

  return (
    <div className="min-h-screen bg-[#071C14] bg-radial-glow flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-8 space-y-6 border-[#76B85A]/30">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3D8B55] to-[#76B85A] flex items-center justify-center mx-auto text-[#F7FAF4] shadow-[0_0_20px_rgba(118,184,90,0.4)]">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#F7FAF4]">Welcome to AgriPulse AI</h2>
          <p className="text-xs text-[#A8C99A]">Smarter Fields. Safer Decisions. Stronger Harvests.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#A8C99A]">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#76B85A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="farmer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input pl-9 p-3 w-full"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#A8C99A]">PASSWORD</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#76B85A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input pl-9 p-3 w-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-[#EEF3E5]/80 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-[#76B85A]" />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-xs text-[#76B85A] hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl gradient-btn-green font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(118,184,90,0.3)] mt-2"
          >
            <span>Login to AgriPulse</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#A8C99A]">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[#76B85A] font-bold hover:underline">
            Create account
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
