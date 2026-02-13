
import React, { useState } from 'react';
import { X, Layout, Check } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, color: string) => void;
}

const COLORS = [
  { name: 'Indigo', class: 'bg-indigo-500' },
  { name: 'Emerald', class: 'bg-emerald-500' },
  { name: 'Rose', class: 'bg-rose-500' },
  { name: 'Amber', class: 'bg-amber-500' },
  { name: 'Sky', class: 'bg-sky-500' },
  { name: 'Violet', class: 'bg-violet-500' },
];

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].class);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim(), selectedColor);
      setName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
          <h2 className="text-sm font-black tracking-widest uppercase text-slate-900 dark:text-white">Create Workspace</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full text-slate-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Layout size={12} strokeWidth={3} /> Project Name
            </label>
            <input 
              autoFocus
              type="text" 
              placeholder="e.g. Marketing Launch" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Brand Color
            </label>
            <div className="flex flex-wrap gap-4">
              {COLORS.map((color) => (
                <button
                  key={color.class}
                  type="button"
                  onClick={() => setSelectedColor(color.class)}
                  className={`w-10 h-10 rounded-full ${color.class} flex items-center justify-center transition-all ${
                    selectedColor === color.class ? 'ring-4 ring-offset-2 ring-indigo-500 dark:ring-offset-[#0f172a] scale-110 shadow-lg' : 'hover:scale-105'
                  }`}
                >
                  {selectedColor === color.class && <Check size={16} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
