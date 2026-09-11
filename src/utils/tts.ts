class SpeechGuide {
  private synth: SpeechSynthesis | null = null;
  public enabled: boolean = true;
  public isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  speak(text: string, onEnd?: () => void) {
    if (!this.synth || !this.enabled) return;
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Try finding a good Spanish voice
    const voices = this.synth.getVoices();
    const esVoice = voices.find((v) => v.lang.startsWith('es'));
    if (esVoice) {
      utterance.voice = esVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
    };
    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      this.isSpeaking = false;
    };

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }
}

export const speechGuide = new SpeechGuide();
