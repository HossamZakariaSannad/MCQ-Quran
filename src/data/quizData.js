// Quiz Questions Data - Arabic Quran Verses
// Using Al-Furqan API for audio: https://alfurqan.online/docs

export const quizData = [
  {
    id: 1,
    ayah: "الحمد لله رب العالمين",
    word: "الحمد",
    options: ["الحمد", "الحادي", "الهادي"],
    correctIndex: 0,
    transliteration: "al-Hamd",
    surah: "الفاتحة",
    surahNumber: 1,
    ayahNumber: 2, // Ayah number within surah
  },
  {
    id: 2,
    ayah: "الرحمن الرحيم",
    word: "الرحيم",
    options: ["الرحيم", "التواب", "الكريم"],
    correctIndex: 0,
    transliteration: "ar-Rahim",
    surah: "الفاتحة",
    surahNumber: 1,
    ayahNumber: 3,
  },
  {
    id: 3,
    ayah: "مالك يوم الدين",
    word: "يوم",
    options: ["يوم", "يام", "قوم"],
    correctIndex: 0,
    transliteration: "Yawm",
    surah: "الفاتحة",
    surahNumber: 1,
    ayahNumber: 4,
  },
  {
    id: 4,
    ayah: "إياك نعبد وإياك نستعين",
    word: "نعبد",
    options: ["نعبد", "نعمد", "نأبد"],
    correctIndex: 0,
    transliteration: "Na'bud",
    surah: "الفاتحة",
    surahNumber: 1,
    ayahNumber: 5,
  },
  {
    id: 5,
    ayah: "اهدنا الصراط المستقيم",
    word: "الصراط",
    options: ["الصراط", "الصاط", "الشرط"],
    correctIndex: 0,
    transliteration: "as-Sirat",
    surah: "الفاتحة",
    surahNumber: 1,
    ayahNumber: 6,
  },
];

// Al-Furqan API Configuration
export const AL_FURQAN_CONFIG = {
  baseUrl: 'https://alfurqan.online',
  defaultReciter: 'husary', // Al-Husary - clear pronunciation for learning
  // Other reciters: 'abdul-basit-murattal', 'mishary-alafasy', etc.
};

// Get audio URL for an ayah
export const getAyahAudioUrl = (surahNumber, ayahNumber, reciter = AL_FURQAN_CONFIG.defaultReciter) => {
  return `${AL_FURQAN_CONFIG.baseUrl}/api/v1/audio/${reciter}/surah/${surahNumber}/ayah/${ayahNumber}`;
};

export default quizData;
