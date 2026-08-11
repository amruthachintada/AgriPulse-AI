'use client';

import React, { useState, useRef } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { AIScanner } from '@/components/crop/AIScanner';
import { 
  Upload, Camera, Scan, MapPin, AlertTriangle, ShieldCheck, 
  CheckCircle2, X, RefreshCw, Calendar, CloudRain, Wind, Droplets, ArrowRight, Save
} from 'lucide-react';
import { CropAnalysisResult } from '@/types';
import { db } from '@/lib/storage/db';

const CROPS = [
  'Rice / Paddy', 'Cotton', 'Chilli', 'Tomato', 'Maize',
  'Groundnut', 'Wheat', 'Sugarcane', 'Other'
];

export default function AnalyzePage() {
  const [selectedCrop, setSelectedCrop] = useState('Rice / Paddy');
  const [customCrop, setCustomCrop] = useState('');
  const [location, setLocation] = useState('Vijayawada, Andhra Pradesh');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Optional details
  const [cropAgeDays, setCropAgeDays] = useState('45');
  const [soilType, setSoilType] = useState('Alluvial');
  const [irrigationMethod, setIrrigationMethod] = useState('Flood');
  const [symptomsObserved, setSymptomsObserved] = useState('');

  // Scanning State
  const [isScanning, setIsScanning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CropAnalysisResult | null>(null);

  // Camera Capture state
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Handle image upload file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Geo Location trigger
  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(`Lat: ${pos.coords.latitude.toFixed(2)}, Lon: ${pos.coords.longitude.toFixed(2)}`);
        },
        () => {
          setLocation('Vijayawada, Andhra Pradesh');
        }
      );
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Camera access denied or unavailable. Please upload a photo from your file gallery.');
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setImagePreview(dataUrl);

        // Stop stream
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        setCameraActive(false);
      }
    }
  };

  // Execute Analysis
  const handleStartAnalysis = () => {
    if (!imagePreview) {
      // Use sample leaf image if no upload provided
      setImagePreview('/images/leaf_blight_sample.png');
    }
    setIsScanning(true);
  };

  // Callback when scanner animation finishes
  const handleScanComplete = async () => {
    setIsScanning(false);
    try {
      const targetCrop = selectedCrop === 'Other' ? (customCrop || 'Crop') : selectedCrop;
      const res = await fetch('/api/analyze-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview || '/images/leaf_blight_sample.png',
          cropName: targetCrop,
          location,
          extraDetails: {
            cropAgeDays: parseInt(cropAgeDays) || 45,
            soilType,
            irrigationMethod,
            symptomsObserved
          }
        })
      });
      const data: CropAnalysisResult = await res.json();
      setAnalysisResult(data);
      db.saveAnalysis(data);
    } catch (err) {
      console.error('Error conducting analysis', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#071C14] flex">
      <Sidebar />

      <div className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-white/10 pb-4">
          <span className="text-xs font-bold text-[#76B85A] tracking-wider uppercase">COMPUTER VISION AI</span>
          <h1 className="text-3xl font-extrabold text-[#F7FAF4] mt-1">Analyze Your Crop</h1>
          <p className="text-xs text-[#A8C99A] mt-1">
            Upload a clear crop or leaf image and let AI identify possible problems and actionable solutions.
          </p>
        </div>

        {/* AI Scanning Active State */}
        {isScanning && (
          <div className="py-12">
            <AIScanner
              imageSrc={imagePreview || '/images/leaf_blight_sample.png'}
              onComplete={handleScanComplete}
            />
          </div>
        )}

        {/* Input Form Stage (when not scanning and no result yet) */}
        {!isScanning && !analysisResult && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Image Upload Card (7 cols) */}
            <GlassCard className="lg:col-span-7 p-6 space-y-6">
              <h3 className="font-bold text-lg text-[#F7FAF4]">1. Select or Capture Crop Photo</h3>

              {/* Upload Dropzone */}
              <div className="relative border-2 border-dashed border-[#76B85A]/40 rounded-3xl p-6 bg-[#0B2A1D]/60 text-center hover:border-[#76B85A] transition-all">
                {imagePreview ? (
                  <div className="relative aspect-video w-full max-h-72 rounded-2xl overflow-hidden mx-auto">
                    <img
                      src={imagePreview}
                      alt="Crop preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={() => setImagePreview(null)}
                        className="p-2 rounded-full bg-red-600/80 text-white hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : cameraActive ? (
                  <div className="relative aspect-video w-full max-h-72 rounded-2xl overflow-hidden bg-black flex flex-col items-center justify-center">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <button
                      onClick={capturePhoto}
                      className="absolute bottom-4 px-6 py-2 rounded-full bg-[#76B85A] font-bold text-xs text-[#071C14]"
                    >
                      Snap Photo
                    </button>
                  </div>
                ) : (
                  <div className="py-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#3D8B55]/30 border border-[#76B85A]/40 flex items-center justify-center mx-auto text-[#76B85A]">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#F7FAF4]">Drag & drop crop photo here</p>
                      <p className="text-xs text-[#A8C99A] mt-1">Supports JPG, PNG, WEBP</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <label className="px-5 py-2.5 rounded-xl gradient-btn-green font-bold text-xs cursor-pointer">
                        Browse Files
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                      
                      <button
                        onClick={startCamera}
                        className="px-5 py-2.5 rounded-xl bg-[#123C29] border border-[#76B85A]/40 font-bold text-xs text-[#EEF3E5] flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4 text-[#76B85A]" />
                        <span>Take Photo</span>
                      </button>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <button
                        onClick={() => setImagePreview('/images/leaf_blight_sample.png')}
                        className="text-xs text-[#76B85A] hover:underline font-semibold"
                      >
                        Use Demo Leaf Blight Image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Crop Type Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#A8C99A] uppercase tracking-wider">Select Crop Type</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {CROPS.map((crop) => (
                    <button
                      key={crop}
                      onClick={() => setSelectedCrop(crop)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                        selectedCrop === crop
                          ? 'bg-[#3D8B55] border-[#76B85A] text-[#F7FAF4] shadow-[0_0_12px_rgba(61,139,85,0.4)]'
                          : 'bg-[#0B2A1D] border-white/10 text-[#EEF3E5]/80 hover:bg-white/5'
                      }`}
                    >
                      {crop}
                    </button>
                  ))}
                </div>

                {selectedCrop === 'Other' && (
                  <input
                    type="text"
                    placeholder="Enter custom crop name..."
                    value={customCrop}
                    onChange={(e) => setCustomCrop(e.target.value)}
                    className="w-full glass-input p-3 text-xs mt-2"
                  />
                )}
              </div>
            </GlassCard>

            {/* Right: Field Parameters & Location (5 cols) */}
            <GlassCard className="lg:col-span-5 p-6 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-[#F7FAF4]">2. Location & Field Details</h3>

                {/* Location Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#A8C99A]">LOCATION</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="glass-input p-3 text-xs flex-1"
                      placeholder="Village / City, State"
                    />
                    <button
                      onClick={handleUseMyLocation}
                      className="p-3 rounded-xl bg-[#123C29] border border-white/10 hover:border-[#76B85A] text-[#76B85A]"
                      title="Use My Location"
                    >
                      <MapPin className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Crop Age */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#A8C99A]">CROP AGE (DAYS)</label>
                    <input
                      type="number"
                      value={cropAgeDays}
                      onChange={(e) => setCropAgeDays(e.target.value)}
                      className="glass-input p-3 text-xs w-full"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#A8C99A]">IRRIGATION METHOD</label>
                    <select
                      value={irrigationMethod}
                      onChange={(e) => setIrrigationMethod(e.target.value)}
                      className="glass-input p-3 text-xs w-full bg-[#0B2A1D]"
                    >
                      <option value="Flood">Flood</option>
                      <option value="Drip">Drip</option>
                      <option value="Sprinkler">Sprinkler</option>
                      <option value="Rainfed">Rainfed</option>
                    </select>
                  </div>
                </div>

                {/* Observed Symptoms */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#A8C99A]">OBSERVED SYMPTOMS (OPTIONAL)</label>
                  <textarea
                    value={symptomsObserved}
                    onChange={(e) => setSymptomsObserved(e.target.value)}
                    placeholder="e.g. Yellowing spots on leaf margins started 3 days ago..."
                    className="glass-input p-3 text-xs w-full"
                    rows={3}
                  />
                </div>
              </div>

              {/* Start Analysis CTA */}
              <button
                onClick={handleStartAnalysis}
                className="w-full py-4 rounded-2xl gradient-btn-green font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(118,184,90,0.4)] mt-4"
              >
                <Scan className="w-5 h-5" />
                <span>Analyze My Crop</span>
              </button>
            </GlassCard>

          </div>
        )}

        {/* Analysis Result Screen */}
        {analysisResult && (
          <div className="space-y-8">
            
            {/* Header Action Bar */}
            <div className="flex items-center justify-between">
              <Badge variant={analysisResult.confidence >= 50 ? 'healthy' : 'danger'}>
                SCAN RESULT • AI CONFIDENCE: {analysisResult.confidence}%
              </Badge>

              <button
                onClick={() => {
                  setAnalysisResult(null);
                  setImagePreview(null);
                }}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold text-[#EEF3E5] flex items-center gap-2 hover:bg-white/15"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Analyze Another Crop</span>
              </button>
            </div>

            {/* Low Confidence Warning Header */}
            {analysisResult.confidence < 50 && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 shrink-0 text-amber-400" />
                <p>
                  "I’m not confident enough to identify this from the image. Please upload a clearer photo or consult a qualified agricultural expert."
                </p>
              </div>
            )}

            {/* Main Result Card Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Image & Diagnosis (5 cols) */}
              <GlassCard className="lg:col-span-5 p-6 space-y-6">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-[#76B85A]/30">
                  <img
                    src={analysisResult.imageUrl}
                    alt={analysisResult.cropName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant={analysisResult.severity === 'Moderate' ? 'warning' : 'healthy'}>
                      Severity: {analysisResult.severity}
                    </Badge>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#A8C99A] uppercase tracking-wider">LIKELY ISSUE DETECTED</span>
                  <h2 className="text-2xl font-extrabold text-[#76B85A] mt-1">{analysisResult.diagnosis}</h2>
                  <p className="text-xs text-[#EEF3E5]/70 mt-1">Location: {analysisResult.location}</p>
                </div>

                {/* Action Window Card */}
                <div className="p-4 rounded-2xl bg-[#0B2A1D] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F7FAF4]">BEST ACTION WINDOW</span>
                    <Badge variant="healthy">Recommended</Badge>
                  </div>
                  <p className="text-sm font-bold text-[#76B85A]">{analysisResult.actionWindow.recommendedTime}</p>
                  
                  <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-[#A8C99A]">
                    <div>Rain Risk: <span className="text-[#EEF3E5] font-semibold">{analysisResult.actionWindow.rainRisk}</span></div>
                    <div>Wind: <span className="text-[#EEF3E5] font-semibold">{analysisResult.actionWindow.windCondition}</span></div>
                    <div>Humidity: <span className="text-[#EEF3E5] font-semibold">{analysisResult.actionWindow.humidityLevel}</span></div>
                  </div>
                </div>
              </GlassCard>

              {/* What We Found & Action Steps (7 cols) */}
              <GlassCard className="lg:col-span-7 p-6 space-y-6">
                
                {/* Visible Symptoms */}
                <div>
                  <h4 className="text-xs font-bold text-[#A8C99A] uppercase tracking-wider mb-2">VISIBLE SYMPTOMS DETECTED</h4>
                  <ul className="space-y-2">
                    {analysisResult.symptoms.map((sym, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#EEF3E5]">
                        <CheckCircle2 className="w-4 h-4 text-[#76B85A] shrink-0 mt-0.5" />
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Numbered What Should I Do Cards */}
                <div>
                  <h4 className="text-xs font-bold text-[#A8C99A] uppercase tracking-wider mb-3">WHAT SHOULD I DO NOW?</h4>
                  <div className="space-y-3">
                    {analysisResult.recommendedActions.map((action, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-[#0B2A1D] border border-white/10 flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#76B85A]/20 text-[#76B85A] border border-[#76B85A]/40 font-bold text-xs flex items-center justify-center shrink-0">
                          0{idx + 1}
                        </span>
                        <p className="text-xs text-[#EEF3E5] font-medium leading-relaxed mt-0.5">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What NOT to Do Warnings */}
                <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>WHAT NOT TO DO</span>
                  </div>
                  <ul className="space-y-1 text-xs text-red-200/90 pl-6 list-disc">
                    {analysisResult.whatNotToDo.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Save Recommendation Button */}
                <div className="pt-2 flex items-center justify-between border-t border-white/10">
                  <span className="text-xs text-[#A8C99A]">Inspect crop again in {analysisResult.nextCheckHours} hours</span>
                  <button
                    onClick={() => alert('Recommendation saved to your Crop History timeline!')}
                    className="px-5 py-2.5 rounded-xl gradient-btn-green text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(118,184,90,0.3)]"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Recommendation</span>
                  </button>
                </div>

              </GlassCard>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
