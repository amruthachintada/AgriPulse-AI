'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { 
  CloudSun, Droplets, Wind, CloudRain, Thermometer, 
  MapPin, ShieldCheck 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar 
} from 'recharts';
import { WeatherInfo } from '@/types';
import { getWeather } from '@/lib/weather/weather';
import { db } from '@/lib/storage/db';

export default function WeatherPage() {
  const [location, setLocation] = useState('Vijayawada, Andhra Pradesh');
  const [weather, setWeather] = useState<WeatherInfo | null>(null);

  const fetchWeatherData = useCallback(async (loc: string) => {
    const data = await getWeather(loc);
    setWeather(data);
  }, []);

  useEffect(() => {
    const user = db.getUser();
    if (user?.location) setLocation(user.location);
    fetchWeatherData(user.location || 'Vijayawada, Andhra Pradesh');
  }, [fetchWeatherData]);

  const chartData = weather?.hourly.map(h => ({
    time: h.time,
    temp: h.temp,
    rainProb: h.rainProb,
  })) || [];

  return (
    <div className="min-h-screen bg-[#071C14] flex">
      <Sidebar />

      <div className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-bold text-[#76B85A] tracking-wider uppercase">CLIMATE RESILIENCE</span>
            <h1 className="text-3xl font-extrabold text-[#F7FAF4] mt-1">Weather Intelligence</h1>
            <p className="text-xs text-[#A8C99A] mt-1">
              Field-tuned weather forecasting combined with AI crop risk intelligence.
            </p>
          </div>

          {/* Location Input */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-[#76B85A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchWeatherData(location)}
                className="glass-input pl-9 pr-4 py-2 text-xs w-64"
                placeholder="Search village/city..."
              />
            </div>
            <button
              onClick={() => fetchWeatherData(location)}
              className="px-4 py-2 rounded-xl gradient-btn-green font-bold text-xs"
            >
              Search
            </button>
          </div>
        </div>

        {weather ? (
          <>
            {/* Current Weather Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <GlassCard className="p-6 space-y-2 border-[#76B85A]/40">
                <div className="flex items-center justify-between text-[#A8C99A] text-xs">
                  <span>TEMPERATURE</span>
                  <Thermometer className="w-4 h-4 text-[#76B85A]" />
                </div>
                <p className="text-4xl font-extrabold text-[#F7FAF4]">{weather.temp}°C</p>
                <p className="text-xs text-[#EEF3E5]/70">Feels like {weather.feelsLike}°C</p>
              </GlassCard>

              <GlassCard className="p-6 space-y-2">
                <div className="flex items-center justify-between text-[#A8C99A] text-xs">
                  <span>HUMIDITY</span>
                  <Droplets className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-4xl font-extrabold text-[#F7FAF4]">{weather.humidity}%</p>
                <p className="text-xs text-amber-400 font-semibold">Fungal spore development risk</p>
              </GlassCard>

              <GlassCard className="p-6 space-y-2">
                <div className="flex items-center justify-between text-[#A8C99A] text-xs">
                  <span>RAIN PROBABILITY</span>
                  <CloudRain className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-4xl font-extrabold text-[#F7FAF4]">{weather.rainProb}%</p>
                <p className="text-xs text-[#EEF3E5]/70">Scattered afternoon showers</p>
              </GlassCard>

              <GlassCard className="p-[#6] space-y-2">
                <div className="flex items-center justify-between text-[#A8C99A] text-xs">
                  <span>WIND SPEED</span>
                  <Wind className="w-4 h-4 text-teal-400" />
                </div>
                <p className="text-4xl font-extrabold text-[#F7FAF4]">{weather.windSpeed} <span className="text-sm font-normal">km/h</span></p>
                <p className="text-xs text-[#76B85A] font-semibold">Safe for foliage spraying</p>
              </GlassCard>

            </div>

            {/* AI Field Recommendation Card */}
            <GlassCard className="p-6 bg-gradient-to-r from-[#123C29] to-[#0B2A1D] border-[#76B85A]/40">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#76B85A]/20 border border-[#76B85A]/40 flex items-center justify-center text-[#76B85A] shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#76B85A] uppercase tracking-wider">AI CROP WEATHER ADVISORY</span>
                  <h3 className="text-base font-bold text-[#F7FAF4]">Field Activity Recommendation</h3>
                  <p className="text-xs text-[#EEF3E5]/80 leading-relaxed">
                    {weather.fieldActivityRecommendation}
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Hourly Forecast Temperature & Rain Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Temp Curve Chart (7 cols) */}
              <GlassCard className="lg:col-span-7 p-6 space-y-4">
                <h3 className="font-bold text-base text-[#F7FAF4]">Hourly Temperature (°C)</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#76B85A" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#76B85A" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" stroke="#A8C99A" fontSize={11} />
                      <YAxis stroke="#A8C99A" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0B2A1D', borderColor: '#76B85A', borderRadius: '12px' }}
                        itemStyle={{ color: '#F7FAF4', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="temp" stroke="#76B85A" strokeWidth={3} fillOpacity={1} fill="url(#tempGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Rain Chance Bar Chart (5 cols) */}
              <GlassCard className="lg:col-span-5 p-6 space-y-4">
                <h3 className="font-bold text-base text-[#F7FAF4]">Rain Probability (%)</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="time" stroke="#A8C99A" fontSize={11} />
                      <YAxis stroke="#A8C99A" fontSize={11} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0B2A1D', borderColor: '#38bdf8', borderRadius: '12px' }}
                        itemStyle={{ color: '#F7FAF4', fontSize: '12px' }}
                      />
                      <Bar dataKey="rainProb" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

            </div>

            {/* 5-Day Forecast Grid */}
            <GlassCard className="p-6 space-y-6">
              <h3 className="font-bold text-lg text-[#F7FAF4]">5-Day Crop Weather Forecast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {weather.daily.map((day, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#0B2A1D] border border-white/5 text-center space-y-2">
                    <p className="font-bold text-sm text-[#F7FAF4]">{day.day}</p>
                    <CloudSun className="w-8 h-8 text-[#76B85A] mx-auto" />
                    <p className="text-xs text-[#EEF3E5]/70">{day.condition}</p>
                    <div className="flex items-center justify-center gap-2 text-xs font-bold pt-1">
                      <span className="text-[#76B85A]">{day.tempMax}°</span>
                      <span className="text-[#A8C99A]/60">{day.tempMin}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </>
        ) : (
          <div className="py-20 text-center text-sm text-[#A8C99A]">Loading weather information...</div>
        )}

      </div>
    </div>
  );
}
