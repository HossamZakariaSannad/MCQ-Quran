import { useState, useRef } from 'react';

/**
 * AyahDisplay Component - Shows the verse with missing word
 */
function AyahDisplay({ ayah, word, surah, audioUrl, showListenButton = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Replace the target word with dots placeholder (hide the answer)
  const displayAyah = ayah.replace(
    word,
    `<span class="inline-block mx-2 px-4 py-1 border-2 border-dashed border-teal-500 rounded bg-gray-100 dark:bg-gray-700 text-teal-600 dark:text-teal-400 font-bold">......</span>`
  );

  const handlePlayAyah = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="mb-6 text-center">
      {/* Surah Label */}
      {surah && (
        <span className="mb-2 inline-block rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-700 dark:bg-teal-900 dark:text-teal-300">
          سورة {surah}
        </span>
      )}
      
      {/* Label */}
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">الآية الكريمة</p>
      
      {/* Ayah Text */}
      <h2
        className="text-2xl font-semibold leading-relaxed text-teal-700 dark:text-teal-400 md:text-3xl"
        style={{ fontFamily: "'Traditional Arabic', 'Simplified Arabic', serif" }}
        dangerouslySetInnerHTML={{ __html: displayAyah }}
      />

      {/* Listen to Ayah Button - Only show after tries exhausted */}
      {audioUrl && showListenButton && (
        <div className="mt-4">
          <audio 
            ref={audioRef} 
            src={audioUrl} 
            onEnded={handleAudioEnded}
            preload="none"
          />
          <button
            onClick={handlePlayAyah}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isPlaying
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-teal-100 text-teal-700 hover:bg-teal-200 dark:bg-teal-900 dark:text-teal-300 dark:hover:bg-teal-800'
            }`}
          >
            {isPlaying ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
                إيقاف
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                استمع للآية
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default AyahDisplay;
