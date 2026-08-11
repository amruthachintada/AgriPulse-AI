'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, ShieldCheck, Scan, CloudSun, Bot, ArrowRight, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';

export default function AuthLandingPage() {
  const { user, isAuthenticated } = useAuth();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated && user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#071C14] bg-radial-glow flex flex-col justify-between p-4 lg:p-12 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-[#76B85A]/10 filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-[#3D8B55]/15 filter blur-[100px] pointer-events-none" />

      {/* Top Header Identity */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between py-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3D8B55] to-[#76B85A] flex items-center justify-center shadow-[0_0_20px_rgba(118,184,90,0.4)]">
            <Sprout className="w-6 h-6 text-[#F7FAF4]" />
          </div>
          <div>
            <span className="font-bold text-xl text-[#F7FAF4]">AgriPulse <span className="text-[#76B85A]">AI</span></span>
            <p className="text-[10px] text-[#A8C99A]">Smarter Fields. Safer Decisions.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-bold text-[#EEF3E5] transition-all"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 rounded-xl gradient-btn-green text-xs font-bold shadow-[0_0_20px_rgba(118,184,90,0.3)] hover:scale-105 transition-transform"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Grid: Left Value Proposition & Right Auth Portal */}
      <main className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12 relative z-10">
        
        {/* Left Column: Product Value Proposition (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#123C29] border border-[#76B85A]/40 text-xs font-bold text-[#76B85A]">
            <Sparkles className="w-4 h-4 text-[#76B85A] animate-pulse" />
            <span>AI Agricultural Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#F7FAF4] tracking-tight leading-tight">
            Smarter Fields.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#76B85A] via-[#A8C99A] to-[#EEF3E5]">
              Safer Decisions.
            </span><br />
            Stronger Harvests.
          </h1>

          <p className="text-sm sm:text-base text-[#A8C99A] max-w-xl leading-relaxed">
            AgriPulse AI combines instant crop health computer vision, real-time weather risk intelligence, and an AI farming advisor to protect your yield and optimize field spray windows.
          </p>

          {/* Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <GlassCard className="p-4 flex items-center gap-3 border-[#76B85A]/30">
              <Scan className="w-6 h-6 text-[#76B85A] shrink-0" />
              <div>
                <h4 className="font-bold text-xs text-[#F7FAF4]">Crop Health AI</h4>
                <p className="text-[10px] text-[#A8C99A]">Instant disease scan</p>
              </div>
            </GlassCard>

            <GlassCard className="p-4 flex items-center gap-3 border-white/10">
              <CloudSun className="w-6 h-6 text-sky-400 shrink-0" />
              <div>
                <h4 className="font-bold text-xs text-[#F7FAF4]">Weather Risk</h4>
                <p className="text-[10px] text-[#A8C99A]">Spraying advice</p>
              </div>
            </GlassCard>

            <GlassCard className="p-4 flex items-center gap-3 border-white/10">
              <Bot className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold text-xs text-[#F7FAF4]">AI Companion</h4>
                <p className="text-[10px] text-[#A8C99A]">English voice assistant</p>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Right Column: Authentication Card (5 cols) */}
        <div className="lg:col-span-5">
          <GlassCard className="p-8 space-y-6 border-[#76B85A]/40 shadow-[0_0_50px_rgba(118,184,90,0.2)] relative">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3D8B55] to-[#76B85A] flex items-center justify-center mx-auto text-[#F7FAF4] shadow-[0_0_20px_rgba(118,184,90,0.4)]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#F7FAF4]">Get Started with AgriPulse</h2>
              <p className="text-xs text-[#A8C99A]">Sign in or register to access your field dashboard</p>
            </div>

            <div className="space-y-4 pt-2">
              <Link
                href="/login"
                className="w-full py-4 rounded-2xl gradient-btn-green font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(118,184,90,0.4)] hover:scale-[1.02] transition-transform"
              >
                <span>Login to Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/signup"
                className="w-full py-4 rounded-2xl bg-white/5 border border-white/15 hover:bg-white/10 text-xs font-bold text-[#EEF3E5] flex items-center justify-center gap-2 transition-all"
              >
                <span>Create New Account</span>
              </Link>
            </div>

            <div className="border-t border-white/10 pt-4 text-center">
              <p className="text-[11px] text-[#A8C99A]/80">
                🔒 Protected & Secure Authentication Gate
              </p>
            </div>
          </GlassCard>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full py-6 text-center text-xs text-[#A8C99A]/60 border-t border-white/10 relative z-10">
        © 2026 AgriPulse AI. All rights reserved.
      </footer>
    </div>
  );
}
