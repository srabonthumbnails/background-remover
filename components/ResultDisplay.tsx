
import React, { useState } from 'react';
import { ProcessingResult } from '../types';

interface ResultDisplayProps {
  result: ProcessingResult;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset }) => {
  const [sliderPos, setSliderPos] = useState(50);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = result.resultUrl;
    link.download = 'extracted-background.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative group rounded-2xl overflow-hidden shadow-2xl bg-slate-900 aspect-video max-h-[600px] w-full border border-slate-200">
        {/* Original (Background layer) */}
        <img 
          src={result.originalUrl} 
          alt="Original" 
          className="absolute inset-0 w-full h-full object-contain"
        />
        
        {/* Result (Overlay layer with clip-path) */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img 
            src={result.resultUrl} 
            alt="Result" 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Divider Line */}
        <div 
          className="absolute inset-y-0 bg-white w-1 cursor-ew-resize z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l-5 5m0 0l5 5m-5-5h18m-5-10l5 5m0 0l-5 5" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/50 backdrop-blur-md rounded text-white text-xs font-bold uppercase tracking-wider">
          Background
        </div>
        <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-black/50 backdrop-blur-md rounded text-white text-xs font-bold uppercase tracking-wider">
          Original
        </div>

        {/* Input for Slider */}
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={sliderPos} 
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-slate-600 text-sm max-w-md italic">
          "The AI identified foreground elements and reconstructed the underlying background texture."
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={onReset}
            className="flex-1 sm:flex-none px-6 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            Start Over
          </button>
          <button 
            onClick={handleDownload}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download BG
          </button>
        </div>
      </div>
    </div>
  );
};
