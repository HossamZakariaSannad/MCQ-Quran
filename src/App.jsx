import { useState, useCallback } from 'react';
import {
  Header,
  AyahDisplay,
  OptionsGrid,
  RecordingSection,
  FeedbackSection,
  StatsDisplay,
  NavigationButtons,
  ResultsSection,
} from './components';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { isPronunciationCorrect } from './utils/speechUtils';
import { quizData, getAyahAudioUrl } from './data/quizData';
import { SPEECH_CONFIG } from './config/speechConfig';

// Maximum tries per question
const MAX_TRIES = 1;

function App() {
  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [triesCount, setTriesCount] = useState(0); // Track tries per question

  // Feedback State
  const [feedback, setFeedback] = useState({
    isVisible: false,
    isCorrect: false,
    similarity: 0,
    spokenWord: '',
    errorMessage: '',
  });

  // Settings - Speech Recognition using ElevenLabs API (key from .env)
  const [useElevenLabs] = useState(true);
  const elevenLabsApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || '';

  // Current question
  const currentQuestion = quizData[currentQuestionIndex];
  const totalQuestions = quizData.length;

  // Handle speech recognition result
  const handleSpeechResult = useCallback(
    (transcript, confidence) => {
      const result = isPronunciationCorrect(
        transcript,
        currentQuestion.word,
        SPEECH_CONFIG.similarityThreshold
      );

      const newTriesCount = triesCount + 1;
      setTriesCount(newTriesCount);

      // Check if correct
      if (result.isCorrect) {
        setFeedback({
          isVisible: true,
          isCorrect: true,
          similarity: result.similarity,
          spokenWord: result.spoken,
          errorMessage: '',
        });

        if (!answeredQuestions.has(currentQuestionIndex)) {
          setCorrectAnswersCount((prev) => prev + 1);
          setAnsweredQuestions((prev) => new Set([...prev, currentQuestionIndex]));
        }
      } else {
        // Check if max tries reached
        const triesLeft = MAX_TRIES - newTriesCount;
        
        setFeedback({
          isVisible: true,
          isCorrect: false,
          similarity: result.similarity,
          spokenWord: result.spoken,
          errorMessage: 'استمع للنطق الصحيح',
          triesLeft,
          autoPlayAudio: true, // Auto-play correct pronunciation
        });
      }
    },
    [currentQuestion, currentQuestionIndex, answeredQuestions, triesCount]
  );

  // Handle speech recognition error
  const handleSpeechError = useCallback((errorMessage) => {
    setFeedback({
      isVisible: true,
      isCorrect: false,
      similarity: 0,
      spokenWord: '',
      errorMessage,
    });
  }, []);

  // Speech recognition hook
  const {
    isRecording,
    isProcessing,
    transcript,
    isSupported,
    startRecording,
    stopRecording,
  } = useSpeechRecognition({
    onResult: handleSpeechResult,
    onError: handleSpeechError,
    useElevenLabs,
    apiKey: elevenLabsApiKey,
  });

  // Handle option selection
  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      resetQuestionState();
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      resetQuestionState();
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setCorrectAnswersCount(0);
    setSelectedOption(null);
    setShowResults(false);
    setAnsweredQuestions(new Set());
    resetQuestionState();
  };

  const resetQuestionState = () => {
    setSelectedOption(null);
    setTriesCount(0); // Reset tries for new question
    setFeedback({
      isVisible: false,
      isCorrect: false,
      similarity: 0,
      spokenWord: '',
      errorMessage: '',
    });
  };

  // Get audio URL for current question using Al-Furqan API
  const currentAudioUrl = getAyahAudioUrl(
    currentQuestion.surahNumber,
    currentQuestion.ayahNumber
  );

  // Can navigate to next question - allow if correct, already answered, OR tries exhausted
  const canGoNext = feedback.isCorrect || answeredQuestions.has(currentQuestionIndex) || triesCount >= MAX_TRIES;
  const canGoPrevious = currentQuestionIndex > 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 dark:bg-gray-900">
      <div className="mx-auto max-w-2xl">
        <Header
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
        />

        {!showResults ? (
          <div className="rounded-lg border-2 border-transparent bg-gray-100 p-6 shadow-lg transition-all dark:bg-gray-800">
            {/* Ayah Display */}
            <AyahDisplay
              ayah={currentQuestion.ayah}
              word={currentQuestion.word}
              surah={currentQuestion.surah}
              audioUrl={currentAudioUrl}
              showListenButton={triesCount >= MAX_TRIES}
            />

            {/* Options Grid */}
            <OptionsGrid
              options={currentQuestion.options}
              correctIndex={currentQuestion.correctIndex}
              selectedOption={selectedOption}
              onSelect={handleOptionSelect}
              disabled={false}
            />

            {/* Recording Section */}
            <RecordingSection
              isRecording={isRecording}
              isProcessing={isProcessing}
              transcript={transcript}
              isSupported={isSupported}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              triesCount={triesCount}
              maxTries={MAX_TRIES}
              disabled={triesCount >= MAX_TRIES}
            />

            {/* Feedback Section */}
            <FeedbackSection
              isVisible={feedback.isVisible}
              isCorrect={feedback.isCorrect}
              similarity={feedback.similarity}
              spokenWord={feedback.spokenWord}
              correctWord={currentQuestion.word}
              errorMessage={feedback.errorMessage}
              audioUrl={currentAudioUrl}
              triesLeft={feedback.triesLeft}
              autoPlayAudio={feedback.autoPlayAudio}
            />

            {/* Stats Display */}
            <StatsDisplay
              currentQuestion={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
              correctAnswers={correctAnswersCount}
            />

            {/* Navigation Buttons */}
            <NavigationButtons
              onPrevious={handlePrevious}
              onNext={handleNext}
              canGoPrevious={canGoPrevious}
              canGoNext={canGoNext}
              isLastQuestion={isLastQuestion}
            />
          </div>
        ) : (
          <ResultsSection
            totalQuestions={totalQuestions}
            correctAnswers={correctAnswersCount}
            onRestart={handleRestart}
          />
        )}

        {/* Footer Info */}
        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>🎓 منصة تعليم اللغة العربية والقرآن الكريم</p>
          <p className="mt-1">
            تعرف على الكلام: {isSupported ? '✅ مدعوم' : '❌ غير مدعوم'}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
