import { useState, useCallback, useRef, useEffect } from 'react';
import { SPEECH_CONFIG } from '../config/speechConfig';

/**
 * Custom hook for speech recognition with Web Speech API and ElevenLabs option
 */
export function useSpeechRecognition({ onResult, onError, useElevenLabs = false, apiKey = '' }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    const config = SPEECH_CONFIG.webSpeech;

    recognition.continuous = config.continuous;
    recognition.interimResults = config.interimResults;
    recognition.lang = config.lang;
    recognition.maxAlternatives = config.maxAlternatives;

    recognition.onstart = () => {
      setIsRecording(true);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;

        if (event.results[i].isFinal) {
          finalTranscript += result + ' ';
          // Call onResult with final transcript and confidence
          setTimeout(() => {
            onResult?.(result.trim(), confidence);
          }, 300);
        } else {
          interimTranscript += result;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      
      const errorMessages = {
        'no-speech': 'لم يتم التقاط صوت. الرجاء المحاولة مرة أخرى.',
        'audio-capture': 'لم يتم العثور على ميكروفون. الرجاء التحقق من الأذونات.',
        'network': 'خطأ في الشبكة. الرجاء التحقق من الاتصال.',
        'not-allowed': 'لم يتم السماح بالوصول للميكروفون.',
        'aborted': 'تم إلغاء التسجيل.',
      };

      onError?.(errorMessages[event.error] || 'حدث خطأ في التعرف على الكلام');
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [onResult, onError]);

  // Start recording with Web Speech API
  const startWebSpeechRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    
    try {
      audioChunksRef.current = [];
      setTranscript('');
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      onError?.('فشل في بدء التسجيل');
    }
  }, [onError]);

  // Start recording with Hugging Face Tarteel AI Model
  const startHuggingFaceRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });
      
      streamRef.current = stream;

      // Use audio/webm or audio/wav
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/wav')) {
        mimeType = 'audio/wav';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        mimeType = 'audio/ogg';
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          
          // Convert to base64 or send as binary
          const arrayBuffer = await audioBlob.arrayBuffer();
          
          // Hugging Face Inference API accepts raw audio bytes
          const response = await fetch(SPEECH_CONFIG.huggingFace.apiEndpoint, {
            method: 'POST',
            headers: {
              'Authorization': apiKey ? `Bearer ${apiKey}` : '',
              'Content-Type': 'audio/webm',
            },
            body: arrayBuffer,
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Hugging Face API error:', response.status, errorData);
            
            if (response.status === 503) {
              // Model is loading
              onError?.('النموذج يتم تحميله. الرجاء الانتظار والمحاولة مرة أخرى.');
            } else if (response.status === 401) {
              onError?.('مفتاح API غير صالح. احصل على مفتاح مجاني من huggingface.co');
            } else {
              throw new Error(errorData.error || 'Hugging Face API error');
            }
            return;
          }

          const data = await response.json();
          
          if (data.text) {
            const transcribedText = data.text.trim();
            setTranscript(transcribedText);
            onResult?.(transcribedText, 0.95); // Tarteel model has high accuracy for Quran
          } else {
            onError?.('لم يتم التعرف على أي كلام');
          }
        } catch (error) {
          console.error('Hugging Face API error:', error);
          onError?.('فشل في معالجة الصوت. تحقق من الاتصال.');
        } finally {
          setIsProcessing(false);
          streamRef.current?.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setTranscript('');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      onError?.('فشل في الوصول للميكروفون');
    }
  }, [apiKey, onResult, onError]);

  // Start recording with ElevenLabs Speech-to-Text
  const startElevenLabsRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          
          const formData = new FormData();
          formData.append('file', audioBlob, 'recording.webm');
          formData.append('model_id', 'scribe_v1');
          formData.append('language_code', 'ar');

          const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
            method: 'POST',
            headers: {
              'xi-api-key': apiKey,
            },
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail?.message || 'ElevenLabs API error');
          }

          const data = await response.json();
          
          if (data.text) {
            setTranscript(data.text);
            onResult?.(data.text, data.language_confidence || 0.9);
          } else {
            onError?.('لم يتم التعرف على أي كلام');
          }
        } catch (error) {
          console.error('ElevenLabs API error:', error);
          onError?.('فشل في معالجة الصوت. تحقق من مفتاح API.');
        } finally {
          setIsProcessing(false);
          streamRef.current?.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setTranscript('');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      onError?.('فشل في الوصول للميكروفون');
    }
  }, [apiKey, onResult, onError]);

  // Start recording
  const startRecording = useCallback(() => {
    if (useElevenLabs && apiKey) {
      startElevenLabsRecording();
    } else {
      startWebSpeechRecording();
    }
  }, [useElevenLabs, apiKey, startElevenLabsRecording, startWebSpeechRecording]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (useElevenLabs && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    } else if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  }, [useElevenLabs]);

  return {
    isRecording,
    isProcessing,
    transcript,
    isSupported,
    startRecording,
    stopRecording,
  };
}

export default useSpeechRecognition;
