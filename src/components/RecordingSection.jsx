/**
 * RecordingSection Component - Microphone recording UI
 */
function RecordingSection({
  isRecording,
  isProcessing,
  transcript,
  isSupported,
  onStartRecording,
  onStopRecording,
  triesCount = 0,
  maxTries = 3,
  disabled = false,
}) {
  const triesLeft = maxTries - triesCount;
  const isTriesExhausted = triesLeft <= 0;
  
  return (
    <div className="mb-6 rounded-lg border-2 border-teal-500 bg-white p-6 text-center dark:bg-gray-800">
      {/* Browser Warning */}
      {!isSupported && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          ⚠️ متصفحك قد لا يدعم التعرف على الكلام. الرجاء استخدام Chrome أو Edge.
        </div>
      )}

      {/* Tries Counter */}
      <div className="mb-3 flex items-center justify-center gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">المحاولات المتبقية:</span>
        <div className="flex gap-1">
          {[...Array(maxTries)].map((_, i) => (
            <span
              key={i}
              className={`h-3 w-3 rounded-full ${
                i < triesLeft ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
          ({triesLeft}/{maxTries})
        </span>
      </div>

      {/* Mic Icon */}
      <div
        className={`mb-4 text-5xl ${isRecording ? 'animate-pulse-recording' : ''}`}
      >
        🎤
      </div>

      {/* Instructions */}
      <p className="mb-4 text-gray-500 dark:text-gray-400">
        اضغط على الزر أدناه وانطق الكلمة الصحيحة
      </p>

      {/* Recording Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {!isRecording ? (
          <button
            onClick={onStartRecording}
            disabled={!isSupported || isProcessing || disabled || isTriesExhausted}
            className={`
              inline-flex items-center gap-2 rounded-lg px-6 py-3 text-lg font-semibold text-white
              shadow-md transition-all duration-200
              ${isSupported && !isProcessing && !disabled && !isTriesExhausted
                ? 'bg-teal-500 hover:-translate-y-0.5 hover:bg-teal-600 hover:shadow-lg'
                : 'cursor-not-allowed bg-gray-400'
              }
            `}
          >
            <span>🎙️</span>
            <span>{isTriesExhausted ? 'انتهت المحاولات' : 'ابدأ التسجيل'}</span>
          </button>
        ) : (
          <button
            onClick={onStopRecording}
            className="inline-flex animate-pulse items-center gap-2 rounded-lg bg-red-500 px-6 py-3 text-lg font-semibold text-white shadow-md transition-all hover:bg-red-600"
          >
            <span>⏹️</span>
            <span>إيقاف</span>
          </button>
        )}
      </div>

      {/* Status Indicator */}
      {isRecording && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white"></span>
          جاري التسجيل...
        </div>
      )}

      {isProcessing && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal-500 px-3 py-1 text-sm font-semibold text-white">
          <span className="h-2 w-2 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          جاري المعالجة...
        </div>
      )}

      {/* Transcription Display */}
      <div className="mt-4 min-h-[50px] rounded-lg border-r-4 border-teal-500 bg-gray-100 p-4 text-lg font-medium dark:bg-gray-700">
        {transcript || (isRecording ? 'جاري الاستماع... 🎧' : 'جاهز للاستماع...')}
      </div>
    </div>
  );
}

export default RecordingSection;
