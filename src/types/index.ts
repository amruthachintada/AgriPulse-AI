export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  createdAt: string;
}

export interface CropField {
  id: string;
  userId: string;
  name: string;
  location: string;
  cropType: string;
  areaAcres: number;
  cropAgeDays: number;
  irrigationMethod: string;
  soilType: string;
  createdAt: string;
  healthScore?: number;
}

export interface ActionWindow {
  recommendedTime: string;
  rainRisk: string;
  windCondition: string;
  humidityLevel: string;
  isSuitable: boolean;
  reasoning: string;
}

export interface CropAnalysisResult {
  id: string;
  userId?: string;
  fieldId?: string;
  cropName: string;
  imageUrl: string;
  diagnosis: string;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  symptoms: string[];
  possibleCauses: string[];
  recommendedActions: string[];
  preventiveMeasures: string[];
  whatNotToDo: string[];
  weatherRisk: string;
  actionWindow: ActionWindow;
  nextCheckHours: number;
  createdAt: string;
  location: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  rainProb: number;
  condition: string;
  icon: string;
}

export interface DailyForecast {
  day: string;
  tempMax: number;
  tempMin: number;
  rainProb: number;
  condition: string;
  icon: string;
}

export interface WeatherInfo {
  location: string;
  temp: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  rainProb: number;
  windSpeed: number;
  uvIndex: number;
  cloudCover: number;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  aiInsight: string;
  fieldActivityRecommendation: string;
  updatedAt: string;
}

export interface Advisory {
  id: string;
  title: string;
  category: 'Pest Risk' | 'Weather' | 'Irrigation' | 'Fertilizer' | 'Market';
  severity: 'Low' | 'Moderate' | 'High';
  date: string;
  explanation: string;
  recommendedAction: string;
  affectedCrops: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  audioUrl?: string;
  imageUrl?: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface UserSettings {
  ambientAudio: boolean;
  ambientVolume: number;
  apiKeyGemini?: string;
  apiKeyOpenWeather?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'weather' | 'disease' | 'reminder' | 'market';
  date: string;
  read: boolean;
}
