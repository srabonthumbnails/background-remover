
import React, { useState } from 'react';
import { AppStatus, ProcessingResult } from './types';
import { extractBackground } from './services/geminiService';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageSelected = async (base64: string, mimeType: string) => {
    setStatus(AppStatus.PROCESSING);
    setErrorMessage(null);

    try {
      const resultUrl = await extractBackground(base64, mimeType);
      setResult({
        originalUrl: base64,
        resultUrl: resultUrl,
        prompt: "Extracting clean background"
      });
      setStatus(AppStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred during processing.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
      {/* Header */}
      <header className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Background Extractor Pro
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Instantly remove characters, text, and objects from any image while perfectly reconstructing the background using Gemini AI.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl w-full space-y-8">
        {status === AppStatus.IDLE && (
          <div className="animate-in fade-in zoom-in duration-300">
            <ImageUploader onImageSelected={handleImageSelected} isLoading={false} />
          </div>
        )}

        {status === AppStatus.PROCESSING && (
          <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl shadow-xl border border-slate-100 space-y-6 animate-pulse">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-800">Processing with Gemini...</h3>
              <p className="text-slate-500 mt-2">Reconstructing pixels and texture. This usually takes 5-10 seconds.</p>
            </div>
          </div>
        )}

        {status === AppStatus.SUCCESS && result && (
          <ResultDisplay result={result} onReset={handleReset} />
        )}

        {status === AppStatus.ERROR && (
          <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-800">Processing Failed</h3>
              <p className="text-red-600 mt-1">{errorMessage}</p>
            </div>
            <button 
              onClick={handleReset}
              className="px-6 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="mt-auto pt-16 text-slate-400 text-sm flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>Powered by Gemini-2.5-Flash</span>
        </div>
        <p>© 2024 BG Extractor AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
