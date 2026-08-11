'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, ShieldAlert, CloudSun, Droplets, Bug, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Advisory } from '@/types';
import { db } from '@/lib/storage/db';

const CATEGORIES = ['All', 'Crop Health', 'Weather', 'Irrigation', 'Pest Risk', 'Prevention', 'Alerts'];

export default function AdvisoriesPage() {
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    setAdvisories(db.getAdvisories());
  }, []);

  const filteredAdvisories = selectedCategory === 'All'
    ? advisories
    : advisories.filter(a => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#071C14] flex">
      <Sidebar />

      <div className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-white/10 pb-6">
          <span className="text-xs font-bold text-[#76B85A] tracking-wider uppercase">AGRONOMY & PROTECTION</span>
          <h1 className="text-3xl font-extrabold text-[#F7FAF4] mt-1">Advisory Center</h1>
          <p className="text-xs text-[#A8C99A] mt-1">
            Expert agricultural guidelines, pest outbreak alerts, and seasonal field advisories.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#3D8B55] border-[#76B85A] text-[#F7FAF4] shadow-[0_0_12px_rgba(61,139,85,0.4)]'
                  : 'bg-[#0B2A1D] border-white/10 text-[#EEF3E5]/80 hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Advisories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAdvisories.map((adv) => (
            <GlassCard key={adv.id} hoverEffect className="p-6 space-y-4 border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[#E8B85A] uppercase tracking-wider">{adv.category}</span>
                  <span className="text-[10px] text-[#A8C99A]">• {adv.date}</span>
                </div>
                <Badge variant={adv.severity === 'High' ? 'warning' : 'healthy'}>
                  {adv.severity} Priority
                </Badge>
              </div>

              <h3 className="font-bold text-lg text-[#F7FAF4]">{adv.title}</h3>
              <p className="text-xs text-[#EEF3E5]/80 leading-relaxed">{adv.explanation}</p>

              {/* Recommended Action Box */}
              <div className="p-4 rounded-2xl bg-[#0B2A1D] border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-[#76B85A] uppercase">RECOMMENDED ACTION</span>
                <p className="text-xs font-medium text-[#F7FAF4] leading-relaxed">{adv.recommendedAction}</p>
              </div>

              {adv.affectedCrops && (
                <div className="flex items-center gap-2 pt-2 text-[10px] text-[#A8C99A]">
                  <span>Applies to:</span>
                  {adv.affectedCrops.map(crop => (
                    <span key={crop} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#EEF3E5]">
                      {crop}
                    </span>
                  ))}
                </div>
              )}
            </GlassCard>
          ))}
        </div>

      </div>
    </div>
  );
}
