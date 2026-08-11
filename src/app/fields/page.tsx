'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/navigation/Sidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Sprout, Plus, MapPin, Trash2, Edit2, Scan, ArrowRight, X } from 'lucide-react';
import { CropField } from '@/types';
import { db } from '@/lib/storage/db';

export default function FieldsPage() {
  const [fields, setFields] = useState<CropField[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [fieldName, setFieldName] = useState('');
  const [fieldLocation, setFieldLocation] = useState('Vijayawada, Andhra Pradesh');
  const [cropType, setCropType] = useState('Rice / Paddy');
  const [areaAcres, setAreaAcres] = useState('3.5');
  const [cropAgeDays, setCropAgeDays] = useState('40');
  const [irrigationMethod, setIrrigationMethod] = useState<'Drip' | 'Sprinkler' | 'Flood' | 'Rainfed'>('Flood');

  useEffect(() => {
    setFields(db.getFields());
  }, []);

  const handleCreateField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldName) return;

    const newField = db.saveField({
      userId: 'farmer-1',
      name: fieldName,
      location: fieldLocation,
      cropType,
      areaAcres: parseFloat(areaAcres) || 1,
      cropAgeDays: parseInt(cropAgeDays) || 30,
      irrigationMethod,
      soilType: 'Alluvial Soil',
    });

    setFields(db.getFields());
    setShowAddModal(false);
    setFieldName('');
  };

  const handleDeleteField = (id: string) => {
    if (confirm('Are you sure you want to delete this field entry?')) {
      db.deleteField(id);
      setFields(db.getFields());
    }
  };

  return (
    <div className="min-h-screen bg-[#071C14] flex">
      <Sidebar />

      <div className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-bold text-[#76B85A] tracking-wider uppercase">FARMING PLOTS</span>
            <h1 className="text-3xl font-extrabold text-[#F7FAF4] mt-1">My Fields</h1>
            <p className="text-xs text-[#A8C99A] mt-1">
              Manage your registered agricultural land plots, crop types, and irrigation profiles.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl gradient-btn-green font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(118,184,90,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Field</span>
          </button>
        </div>

        {/* Fields List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((field) => (
            <GlassCard key={field.id} hoverEffect className="p-6 space-y-6 flex flex-col justify-between border-white/10">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#3D8B55]/30 border border-[#76B85A]/40 flex items-center justify-center text-[#76B85A]">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <button
                    onClick={() => handleDeleteField(field.id)}
                    className="p-1.5 rounded-lg text-[#EEF3E5]/50 hover:text-red-400 hover:bg-white/5"
                    title="Delete field"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-[#F7FAF4]">{field.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#A8C99A] mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#76B85A]" />
                    <span>{field.location}</span>
                  </div>
                </div>

                {/* Parameters */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#0B2A1D] border border-white/5 space-y-0.5">
                    <span className="text-[10px] text-[#A8C99A]">CROP</span>
                    <p className="font-bold text-[#F7FAF4]">{field.cropType}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0B2A1D] border border-white/5 space-y-0.5">
                    <span className="text-[10px] text-[#A8C99A]">AREA</span>
                    <p className="font-bold text-[#F7FAF4]">{field.areaAcres} Acres</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0B2A1D] border border-white/5 space-y-0.5">
                    <span className="text-[10px] text-[#A8C99A]">CROP AGE</span>
                    <p className="font-bold text-[#F7FAF4]">{field.cropAgeDays} Days</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0B2A1D] border border-white/5 space-y-0.5">
                    <span className="text-[10px] text-[#A8C99A]">IRRIGATION</span>
                    <p className="font-bold text-[#76B85A]">{field.irrigationMethod}</p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <Link
                href={`/analyze?crop=${encodeURIComponent(field.cropType)}&location=${encodeURIComponent(field.location)}`}
                className="w-full py-2.5 rounded-xl bg-[#123C29] hover:bg-[#3D8B55] text-xs font-bold text-[#F7FAF4] flex items-center justify-center gap-2 transition-all mt-4 border border-white/10"
              >
                <Scan className="w-4 h-4 text-[#76B85A]" />
                <span>Analyze This Field</span>
              </Link>
            </GlassCard>
          ))}
        </div>

        {/* Modal: Add Field */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-md glass-card border border-[#76B85A]/40 p-6">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <h3 className="font-bold text-lg text-[#F7FAF4]">Add New Agricultural Plot</h3>
                <button onClick={() => setShowAddModal(false)} className="p-1 text-[#EEF3E5]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateField} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#A8C99A]">FIELD NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. South Chilli Field"
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    className="glass-input p-3 w-full"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#A8C99A]">LOCATION</label>
                  <input
                    type="text"
                    required
                    value={fieldLocation}
                    onChange={(e) => setFieldLocation(e.target.value)}
                    className="glass-input p-3 w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#A8C99A]">CROP TYPE</label>
                    <select
                      value={cropType}
                      onChange={(e) => setCropType(e.target.value)}
                      className="glass-input p-3 w-full bg-[#0B2A1D]"
                    >
                      <option value="Rice / Paddy">Rice / Paddy</option>
                      <option value="Chilli">Chilli</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Tomato">Tomato</option>
                      <option value="Maize">Maize</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#A8C99A]">AREA (ACRES)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={areaAcres}
                      onChange={(e) => setAreaAcres(e.target.value)}
                      className="glass-input p-3 w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#A8C99A]">CROP AGE (DAYS)</label>
                    <input
                      type="number"
                      value={cropAgeDays}
                      onChange={(e) => setCropAgeDays(e.target.value)}
                      className="glass-input p-3 w-full"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#A8C99A]">IRRIGATION METHOD</label>
                    <select
                      value={irrigationMethod}
                      onChange={(e) => setIrrigationMethod(e.target.value as any)}
                      className="glass-input p-3 w-full bg-[#0B2A1D]"
                    >
                      <option value="Flood">Flood</option>
                      <option value="Drip">Drip</option>
                      <option value="Sprinkler">Sprinkler</option>
                      <option value="Rainfed">Rainfed</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-[#EEF3E5]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl gradient-btn-green font-bold text-[#071C14]"
                  >
                    Save Field
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
