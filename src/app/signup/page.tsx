'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sprout, Lock, Mail, User as UserIcon, ArrowRight, AlertTriangle } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    signup(name, email);
  };

  return (
    <div className="min-h-screen bg-[#071C14] bg-radial-glow flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-8 space-y-6 border-[#76B85A]/30">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3D8B55] to-[#76B85A] flex items-center justify-center mx-auto text-[#F7FAF4] shadow-[0_0_20px_rgba(118,184,90,0.4)]">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#F7FAF4]">Create Your Account</h2>
          <p className="text-xs text-[#A8C99A]">Join AgriPulse AI for smarter field management</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#A8C99A]">FULL NAME</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-[#76B85A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Farmer Friend"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input pl-9 p-3 w-full"
              />
            </div>
          </div>

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

          <div className="space-y-1">
            <label className="font-bold text-[#A8C99A]">CONFIRM PASSWORD</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#76B85A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="glass-input pl-9 p-3 w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl gradient-btn-green font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(118,184,90,0.3)] mt-2"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#A8C99A]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#76B85A] font-bold hover:underline">
            Login here
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
