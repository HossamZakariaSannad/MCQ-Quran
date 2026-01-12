/**
 * OptionsGrid Component - Multiple choice options display
 */
function OptionsGrid({ options, correctIndex, selectedOption, onSelect, disabled }) {
  return (
    <div className="mb-6">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        خيارات الإجابة
      </p>
      
      <div className="grid gap-3">
        {options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isCorrect = index === correctIndex;
          
          return (
            <button
              key={index}
              onClick={() => onSelect(index)}
              disabled={disabled}
              className={`
                rounded-lg border-2 px-4 py-3 text-center text-lg font-medium
                transition-all duration-200
                ${isSelected
                  ? 'border-teal-500 bg-teal-500 text-white'
                  : 'border-gray-300 bg-white hover:border-teal-400 hover:bg-teal-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600'
                }
                ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:-translate-y-0.5'}
              `}
              style={{ fontFamily: "'Droid Arabic Kufi', serif" }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default OptionsGrid;
