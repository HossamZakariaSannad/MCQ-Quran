/**
 * StatsDisplay Component - Shows current score and question number
 */
function StatsDisplay({ currentQuestion, totalQuestions, correctAnswers }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4">
      <div className="rounded-lg border border-gray-300 bg-white p-4 text-center dark:border-gray-600 dark:bg-gray-800">
        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">السؤال الحالي</p>
        <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">
          {currentQuestion}
        </p>
      </div>
      
      <div className="rounded-lg border border-gray-300 bg-white p-4 text-center dark:border-gray-600 dark:bg-gray-800">
        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">الإجابات الصحيحة</p>
        <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">
          {correctAnswers}
        </p>
      </div>
    </div>
  );
}

export default StatsDisplay;
