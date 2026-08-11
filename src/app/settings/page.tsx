'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { 
  Key, Volume2, ShieldCheck, CheckCircle2, User as UserIcon
} from 'lucide-react';
import { UserSettings, User } from '@/types';
import { db } from '@/lib/storage/db';

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    ambientAudio: false,
    ambientVolume: 30,
    apiKeyGemini: '',
    apiKeyOpenWeather: '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setUser(db.getUser());
    setSettings(db.getSettings());
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveSettings(settings);
    if (user) db.setUser(user);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#071C14] flex">
      <Sidebar />

      <div className="flex-1 p-4 lg:p-8 max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#76B85A] tracking-wider uppercase">SYSTEM CONTROL</span>
            <Badge variant="healthy">English</Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-[#F7FAF4] mt-1">Application Settings</h1>
          <p className="text-xs text-[#A8C99A]">Manage profile details, audio preferences, and live API credentials.</p>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-[#3D8B55]/20 border border-[#76B85A]/50 text-xs font-bold text-[#76B85A] flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-[#76B85A]" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-6">
          
          {/* User Profile Info */}
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#76B85A]">
              <UserIcon className="w-5 h-5" />
              <h3 className="font-bold text-base text-[#F7FAF4]">Farmer Profile</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#A8C99A]">FULL NAME</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  onChange={(e) => setUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="glass-input p-3 w-full"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#A8C99A]">FARM LOCATION</label>
                <input
                  type="text"
                  value={user?.location || ''}
                  onChange={(e) => setUser(prev => prev ? { ...prev, location: e.target.value } : null)}
                  className="glass-input p-3 w-full"
                />
              </div>
            </div>
          </GlassCard>

          {/* Audio Preferences */}
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#76B85A]">
              <Volume2 className="w-5 h-5" />
              <h3 className="font-bold text-base text-[#F7FAF4]">Audio Preferences</h3>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer">
                <span>Enable Ambient Farm Audio</span>
                <input
                  type="checkbox"
                  checked={settings.ambientAudio || false}
                  onChange={(e) => setSettings({ ...settings, ambientAudio: e.target.checked })}
                  className="accent-[#76B85A]"
                />
              </label>

              <div className="space-y-1 pt-2">
                <div className="flex items-center justify-between text-[#A8C99A]">
                  <span>Ambient Audio Volume</span>
                  <span className="font-mono text-[#76B85A]">{settings.ambientVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.ambientVolume}
                  onChange={(e) => setSettings({ ...settings, ambientVolume: Number(e.target.value) })}
                  className="w-full accent-[#76B85A]"
                />
              </div>
            </div>
          </GlassCard>

          {/* Live API Keys Management */}
          <GlassCard className="p-6 space-y-4 border-[#76B85A]/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#76B85A]">
                <Key className="w-5 h-5" />
                <h3 className="font-bold text-base text-[#F7FAF4]">API Keys & Integrations</h3>
              </div>
              <Badge variant="healthy">Live Mode Ready</Badge>
            </div>

            <p className="text-xs text-[#A8C99A]">
              AgriPulse AI operates in Demo Mode out of the box. Enter your custom API credentials below to switch to live cloud services.
            </p>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#A8C99A]">GEMINI VISION / ASSISTANT API KEY</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={settings.apiKeyGemini || ''}
                  onChange={(e) => setSettings({ ...settings, apiKeyGemini: e.target.value })}
                  className="glass-input p-3 w-full font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#A8C99A]">OPENWEATHERMAP API KEY</label>
                <input
                  type="password"
                  placeholder="2b8e4f..."
                  value={settings.apiKeyOpenWeather || ''}
                  onChange={(e) => setSettings({ ...settings, apiKeyOpenWeather: e.target.value })}
                  className="glass-input p-3 w-full font-mono"
                />
              </div>
            </div>
          </GlassCard>

          {/* Submit Button */}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl gradient-btn-green font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(118,184,90,0.3)]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
