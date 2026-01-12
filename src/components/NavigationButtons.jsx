/**
 * NavigationButtons Component - Previous/Next buttons
 */
function NavigationButtons({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  isLastQuestion,
}) {
  return (
    <div className="mt-6 flex gap-3">
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={`
          flex-1 rounded-lg border-2 border-teal-500 px-4 py-3 font-semibold
          transition-all duration-200
          ${canGoPrevious
            ? 'bg-transparent text-teal-600 hover:bg-teal-500 hover:text-white dark:text-teal-400'
            : 'cursor-not-allowed border-gray-300 bg-transparent text-gray-400 dark:border-gray-600'
          }
        `}
      >
        ← السابق
      </button>
      
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className={`
          flex-1 rounded-lg border-2 border-teal-500 px-4 py-3 font-semibold
          transition-all duration-200
          ${canGoNext
            ? 'bg-transparent text-teal-600 hover:bg-teal-500 hover:text-white dark:text-teal-400'
            : 'cursor-not-allowed border-gray-300 bg-transparent text-gray-400 dark:border-gray-600'
          }
        `}
      >
        {isLastQuestion ? 'عرض النتائج' : 'التالي'} →
      </button>
    </div>
  );
}

export default NavigationButtons;
