'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/navigation/Sidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { History, Calendar, MapPin, Scan, CheckCircle2, ArrowRight } from 'lucide-react';
import { CropAnalysisResult } from '@/types';
import { db } from '@/lib/storage/db';

export default function HistoryPage() {
  const [history, setHistory] = useState<CropAnalysisResult[]>([]);

  useEffect(() => {
    setHistory(db.getHistory());
  }, []);

  return (
    <div className="min-h-screen bg-[#071C14] flex">
      <Sidebar />

      <div className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-bold text-[#76B85A] tracking-wider uppercase">HISTORICAL RECORDS</span>
            <h1 className="text-3xl font-extrabold text-[#F7FAF4] mt-1">Crop Analysis History</h1>
            <p className="text-xs text-[#A8C99A] mt-1">
              Visual timeline of past crop vision diagnoses, disease confidence scores, and recommendations.
            </p>
          </div>

          <Link
            href="/analyze"
            className="px-5 py-2.5 rounded-xl gradient-btn-green font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(118,184,90,0.3)]"
          >
            <Scan className="w-4 h-4" />
            <span>Perform New Scan</span>
          </Link>
        </div>

        {/* History Timeline */}
        <div className="space-y-6">
          {history.length > 0 ? (
            history.map((item) => (
              <GlassCard key={item.id} hoverEffect className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Left Thumbnail & Basic Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.cropName}
                      className="w-24 h-24 rounded-2xl object-cover border border-[#76B85A]/40 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-[#F7FAF4]">{item.cropName}</span>
                        <Badge variant={item.confidence >= 80 ? 'healthy' : 'warning'}>
                          {item.confidence}% Confidence
                        </Badge>
                      </div>
                      <h3 className="font-bold text-lg text-[#76B85A]">{item.diagnosis}</h3>
                      <div className="flex items-center gap-4 text-xs text-[#A8C99A] pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#76B85A]" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#76B85A]" />
                          {item.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Window */}
                  <div className="p-4 rounded-2xl bg-[#0B2A1D] border border-white/10 space-y-1 min-w-[220px]">
                    <span className="text-[10px] font-bold text-[#A8C99A] uppercase">ACTION WINDOW</span>
                    <p className="text-xs font-bold text-[#F7FAF4]">{item.actionWindow.recommendedTime}</p>
                    <p className="text-[10px] text-[#76B85A]">Rain risk: {item.actionWindow.rainRisk}</p>
                  </div>

                </div>

                {/* Symptoms Summary */}
                <div className="pt-4 border-t border-white/5 space-y-2">
                  <span className="text-[10px] font-bold text-[#A8C99A] uppercase tracking-wider">PRIMARY SYMPTOMS DETECTED</span>
                  <div className="flex flex-wrap gap-2">
                    {item.symptoms.map((symptom, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#EEF3E5]">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <div className="py-20 text-center text-xs text-[#A8C99A]">
              No past analysis entries found. Upload your first crop photo to populate history!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
