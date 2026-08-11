'use client';

import React, { useState, useEffect } from 'react';
import { Scan, Sparkles } from 'lucide-react';

interface AIScannerProps {
  imageSrc: string;
  onComplete: () => void;
}

const STAGES = [
  'Reading your plant...',
  'Analyzing visible symptoms...',
  'Evaluating crop condition...',
  'Checking weather conditions...',
  'Preparing your advisory...'
];

export const AIScanner: React.FC<AIScannerProps> = ({ imageSrc, onComplete }) => {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="relative w-full max-w-lg mx-auto rounded-3xl overflow-hidden glass-card border border-[#76B85A]/40 shadow-[0_0_40px_rgba(118,184,90,0.2)]">
      
      {/* Crop Image Container */}
      <div className="relative aspect-square w-full bg-[#0B2A1D] flex items-center justify-center overflow-hidden">
        {/* Base Image */}
        <img
          src={imageSrc}
          alt="Crop scan target"
          className="w-full h-full object-cover filter brightness-95 contrast-105"
        />

        {/* Subtle Cybernetic Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#76B85A 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Glowing Target Detection Nodes */}
        <div className="absolute top-[30%] left-[40%] w-6 h-6 rounded-full border-2 border-[#76B85A] animate-ping opacity-75" />
        <div className="absolute top-[30%] left-[40%] w-3 h-3 rounded-full bg-[#76B85A] shadow-[0_0_10px_#76B85A]" />
        
        <div className="absolute top-[55%] right-[35%] w-8 h-8 rounded-full border-2 border-[#E8B85A] animate-pulse" />
        <div className="absolute top-[55%] right-[35%] w-2.5 h-2.5 rounded-full bg-[#E8B85A] shadow-[0_0_10px_#E8B85A]" />

        <div className="absolute bottom-[25%] left-[25%] w-5 h-5 rounded-full border border-[#76B85A]/80" />

        {/* AI Laser Scan Line */}
        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#76B85A] to-transparent shadow-[0_0_20px_#76B85A] animate-laser-scan top-0" />

        {/* Corner HUD Reticles */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#76B85A]" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#76B85A]" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#76B85A]" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#76B85A]" />

        {/* Scanning Badge Overlay */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#071C14]/85 border border-[#76B85A]/40 backdrop-blur-md flex items-center gap-2">
          <Scan className="w-4 h-4 text-[#76B85A] animate-spin" />
          <span className="text-xs font-bold tracking-wider text-[#EEF3E5] uppercase">AI Vision Processing</span>
        </div>
      </div>

      {/* Progress & Stage Status */}
      <div className="p-6 bg-[#071C14]/90 backdrop-blur-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-[#A8C99A]">ANALYSIS PROGRESS</span>
          <span className="text-xs font-bold text-[#76B85A]">{Math.round(((stageIndex + 1) / STAGES.length) * 100)}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#123C29] overflow-hidden mb-4 border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-[#3D8B55] to-[#76B85A] transition-all duration-500 ease-out"
            style={{ width: `${((stageIndex + 1) / STAGES.length) * 100}%` }}
          />
        </div>

        {/* Active Stage Text */}
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-[#76B85A] animate-bounce" />
          <p className="text-sm font-semibold text-[#F7FAF4] animate-pulse">
            {STAGES[stageIndex]}
          </p>
        </div>
      </div>
    </div>
  );
};
