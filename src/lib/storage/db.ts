import { CropField, CropAnalysisResult, Advisory, NotificationItem, UserSettings, User } from '@/types';

const INITIAL_FIELDS: CropField[] = [
  {
    id: 'field-1',
    userId: 'farmer-1',
    name: 'East Paddy Field',
    location: 'Vijayawada, Andhra Pradesh',
    cropType: 'Rice / Paddy',
    areaAcres: 4.5,
    cropAgeDays: 45,
    irrigationMethod: 'Flood',
    soilType: 'Alluvial',
    createdAt: '2026-07-15T08:00:00Z',
    healthScore: 88,
  },
  {
    id: 'field-2',
    userId: 'farmer-1',
    name: 'Chilli Block A',
    location: 'Guntur, Andhra Pradesh',
    cropType: 'Chilli',
    areaAcres: 2.0,
    cropAgeDays: 60,
    irrigationMethod: 'Drip',
    soilType: 'Black Cotton',
    createdAt: '2026-06-20T10:30:00Z',
    healthScore: 74,
  },
  {
    id: 'field-3',
    userId: 'farmer-1',
    name: 'North Cotton Patch',
    location: 'Warangal, Telangana',
    cropType: 'Cotton',
    areaAcres: 3.5,
    cropAgeDays: 30,
    irrigationMethod: 'Rainfed',
    soilType: 'Red Soil',
    createdAt: '2026-07-01T09:15:00Z',
    healthScore: 92,
  }
];

const INITIAL_HISTORY: CropAnalysisResult[] = [
  {
    id: 'analysis-1',
    userId: 'farmer-1',
    fieldId: 'field-1',
    cropName: 'Rice / Paddy',
    imageUrl: '/images/leaf_blight_sample.png',
    diagnosis: 'Likely Bacterial Leaf Blight',
    confidence: 87,
    severity: 'Moderate',
    symptoms: [
      'Water-soaked lesions on leaf margins',
      'Yellowing striping moving towards center',
      'Wilting leaf tips on upper canopy'
    ],
    possibleCauses: [
      'Xanthomonas oryzae pv. oryzae bacterial infection',
      'High relative humidity (>85%) combined with warm temperature',
      'Excess nitrogen fertilizer application'
    ],
    recommendedActions: [
      'Inspect surrounding plants for early streak progression',
      'Drain excess standing water from paddy basin temporarily',
      'Apply copper hydroxide or recommended bactericide if severity increases',
      'Avoid field activity while foliage is wet from morning dew'
    ],
    preventiveMeasures: [
      'Use resistant seed varieties in upcoming cropping cycles',
      'Maintain field hygiene and weed-free bunds',
      'Balance potassium and nitrogen fertilizer ratios'
    ],
    whatNotToDo: [
      'Do NOT apply excessive urea or nitrogenous fertilizer during outbreaks',
      'Do NOT spray chemical solutions immediately before anticipated rainfall',
      'Do NOT allow irrigation runoff water to flow from infected to healthy fields'
    ],
    weatherRisk: 'High humidity and warm days favor bacterial proliferation.',
    actionWindow: {
      recommendedTime: 'Tomorrow 4:00 PM – 6:00 PM',
      rainRisk: 'Low',
      windCondition: 'Moderate (8 km/h)',
      humidityLevel: '68%',
      isSuitable: true,
      reasoning: 'Low rain risk and moderate wind create optimal foliage spraying conditions.'
    },
    nextCheckHours: 48,
    createdAt: '2026-08-10T14:30:00Z',
    location: 'Vijayawada, Andhra Pradesh'
  }
];

