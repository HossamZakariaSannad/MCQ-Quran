// Speech Recognition Configuration
export const SPEECH_CONFIG = {
  // Web Speech API Settings (fallback)
  webSpeech: {
    continuous: false,
    interimResults: true,
    lang: 'ar-SA', // Modern Standard Arabic
    maxAlternatives: 3,
  },

  // Similarity threshold for correct pronunciation (0-100)
  similarityThreshold: 95,
};

export default SPEECH_CONFIG;
