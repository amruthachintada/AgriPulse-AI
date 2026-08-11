import { ChatMessage, CropAnalysisResult, WeatherInfo, CropField } from '@/types';

export interface AssistantContext {
  activeScreen?: string;
  latestCropAnalysis?: CropAnalysisResult | null;
  currentWeather?: WeatherInfo | null;
  userFields?: CropField[];
}

export async function generateAssistantResponse(
  userQuery: string,
  chatHistory: ChatMessage[],
  context?: AssistantContext,
  apiKeyOverride?: string
): Promise<string> {
  const apiKey = apiKeyOverride || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  const systemPrompt = `
You are AgriPulse AI, an expert agricultural AI assistant designed to help farmers optimize yield, manage pests, understand weather impacts, and make safer farming decisions.

CORE BEHAVIOR:
- Respond in clear, natural, friendly, and practical English.
- Keep spoken/conversational answers concise and actionable (2 to 4 sentences).
- Address crop symptoms, weather spraying windows, irrigation advice, and preventive measures directly.

CURRENT CONTEXT:
Active Screen: ${context?.activeScreen || 'General'}
Latest Crop Analysis: ${context?.latestCropAnalysis ? JSON.stringify(context.latestCropAnalysis.diagnosis) : 'None'}
Current Weather: ${context?.currentWeather ? `${context.currentWeather.temp}°C, ${context.currentWeather.condition}` : 'Not available'}
User Fields: ${context?.userFields ? context.userFields.map(f => `${f.name} (${f.cropType})`).join(', ') : 'None'}
`;

  if (apiKey && process.env.GEMINI_API_KEY) {
    try {
      const contents = [
        {
          parts: [{ text: systemPrompt }]
        },
        ...chatHistory.slice(-6).map(m => ({
          parts: [{ text: `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.text}` }]
        })),
        {
          parts: [{ text: `User: ${userQuery}` }]
        }
      ];

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents })
        }
      );

      const data = await response.json();
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (answer && answer.trim().length > 0) {
        return answer.trim();
      }
    } catch (err) {
      console.warn('Gemini Assistant API failed, using fallback responses', err);
    }
  }

  // Fallback Rule Engine for English queries
  return generateFallbackAnswer(userQuery, context);
}

function generateFallbackAnswer(query: string, context?: AssistantContext): string {
  const q = query.toLowerCase();

  if (q.includes('yellow') || q.includes('blight') || q.includes('spot') || q.includes('disease') || q.includes('leaf')) {
    const cropName = context?.latestCropAnalysis?.cropName || 'paddy crop';
    return `Yellowing foliage on your ${cropName} can be caused by nutrient deficiency, moisture stress, or bacterial leaf blight. Check lower leaf margins for wavy discoloration. If weather humidity is high, delay unnecessary flooding and allow field soil to dry slightly.`;
  }

  if (q.includes('rain') || q.includes('spray') || q.includes('weather') || q.includes('wind')) {
    if (context?.currentWeather) {
      return `The current weather in ${context.currentWeather.location} is ${context.currentWeather.temp}°C with ${context.currentWeather.rainProb}% rain chance. ${context.currentWeather.fieldActivityRecommendation}`;
    }
    return `It is best to conduct foliar spraying during calm late afternoon hours when wind speed is low (<10 km/h) and no rain is forecasted within 4 to 6 hours.`;
  }

  if (q.includes('fertilizer') || q.includes('urea') || q.includes('nitrogen') || q.includes('npk')) {
    return `For optimal crop uptake, apply balanced NPK fertilizers split across crop growth stages. Avoid excess nitrogen during active pest or bacterial outbreaks to prevent rapid disease proliferation.`;
  }

  if (q.includes('field') || q.includes('crop') || q.includes('water') || q.includes('irrigation')) {
    return `Drip irrigation during early morning (5:30 AM – 7:30 AM) minimizes evaporation loss by up to 30%. Ensure proper drainage in low-lying field plots.`;
  }

  return `AgriPulse AI is monitoring your field conditions. Based on your current setup, maintain regular leaf inspection, check 5-day weather forecasts before spraying, and keep field drainage channels clear.`;
}
