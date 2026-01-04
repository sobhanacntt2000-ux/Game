
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';

interface ImageGeneratorProps {
  onClose: () => void;
  onSetBackground: (url: string) => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onClose, onSetBackground }) => {
  const [prompt, setPrompt] = useState('An exotic treasure island with 3D palm trees and glowing crystals');
  const [size, setSize] = useState<"1K" | "2K" | "4K">("1K");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const imageUrl = await generateImage(prompt, size);
      if (imageUrl) {
        setResult(imageUrl);
      } else {
        setError("خطا در تولید تصویر. لطفا دوباره تلاش کنید.");
      }
    } catch (e: any) {
      if (e.message === "API_KEY_EXPIRED") {
        setError("کلید API نامعتبر است. لطفا دوباره انتخاب کنید.");
        window.aistudio.openSelectKey();
      } else {
        setError("خطای غیرمنتظره رخ داد.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="parchment w-full max-w-3xl p-8 rounded-xl overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-amber-950">فانوس جادویی تصویرساز</h2>
          <button onClick={onClose} className="text-amber-900 text-2xl">✕</button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-amber-900 text-right">توضیح تصویر (انگلیسی بهتر عمل می‌کند):</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 rounded-lg border-2 border-amber-900/20 bg-white/50 focus:border-amber-700 outline-none text-right font-mono"
              rows={3}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 justify-end">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-amber-900">کیفیت تصویر:</span>
              {(["1K", "2K", "4K"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-1 rounded-full text-xs font-bold border-2 transition-all ${
                    size === s ? 'bg-amber-800 text-white border-amber-800' : 'bg-white/30 border-amber-900/20 text-amber-900 hover:border-amber-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`px-8 py-3 rounded-lg font-black shadow-lg transition-transform active:scale-95 flex items-center gap-2 ${
                isGenerating ? 'bg-amber-400 cursor-wait' : 'bg-amber-700 hover:bg-amber-800 text-white'
              }`}
            >
              {isGenerating ? 'در حال جادوگری...' : 'تولید تصویر'}
              <span>✨</span>
            </button>
          </div>

          {error && <p className="text-red-700 text-center font-bold text-sm bg-red-100 p-2 rounded">{error}</p>}

          <div className="relative aspect-video bg-black/10 rounded-lg overflow-hidden flex items-center justify-center border-4 border-amber-900/10">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-amber-700 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-amber-900 font-bold animate-pulse">در حال فراخوانی ارواح هنر...</p>
              </div>
            ) : result ? (
              <img src={result} alt="Generated" className="w-full h-full object-cover" />
            ) : (
              <p className="text-amber-900/40 font-bold italic">تصویری تولید نشده است</p>
            )}
          </div>

          {result && !isGenerating && (
            <button
              onClick={() => onSetBackground(result)}
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-lg shadow-xl transition-all"
            >
              قرار دادن به عنوان پس‌زمینه جزیره
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
