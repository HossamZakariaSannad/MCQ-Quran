/**
 * Header Component - Quiz title and progress bar
 */
function Header({ currentQuestion, totalQuestions }) {
  const progress = ((currentQuestion) / totalQuestions) * 100;

  return (
    <header className="mb-8 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 p-6 text-center text-white shadow-lg">
      <h1 className="mb-2 text-3xl font-bold md:text-4xl">🎙️ اختبار النطق</h1>
      <p className="mb-4 text-lg opacity-95">
        اختبر مهارات النطق في اللغة العربية والقرآن الكريم
      </p>
      
      {/* Progress Bar */}
      <div className="mx-auto h-2 w-full max-w-md overflow-hidden rounded-full bg-white/30">
        <div
          className="h-full bg-white transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="mt-2 text-sm opacity-80">
        السؤال {currentQuestion} من {totalQuestions}
      </p>
    </header>
  );
}

export default Header;
