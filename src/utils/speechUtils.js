/**
 * Calculate similarity between two Arabic strings
 * Uses a combination of exact match and character-level comparison
 */
export function calculateSimilarity(text1, text2) {
  if (!text1 || !text2) return 0;

  // Normalize Arabic text (remove diacritics and punctuation for comparison)
  const normalize = (str) => {
    return str
      .trim()
      .replace(/[ً-ٟ]/g, '') // Remove Arabic diacritics
      .replace(/[.,،؟?!:;"'()\[\]{}]/g, '') // Remove punctuation marks
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  };

  const normalized1 = normalize(text1);
  const normalized2 = normalize(text2);

  // Exact match
  if (normalized1 === normalized2) return 100;

  // Check if one contains the other
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    const longer = normalized1.length > normalized2.length ? normalized1 : normalized2;
    const shorter = normalized1.length > normalized2.length ? normalized2 : normalized1;
    return Math.round((shorter.length / longer.length) * 100);
  }

  // Levenshtein distance for more accurate comparison
  const distance = levenshteinDistance(normalized1, normalized2);
  const maxLength = Math.max(normalized1.length, normalized2.length);
  
  if (maxLength === 0) return 100;
  
  return Math.round(((maxLength - distance) / maxLength) * 100);
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;

  // Create matrix
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  // Initialize first column and row
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  // Fill the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,     // deletion
          dp[i][j - 1] + 1,     // insertion
          dp[i - 1][j - 1] + 1  // substitution
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Check if pronunciation is correct based on similarity threshold
 */
export function isPronunciationCorrect(spoken, target, threshold = 70) {
  const similarity = calculateSimilarity(spoken, target);
  return {
    isCorrect: similarity >= threshold,
    similarity,
    spoken: spoken.trim(),
    target: target.trim(),
  };
}

/**
 * Play text using Speech Synthesis API
 */
export function speakText(text, lang = 'ar-SA', rate = 0.8) {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1;

    utterance.onend = () => resolve();
    utterance.onerror = (error) => reject(error);

    window.speechSynthesis.speak(utterance);
  });
}

export default {
  calculateSimilarity,
  isPronunciationCorrect,
  speakText,
};
