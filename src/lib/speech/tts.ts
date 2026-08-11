export class TextToSpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis || null;
    }
  }

  public isSupported(): boolean {
    return this.synth !== null;
  }

  public speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): boolean {
    if (!this.synth) {
      if (onError) onError('Speech synthesis is not supported in this browser.');
      return false;
    }

    this.stop();

    if (!text || text.trim().length === 0) return false;

    // Format text into concise, natural spoken sentences (remove markdown symbols)
    const cleanText = text
      .replace(/[*#`_-]/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    // Limit long spoken paragraphs for pleasant, conversational voice output
    const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
    const spokenText = sentences.slice(0, 4).join(' ');

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Automatically select the best available natural English voice
    const voices = this.synth.getVoices();
    const englishVoice = voices.find(
      v => (v.lang.startsWith('en-US') || v.lang.startsWith('en')) && 
           (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Karen'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      this.currentUtterance = null;
      console.warn('TTS playback notice:', event.error);
      if (onError) onError(`Voice playback notice: ${event.error}`);
    };

    this.currentUtterance = utterance;
    try {
      this.synth.speak(utterance);
      return true;
    } catch (err) {
      console.error('Failed to trigger speech synthesis', err);
      if (onError) onError('Voice playback error');
      return false;
    }
  }

  public pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {
        // ignore
      }
    }
    this.currentUtterance = null;
  }

  public getIsSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}

export const ttsEngine = new TextToSpeechEngine();
