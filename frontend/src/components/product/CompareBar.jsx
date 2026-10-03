import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, X, ArrowRight } from 'lucide-react';
import { useCompare } from '../../context/CompareContext.jsx';

export default function CompareBar() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (!compareItems || compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 text-white backdrop-blur-md rounded-2xl px-5 py-3 shadow-2xl border border-slate-700 flex items-center gap-6 max-w-2xl w-[90%] animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white">
          <Scale className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-bold">Compare Products ({compareItems.length}/4)</p>
          <p className="text-[10px] text-slate-400">Side-by-side specs</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-1 overflow-x-auto py-1">
        {compareItems.map(item => (
          <div key={item.id} className="relative group shrink-0">
            <img
              src={item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80'}
              alt={item.name}
              className="w-10 h-10 object-contain rounded-lg bg-slate-800 border border-slate-700 p-0.5"
            />
            <button
              onClick={() => removeFromCompare(item.id)}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={clearCompare}
          className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded"
        >
          Clear
        </button>
        <Link
          to="/compare"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
        >
          <span>Compare</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
