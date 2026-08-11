'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/navigation/Sidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { 
  Scan, CloudSun, Sprout, Bot, MapPin, Droplets, Wind, CloudRain, 
  AlertTriangle, ArrowRight, ShieldCheck, Clock, RefreshCw 
} from 'lucide-react';
import { db } from '@/lib/storage/db';
import { WeatherInfo, CropAnalysisResult, Advisory } from '@/types';
import { getWeather } from '@/lib/weather/weather';

export default function DashboardPage() {
  const [user, setUser] = useState({ name: 'Farmer', location: 'Vijayawada, Andhra Pradesh' });
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [history, setHistory] = useState<CropAnalysisResult[]>([]);
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedUser = db.getUser();
    setUser({
      name: loadedUser.name || 'Farmer',
      location: loadedUser.location || 'Vijayawada, Andhra Pradesh'
    });
    setHistory(db.getHistory());
    setAdvisories(db.getAdvisories());

    getWeather(loadedUser.location).then((wData) => {
      setWeather(wData);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#071C14] flex">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Top Header & Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-bold text-[#76B85A] tracking-wider uppercase">FARM INTELLIGENCE DASHBOARD</span>
            <h1 className="text-3xl font-extrabold text-[#F7FAF4] mt-1">
              Good morning, {user.name} 🌱
            </h1>
            <div className="flex items-center gap-2 mt-2 text-xs text-[#A8C99A]">
              <MapPin className="w-3.5 h-3.5 text-[#76B85A]" />
              <span>{user.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/analyze"
              className="px-5 py-2.5 rounded-xl gradient-btn-green font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(118,184,90,0.3)]"
            >
              <Scan className="w-4 h-4" />
              <span>Analyze New Crop</span>
            </Link>
          </div>
        </div>

        {/* Quick Action Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/analyze">
            <GlassCard hoverEffect className="p-4 flex items-center gap-3 border-[#76B85A]/30">
              <div className="w-10 h-10 rounded-xl bg-[#76B85A]/20 flex items-center justify-center text-[#76B85A]">
                <Scan className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-[#F7FAF4]">Analyze Crop</p>
                <p className="text-[10px] text-[#A8C99A]">AI Scan & Vision</p>
              </div>
            </GlassCard>
          </Link>

          <Link href="/weather">
            <GlassCard hoverEffect className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-[#E8B85A]">
                <CloudSun className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-[#F7FAF4]">Check Weather</p>
                <p className="text-[10px] text-[#A8C99A]">Live Forecast</p>
              </div>
            </GlassCard>
          </Link>

          <Link href="/fields">
            <GlassCard hoverEffect className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-[#F7FAF4]">My Fields</p>
                <p className="text-[10px] text-[#A8C99A]">3 Active Plots</p>
              </div>
            </GlassCard>
          </Link>

          <Link href="/assistant">
            <GlassCard hoverEffect className="p-4 flex items-center gap-3 border-[#76B85A]/40">
              <div className="w-10 h-10 rounded-xl bg-[#3D8B55]/30 flex items-center justify-center text-[#76B85A]">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="font-bold text-sm text-[#F7FAF4]">Ask AgriPulse</p>
                <p className="text-[10px] text-[#76B85A] font-semibold">Voice AI Assistant</p>
              </div>
            </GlassCard>
          </Link>
        </div>

        {/* Weather & Health Index Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Weather Widget (7 cols) */}
          <GlassCard className="lg:col-span-7 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#A8C99A] uppercase tracking-wider">LIVE WEATHER INTELLIGENCE</span>
                <h3 className="text-lg font-bold text-[#F7FAF4]">{weather?.location || 'Vijayawada'}</h3>
              </div>
              <Badge variant="healthy">Updated Live</Badge>
            </div>

            {weather ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-3 rounded-2xl bg-[#0B2A1D] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#A8C99A]">Temperature</span>
                  <p className="text-2xl font-extrabold text-[#F7FAF4]">{weather.temp}°C</p>
                  <p className="text-[10px] text-[#EEF3E5]/70">{weather.condition}</p>
                </div>

                <div className="p-3 rounded-2xl bg-[#0B2A1D] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#A8C99A]">Humidity</span>
                  <div className="flex items-center gap-1">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <p className="text-2xl font-extrabold text-[#F7FAF4]">{weather.humidity}%</p>
                  </div>
                  <p className="text-[10px] text-amber-400 font-medium">High fungal risk</p>
                </div>

                <div className="p-3 rounded-2xl bg-[#0B2A1D] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#A8C99A]">Rain Probability</span>
                  <div className="flex items-center gap-1">
                    <CloudRain className="w-4 h-4 text-cyan-400" />
                    <p className="text-2xl font-extrabold text-[#F7FAF4]">{weather.rainProb}%</p>
                  </div>
                  <p className="text-[10px] text-[#EEF3E5]/70">Light showers tomorrow</p>
                </div>

                <div className="p-3 rounded-2xl bg-[#0B2A1D] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#A8C99A]">Wind Speed</span>
                  <div className="flex items-center gap-1">
                    <Wind className="w-4 h-4 text-teal-400" />
                    <p className="text-2xl font-extrabold text-[#F7FAF4]">{weather.windSpeed} <span className="text-xs font-normal">km/h</span></p>
                  </div>
                  <p className="text-[10px] text-[#76B85A]">Safe for spraying</p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#A8C99A]">Loading weather data...</div>
            )}

            {/* Weather Insight Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#123C29] to-[#0B2A1D] border border-[#76B85A]/30 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#76B85A] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#F7FAF4]">Field Activity Recommendation</h4>
                <p className="text-xs text-[#EEF3E5]/80 mt-0.5 leading-relaxed">
                  {weather?.fieldActivityRecommendation || 'Optimal spraying window today between 4:00 PM and 6:00 PM.'}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Crop Health Score Card (5 cols) */}
          <GlassCard className="lg:col-span-5 p-6 space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#A8C99A] uppercase tracking-wider">CROP HEALTH STATUS</span>
                <Badge variant="healthy">88% Healthy</Badge>
              </div>
              
              <div className="mt-6 flex items-center justify-center relative">
                {/* Visual Dial Circle */}
                <div className="w-36 h-36 rounded-full border-8 border-[#123C29] border-t-[#76B85A] border-r-[#76B85A] flex flex-col items-center justify-center shadow-[0_0_25px_rgba(118,184,90,0.2)]">
                  <span className="text-3xl font-extrabold text-[#F7FAF4]">88%</span>
                  <span className="text-[10px] font-bold text-[#76B85A]">HEALTH INDEX</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#EEF3E5]/80">East Paddy Field</span>
                <span className="font-bold text-[#76B85A]">Moderate Blight Risk</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#EEF3E5]/80">Chilli Block A</span>
                <span className="font-bold text-amber-400">Leaf Curl Monitoring</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Recent Analysis & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Recent Analysis Timeline (8 cols) */}
          <GlassCard className="lg:col-span-8 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#F7FAF4]">Recent Crop Scans</h3>
              <Link href="/history" className="text-xs text-[#76B85A] font-semibold hover:underline flex items-center gap-1">
                <span>View Full History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {history.length > 0 ? (
                history.slice(0, 2).map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-[#0B2A1D] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.imageUrl}
                        alt={item.cropName}
                        className="w-16 h-16 rounded-xl object-cover border border-[#76B85A]/40 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#F7FAF4]">{item.cropName}</h4>
                          <Badge variant={item.severity === 'Moderate' ? 'warning' : 'healthy'}>
                            {item.confidence}% Confidence
                          </Badge>
                        </div>
                        <p className="text-xs text-[#76B85A] font-semibold mt-0.5">{item.diagnosis}</p>
                        <p className="text-[10px] text-[#A8C99A] mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/analyze"
                      className="px-4 py-2 rounded-xl bg-[#123C29] hover:bg-[#3D8B55] text-xs font-bold text-[#F7FAF4] transition-all text-center"
                    >
                      View Advisory
                    </Link>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-[#A8C99A]">
                  No crop analysis recorded yet. Upload a crop image to begin!
                </div>
              )}
            </div>
          </GlassCard>

          {/* Active Advisories (4 cols) */}
          <GlassCard className="lg:col-span-4 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#F7FAF4]">Field Advisories</h3>
              <Badge variant="warning">{advisories.length} Active</Badge>
            </div>

            <div className="space-y-3">
              {advisories.map((adv) => (
                <div key={adv.id} className="p-3.5 rounded-2xl bg-[#0B2A1D] border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#E8B85A] uppercase">{adv.category}</span>
                    <span className="text-[10px] text-[#A8C99A]">{adv.date}</span>
                  </div>
                  <h5 className="font-bold text-xs text-[#F7FAF4]">{adv.title}</h5>
                  <p className="text-[11px] text-[#EEF3E5]/75 line-clamp-2">{adv.recommendedAction}</p>
                </div>
              ))}
            </div>
          </GlassCard>

        </div>

      </div>
    </div>
  );
}