const INITIAL_ADVISORIES: Advisory[] = [
  {
    id: 'adv-1',
    title: 'High Humidity Fungal Risk Warning',
    category: 'Pest Risk',
    severity: 'High',
    date: '2026-08-11',
    explanation: 'Relative humidity levels above 85% with warm night temperatures significantly increase rice blast and chilli leaf spot incidence across Krishna district.',
    recommendedAction: 'Inspect crop canopies morning and evening. Ensure proper air circulation in dense foliage.',
    affectedCrops: ['Rice / Paddy', 'Chilli', 'Tomato']
  },
  {
    id: 'adv-2',
    title: 'Upcoming Rain & Spraying Advisory',
    category: 'Weather',
    severity: 'Moderate',
    date: '2026-08-11',
    explanation: 'Scattered rainfall is forecasted in 36 hours. Chemical sprays applied less than 4 hours before rainfall will wash off.',
    recommendedAction: 'Complete any pending foliar nutrition or crop protection sprays during the 4 PM – 6 PM window today.',
    affectedCrops: ['Cotton', 'Maize', 'Chilli']
  },
  {
    id: 'adv-3',
    title: 'Drip Irrigation Efficiency Tip',
    category: 'Irrigation',
    severity: 'Low',
    date: '2026-08-09',
    explanation: 'High soil evaporation during afternoon peak temperatures causes up to 30% water loss in surface irrigation.',
    recommendedAction: 'Schedule drip irrigation early morning (5:30 AM – 7:30 AM) or post 6 PM.',
    affectedCrops: ['Chilli', 'Groundnut', 'Sugarcane']
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Rain Warning',
    message: 'Rain expected tomorrow evening. Consider delaying spraying activity.',
    type: 'weather',
    date: '10 mins ago',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Crop Inspection Reminder',
    message: 'Time to re-check East Paddy Field (Leaf Blight monitoring - 48h check).',
    type: 'reminder',
    date: '2 hours ago',
    read: false,
  }
];

const DEFAULT_SETTINGS: UserSettings = {
  ambientAudio: false,
  ambientVolume: 30,
};

const DEFAULT_USER: User = {
  id: 'farmer-1',
  name: 'Farmer Friend',
  email: 'farmer@agripulse.ai',
  location: 'Vijayawada, Andhra Pradesh',
  createdAt: '2026-01-01T00:00:00Z',
};

export const db = {
  getUser(): User {
    if (typeof window === 'undefined') return DEFAULT_USER;
    const data = localStorage.getItem('agripulse_user');
    return data ? JSON.parse(data) : DEFAULT_USER;
  },
  setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('agripulse_user', JSON.stringify(user));
  },
  getFields(): CropField[] {
    if (typeof window === 'undefined') return INITIAL_FIELDS;
    const data = localStorage.getItem('agripulse_fields');
    return data ? JSON.parse(data) : INITIAL_FIELDS;
  },
  saveField(field: Omit<CropField, 'id' | 'createdAt'>): CropField {
    const fields = this.getFields();
    const newField: CropField = {
      ...field,
      id: `field-${Date.now()}`,
      createdAt: new Date().toISOString(),
      healthScore: 85,
    };
    fields.unshift(newField);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agripulse_fields', JSON.stringify(fields));
    }
    return newField;
  },
  deleteField(id: string): void {
    const fields = this.getFields().filter(f => f.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agripulse_fields', JSON.stringify(fields));
    }
  },
  getHistory(): CropAnalysisResult[] {
    if (typeof window === 'undefined') return INITIAL_HISTORY;
    const data = localStorage.getItem('agripulse_history');
    return data ? JSON.parse(data) : INITIAL_HISTORY;
  },
  saveAnalysis(result: Omit<CropAnalysisResult, 'id' | 'createdAt'>): CropAnalysisResult {
    const history = this.getHistory();
    const newEntry: CropAnalysisResult = {
      ...result,
      id: `analysis-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    history.unshift(newEntry);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agripulse_history', JSON.stringify(history));
    }
    return newEntry;
  },
  getAdvisories(): Advisory[] {
    if (typeof window === 'undefined') return INITIAL_ADVISORIES;
    const data = localStorage.getItem('agripulse_advisories');
    return data ? JSON.parse(data) : INITIAL_ADVISORIES;
  },
  getNotifications(): NotificationItem[] {
    if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
    const data = localStorage.getItem('agripulse_notifs');
    return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
  },
  getSettings(): UserSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    const data = localStorage.getItem('agripulse_settings');
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  },
  saveSettings(settings: UserSettings): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('agripulse_settings', JSON.stringify(settings));
    }
  }
};
