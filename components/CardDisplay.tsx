
import React, { useState } from 'react';
import { CategoryType, QuestionCard } from '../types';

interface CardDisplayProps {
  card: QuestionCard;
  onAnswer: (correct: boolean) => void;
  onClose: () => void;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ card, onAnswer, onClose }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const playSound = (type: 'click' | 'hint') => {
    const sounds = {
      click: 'https://www.soundjay.com/buttons/sounds/button-16.mp3',
      hint: 'https://www.soundjay.com/buttons/sounds/button-09.mp3'
    };
    const audio = new Audio(sounds[type]);
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const handleOptionSelect = (idx: number) => {
    if (isSubmitted) return;
    playSound('click');
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (card.options) {
      if (selectedOption === null) return;
      setIsSubmitted(true);
      onAnswer(selectedOption === card.correctIndex);
    } else {
      // For game/task category
      setIsSubmitted(true);
      onAnswer(true);
    }
  };

  const toggleHint = () => {
    playSound('hint');
    setShowHint(!showHint);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="parchment w-full max-w-2xl p-8 rounded-lg transform transition-all animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-start mb-6">
          <span className="bg-amber-800 text-amber-100 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
            {card.category}
          </span>
          <button 
            onClick={onClose}
            className="text-amber-900 hover:text-red-700 transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-amber-950 mb-8 leading-relaxed text-right">
          {card.question}
        </h2>

        {card.options && (
          <div className="grid grid-cols-1 gap-4 mb-8">
            {card.options.map((option, idx) => (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleOptionSelect(idx)}
                className={`p-4 text-right rounded-md border-2 transition-all flex items-center justify-between
                  ${selectedOption === idx ? 'border-amber-700 bg-amber-100/50' : 'border-amber-900/20 hover:border-amber-700 bg-white/30'}
                  ${isSubmitted && idx === card.correctIndex ? 'bg-green-100 border-green-600' : ''}
                  ${isSubmitted && selectedOption === idx && idx !== card.correctIndex ? 'bg-red-100 border-red-600' : ''}
                `}
              >
                <span className="text-lg text-amber-950">{option}</span>
                <span className="font-bold text-amber-800 ml-4">
                  {idx + 1})
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-lg shadow-lg transition-transform active:scale-95"
            >
              {card.options ? 'ثبت پاسخ نهایی' : 'انجام دادم!'}
            </button>
          )}

          {isSubmitted && (
            <div className="text-center animate-bounce">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-bold rounded-full"
              >
                ادامه سفر...
              </button>
            </div>
          )}

          {card.category !== CategoryType.GAMES && card.category !== CategoryType.HEALTH && (
            <div className="mt-4 border-t border-amber-900/20 pt-4">
              <button 
                onClick={toggleHint}
                className="text-amber-800 underline text-sm hover:text-amber-600 transition-colors"
              >
                {showHint ? 'پنهان کردن راهنمایی' : 'مشاهده راهنمایی (نقشه گنج)'}
              </button>
              {showHint && (
                <p className="mt-2 text-amber-900 italic bg-amber-200/40 p-3 rounded-md animate-in slide-in-from-top-2">
                  💡 راهنمایی: {card.hint}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;
