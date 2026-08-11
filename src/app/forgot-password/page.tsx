'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sprout, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#071C14] bg-radial-glow flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-8 space-y-6 border-[#76B85A]/30">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3D8B55] to-[#76B85A] flex items-center justify-center mx-auto text-[#F7FAF4] shadow-[0_0_20px_rgba(118,184,90,0.4)]">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#F7FAF4]">Reset Password</h2>
          <p className="text-xs text-[#A8C99A]">Enter your email to receive a password reset link</p>
        </div>

        {sent ? (
          <div className="p-4 rounded-2xl bg-[#3D8B55]/20 border border-[#76B85A]/40 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#76B85A] mx-auto" />
            <p className="text-sm font-bold text-[#F7FAF4]">Reset Link Sent!</p>
            <p className="text-xs text-[#EEF3E5]/80">
              We have sent password reset instructions to <span className="font-bold text-[#76B85A]">{email}</span>.
            </p>
            <div className="pt-2">
              <Link href="/login" className="text-xs font-bold text-[#76B85A] hover:underline">
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl gradient-btn-green font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(118,184,90,0.3)] mt-2"
            >
              <span>Send Reset Link</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-center text-xs text-[#A8C99A]">
          Remember your password?{' '}
          <Link href="/login" className="text-[#76B85A] font-bold hover:underline">
            Login here
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
