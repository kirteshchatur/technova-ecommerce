import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-gray-200 dark:border-slate-800 p-4 animate-pulse flex flex-col justify-between">
      <div>
        <div className="w-full aspect-square bg-gray-200 dark:bg-slate-700 rounded-xl mb-4"></div>
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-4/5 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3 mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
      </div>
      <div className="pt-3 border-t border-gray-100 dark:border-slate-700/60 flex gap-2">
        <div className="h-9 bg-gray-200 dark:bg-slate-700 rounded-xl flex-1"></div>
        <div className="h-9 w-9 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
      </div>
    </div>
  );
}
