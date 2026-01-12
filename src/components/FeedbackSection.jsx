import { useState, useRef, useEffect } from 'react';

/**
 * FeedbackSection Component - Shows success/error feedback
 */
function FeedbackSection({
  isVisible,
  isCorrect,
  similarity,
  spokenWord,
  correctWord,
  errorMessage,
  audioUrl, // Al-Furqan API audio URL
  triesLeft,
  autoPlayAudio = false, // Auto-play on wrong answer
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Auto-play audio when feedback shows and autoPlayAudio is true
  useEffect(() => {
    if (isVisible && autoPlayAudio && !isCorrect && audioRef.current) {
      // Small delay to ensure component is mounted
      const timer = setTimeout(() => {
        audioRef.current?.play();
        setIsPlaying(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoPlayAudio, isCorrect]);

  if (!isVisible) return null;

  // Clean spoken word (remove punctuation)
  const cleanSpokenWord = spokenWord?.replace(/[.,،؟?!:;"'()\[\]{}]/g, '').trim();

  // Get feedback message based on similarity and tries
  const getFeedbackMessage = () => {
    if (isCorrect) return 'رائع! نطقت الكلمة بشكل صحيح 🌟';
    if (errorMessage) return errorMessage;
    
    // Show tries left in message
    const triesMsg = triesLeft > 0 ? ` (متبقي ${triesLeft} محاولات)` : '';
    
    // Dynamic messages based on similarity
    if (similarity >= 80) return `قربت جداً! حاول مرة تانية 💪${triesMsg}`;
    if (similarity >= 60) return `قربت! ركز في النطق وحاول تاني 🔄${triesMsg}`;
    if (similarity >= 40) return `محتاج تركيز أكتر! اسمع النطق الصحيح 🎙️${triesMsg}`;
    return `خطأ! استمع للنطق الصحيح وحاول مرة أخرى ❌${triesMsg}`;
  };

  // Get icon based on similarity
  const getIcon = () => {
    if (isCorrect) return '✅';
    if (similarity >= 80) return '🟡';
    if (similarity >= 60) return '🟠';
    if (similarity >= 40) return '🟠';
    return '❌';
  };

  // Get color classes based on similarity
  const getColorClasses = () => {
    if (isCorrect) return {
      border: 'border-green-500 bg-green-50 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
      details: 'text-green-700 dark:text-green-300',
      bar: 'bg-green-500',
    };
    if (similarity >= 60) return {
      border: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
      text: 'text-yellow-600 dark:text-yellow-400',
      details: 'text-yellow-700 dark:text-yellow-300',
      bar: 'bg-gradient-to-r from-yellow-500 to-green-500',
    };
    return {
      border: 'border-red-500 bg-red-50 dark:bg-red-900/20',
      text: 'text-red-600 dark:text-red-400',
      details: 'text-red-700 dark:text-red-300',
      bar: 'bg-gradient-to-r from-red-500 to-yellow-500',
    };
  };

  const colors = getColorClasses();

  // Play audio from Al-Furqan API
  const handlePlayCorrect = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div
      className={`
        animate-slide-in mt-6 rounded-lg p-5 border-2
        ${colors.border}
      `}
    >
      {/* Icon */}
      <div className="mb-3 text-center text-4xl">
        {getIcon()}
      </div>

      {/* Main Message */}
      <p
        className={`mb-3 text-center text-lg font-semibold ${colors.text}`}
      >
        {getFeedbackMessage()}
      </p>

      {/* Details */}
      {spokenWord && (
        <div
          className={`mb-4 text-center text-sm ${colors.details}`}
        >
          <p>
            <strong>كلمتك:</strong> "{cleanSpokenWord}"
          </p>
          <p>
            <strong>الكلمة الصحيحة:</strong> "{correctWord}"
          </p>
        </div>
      )}

      {/* Similarity Bar */}
      <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
        <div
          className={`h-full transition-all duration-500 ${colors.bar}`}
          style={{ width: `${similarity}%` }}
        />
      </div>

      {/* Similarity Score */}
      <p
        className={`mb-4 text-center text-sm font-semibold ${colors.text}`}
      >
        {isCorrect ? '✓' : ''} نسبة التطابق: {similarity}%
      </p>

      {/* Play Correct Pronunciation Button - Using Al-Furqan API */}
      {!isCorrect && (
        <div className="border-t border-gray-200 pt-4 text-center dark:border-gray-600">
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            🔊 استمع للآية من القارئ الحصري:
          </p>
          
          {/* Hidden Audio Element */}
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={handleAudioEnded}
            preload="auto"
          />
          
          <button
            onClick={handlePlayCorrect}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-all ${
              isPlaying 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-teal-500 hover:bg-teal-600'
            }`}
          >
            {isPlaying ? '⏹️ إيقاف' : '🔊 تشغيل النطق الصحيح'}
          </button>
        </div>
      )}
    </div>
  );
}

export default FeedbackSection;
