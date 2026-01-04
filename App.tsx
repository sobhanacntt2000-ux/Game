
import React, { useState, useCallback } from 'react';
import { CategoryType, GameState, QuestionCard } from './types';
import { INITIAL_QUESTIONS } from './constants';
import CategoryCard from './components/CategoryCard';
import CardDisplay from './components/CardDisplay';
import { generateMoreQuestions } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    cards: {
      [CategoryType.HEALTH]: INITIAL_QUESTIONS.filter(q => q.category === CategoryType.HEALTH),
      [CategoryType.REGULATIONS]: INITIAL_QUESTIONS.filter(q => q.category === CategoryType.REGULATIONS),
      [CategoryType.GENERAL]: INITIAL_QUESTIONS.filter(q => q.category === CategoryType.GENERAL),
      [CategoryType.GAMES]: INITIAL_QUESTIONS.filter(q => q.category === CategoryType.GAMES),
    },
    score: 0,
    revealedCard: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const playSound = (type: 'reveal' | 'click' | 'correct' | 'incorrect') => {
    const sounds = {
      reveal: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
      click: 'https://www.soundjay.com/buttons/sounds/button-16.mp3',
      correct: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
      incorrect: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'
    };
    const audio = new Audio(sounds[type]);
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Audio play blocked or failed', e));
  };

  const handleRevealCard = useCallback(async (category: CategoryType) => {
    playSound('reveal');
    const categoryCards = state.cards[category];
    
    if (categoryCards.length === 0) {
      setIsLoading(true);
      const newQuestions = await generateMoreQuestions(category);
      if (newQuestions.length > 0) {
        setState(prev => ({
          ...prev,
          cards: {
            ...prev.cards,
            [category]: newQuestions
          }
        }));
        
        setState(prev => {
            const nextCards = [...prev.cards[category]];
            const revealed = nextCards.pop() || null;
            return {
                ...prev,
                revealedCard: revealed,
                cards: {
                    ...prev.cards,
                    [category]: nextCards
                }
            }
        });
      }
      setIsLoading(false);
      return;
    }

    const nextCards = [...categoryCards];
    const revealed = nextCards.pop() || null;

    setState(prev => ({
      ...prev,
      revealedCard: revealed,
      cards: {
        ...prev.cards,
        [category]: nextCards
      }
    }));
  }, [state.cards]);

  const handleAnswerResult = (isCorrect: boolean) => {
    playSound(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setState(prev => ({ ...prev, score: prev.score + 10 }));
    }
  };

  const closeCard = () => {
    playSound('click');
    setState(prev => ({ ...prev, revealedCard: null }));
  };

  return (
    <div className="island-bg min-h-screen text-amber-950 selection:bg-amber-200">
      <div className="island-bg-image"></div>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-6">
          <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            سفر در سرزمین ساحت‌ها
          </h2>
          <div className="inline-block bg-black/40 backdrop-blur-sm px-6 py-2 rounded-full border border-white/10">
            <p className="text-stone-200 text-sm md:text-lg font-medium">
              یکی از دسته‌های زیر را انتخاب کنید تا کارت سوال برای شما باز شود.
            </p>
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {Object.values(CategoryType).map((cat) => (
            <CategoryCard
              key={cat}
              type={cat}
              count={state.cards[cat].length}
              onClick={() => handleRevealCard(cat)}
            />
          ))}
        </div>

        {/* Dynamic Loading Placeholder */}
        {isLoading && (
          <div className="mt-16 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-amber-500">?</div>
            </div>
            <p className="text-white font-bold text-xl animate-pulse drop-shadow-lg">در حال استخراج سوالات جدید از صندوقچه‌های باستانی...</p>
          </div>
        )}
      </main>

      {/* Overlays */}
      {state.revealedCard && (
        <CardDisplay
          card={state.revealedCard}
          onAnswer={handleAnswerResult}
          onClose={closeCard}
        />
      )}
      
      <footer className="w-full py-8 mt-auto bg-stone-900/40 backdrop-blur-sm border-t border-white/5 text-center px-4">
        <p className="text-stone-100 text-sm md:text-base font-bold drop-shadow-md">تمام حقوق این شبیه‌ساز برای معاونت آموزش ابتدایی سمنان محفوظ است</p>
        <p className="text-stone-300/60 text-[10px] mt-1">طراحی جزیره دانش • ماجراجویی آموزشی</p>
      </footer>
    </div>
  );
};

export default App;
