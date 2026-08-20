declare global {
  interface Window {
    speechSynthesis: SpeechSynthesis;
  }
}

export interface SpeechSynthesisErrorEvent extends Event {
  error: string;
}

export {};