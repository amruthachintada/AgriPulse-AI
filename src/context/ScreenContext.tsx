'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CropAnalysisResult, WeatherInfo, CropField } from '@/types';

export interface ScreenContextData {
  currentScreen: string;
  latestCropAnalysis: CropAnalysisResult | null;
  currentWeather: WeatherInfo | null;
  userFields: CropField[];
}

export interface ScreenContextType extends ScreenContextData {
  setCurrentScreen: (screen: string) => void;
  setLatestCropAnalysis: (analysis: CropAnalysisResult | null) => void;
  setCurrentWeather: (weather: WeatherInfo | null) => void;
  setUserFields: (fields: CropField[]) => void;
}

const ScreenContext = createContext<ScreenContextType>({
  currentScreen: 'Home',
  latestCropAnalysis: null,
  currentWeather: null,
  userFields: [],
  setCurrentScreen: () => {},
  setLatestCropAnalysis: () => {},
  setCurrentWeather: () => {},
  setUserFields: () => {},
});

export const ScreenContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [latestCropAnalysis, setLatestCropAnalysis] = useState<CropAnalysisResult | null>(null);
  const [currentWeather, setCurrentWeather] = useState<WeatherInfo | null>(null);
  const [userFields, setUserFields] = useState<CropField[]>([]);

  return (
    <ScreenContext.Provider
      value={{
        currentScreen,
        latestCropAnalysis,
        currentWeather,
        userFields,
        setCurrentScreen,
        setLatestCropAnalysis,
        setCurrentWeather,
        setUserFields,
      }}
    >
      {children}
    </ScreenContext.Provider>
  );
};

export const useScreenContext = () => useContext(ScreenContext);
