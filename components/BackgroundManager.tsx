
import React, { useState } from 'react';

interface BackgroundManagerProps {
  onClose: () => void;
  onSetBackground: (url: string) => void;
  currentBg: string | null;
  openAiGenerator: () => void;
}

const PREDEFINED_GALLERY = [
  { id: 'default', title: 'کشتی شکسته', url: 'https://img.freepik.com/free-vector/pirate-island-with-broken-ship-treasure-chest_107791-3069.jpg' },
  { id: 'bay', title: 'خلیج دزدان', url: 'https://img.freepik.com/free-vector/pirate-bay-with-ships-treasure-chest_107791-1823.jpg' },
  { id: 'night', title: 'جزیره مهتابی', url: 'https://img.freepik.com/free-vector/beach-at-night-with-moonlight_107791-1815.jpg' },
  { id: 'tropical', title: 'ساحل استوایی', url: 'https://img.freepik.com/free-vector/tropical-island-with-palm-trees-ocean_107791-2361.jpg' },
  { id: 'sunset', title: 'غروب طلایی', url: 'https://img.freepik.com/free-vector/beautiful-tropical-beach-landscape-at-sunset_107791-1971.jpg' },
];

const BackgroundManager: React.FC<BackgroundManagerProps> = ({ onClose, onSetBackground, currentBg, openAiGenerator }) => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSetBackground(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="parchment w-full max-w-4xl p-8 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-amber-950 flex items-center gap-2">
            <span>🗺️</span>
            مدیریت منظره جزیره
          </h2>
          <button onClick={onClose} className="text-amber-900 text-2xl hover:text-red-700 transition-colors">✕</button>
        </div>

        <div className="flex gap-2 mb-6 border-b-2 border-amber-900/10 pb-2">
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2 font-bold transition-all ${activeTab === 'gallery' ? 'text-amber-900 border-b-4 border-amber-800' : 'text-amber-700/50'}`}
          >
            گالری پیش‌فرض
          </button>
          <button 
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 font-bold transition-all ${activeTab === 'upload' ? 'text-amber-900 border-b-4 border-amber-800' : 'text-amber-700/50'}`}
          >
            آپلود تصویر
          </button>
          <button 
            onClick={() => { onClose(); openAiGenerator(); }}
            className="px-4 py-2 font-bold text-emerald-700 hover:text-emerald-800 transition-all flex items-center gap-1"
          >
            ✨ جادوی هوش مصنوعی
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 'gallery' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-2">
              {PREDEFINED_GALLERY.map((img) => (
                <button
                  key={img.id}
                  onClick={() => onSetBackground(img.url)}
                  className={`group relative aspect-video rounded-lg overflow-hidden border-4 transition-all hover:scale-105 ${
                    currentBg === img.url || (!currentBg && img.id === 'default') ? 'border-amber-600 shadow-xl' : 'border-transparent'
                  }`}
                >
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{img.title}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border-4 border-dashed border-amber-900/20 rounded-xl bg-white/30">
              <span className="text-6xl mb-4">🖼️</span>
              <p className="text-amber-900 font-bold mb-4">تصویر دلخواه خود را برای پس‌زمینه جزیره انتخاب کنید</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload}
                className="hidden" 
                id="bg-upload"
              />
              <label 
                htmlFor="bg-upload"
                className="px-8 py-3 bg-amber-800 hover:bg-amber-900 text-white font-black rounded-full cursor-pointer shadow-lg transition-all active:scale-95"
              >
                انتخاب فایل تصویر
              </label>
            </div>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-amber-900/10 flex justify-end">
          <button 
            onClick={onClose}
            className="px-10 py-3 bg-amber-950 text-white font-black rounded-lg shadow-xl"
          >
            تایید و بستن نقشه
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackgroundManager;
