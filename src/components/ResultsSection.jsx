/**
 * ResultsSection Component - Final quiz results
 */
function ResultsSection({ totalQuestions, correctAnswers, onRestart }) {
  const successRate = Math.round((correctAnswers / totalQuestions) * 100);
  
  // Determine performance message
  const getPerformanceMessage = () => {
    if (successRate >= 90) return { emoji: '🏆', message: 'ممتاز! أداء رائع!' };
    if (successRate >= 70) return { emoji: '🌟', message: 'جيد جداً! استمر!' };
    if (successRate >= 50) return { emoji: '💪', message: 'جيد! تحتاج للمزيد من الممارسة' };
    return { emoji: '📚', message: 'استمر في الممارسة!' };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="animate-slide-in rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
      <div className="mb-6 text-center">
        <span className="text-6xl">{performance.emoji}</span>
        <h3 className="mt-4 text-2xl font-bold text-teal-600 dark:text-teal-400">
          📊 ملخص النتائج
        </h3>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          {performance.message}
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-300 bg-white p-4 text-center dark:border-gray-600 dark:bg-gray-700">
          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
            إجمالي الأسئلة
          </p>
          <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">
            {totalQuestions}
          </p>
        </div>

        <div className="rounded-lg border border-gray-300 bg-white p-4 text-center dark:border-gray-600 dark:bg-gray-700">
          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
            الإجابات الصحيحة
          </p>
          <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">
            {correctAnswers}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-gray-300 bg-white p-6 text-center dark:border-gray-600 dark:bg-gray-700">
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">معدل النجاح</p>
        
        {/* Progress Circle */}
        <div className="relative mx-auto mb-4 h-32 w-32">
          <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-600"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${successRate * 2.51} 251`}
              strokeLinecap="round"
              className="text-teal-500 transition-all duration-1000"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-teal-600 dark:text-teal-400">
            {successRate}%
          </span>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="w-full rounded-lg bg-teal-500 px-6 py-4 text-lg font-semibold text-white transition-all hover:bg-teal-600 hover:shadow-lg"
      >
        🔄 إعادة المحاولة
      </button>
    </div>
  );
}

export default ResultsSection;
