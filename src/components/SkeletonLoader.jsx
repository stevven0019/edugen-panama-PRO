import React from 'react';

export default function SkeletonLoader({ type = 'table' }) {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Simulation Header */}
      <div className="flex items-center space-x-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="w-12 h-12 rounded-2xl shimmer-bg"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 w-1/4 rounded shimmer-bg"></div>
          <div className="h-3 w-1/3 rounded shimmer-bg opacity-60"></div>
        </div>
      </div>

      {/* Primary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="h-3 w-1/3 rounded shimmer-bg"></div>
          <div className="h-4 w-full rounded shimmer-bg"></div>
          <div className="h-4 w-5/6 rounded shimmer-bg"></div>
        </div>
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="h-3 w-1/3 rounded shimmer-bg"></div>
          <div className="h-4 w-full rounded shimmer-bg"></div>
          <div className="h-4 w-5/6 rounded shimmer-bg"></div>
        </div>
      </div>

      {/* Table Structure Wireframe */}
      {type === 'table' && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-4 gap-4 bg-slate-100 dark:bg-slate-900/60 p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="h-3 rounded shimmer-bg"></div>
            <div className="h-3 rounded shimmer-bg"></div>
            <div className="h-3 rounded shimmer-bg"></div>
            <div className="h-3 rounded shimmer-bg"></div>
          </div>
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((row) => (
              <div key={row} className="grid grid-cols-4 gap-4 items-start">
                <div className="space-y-2">
                  <div className="h-3 w-3/4 rounded shimmer-bg"></div>
                  <div className="h-2 w-1/2 rounded shimmer-bg opacity-60"></div>
                </div>
                <div className="h-3 rounded shimmer-bg"></div>
                <div className="h-3 rounded shimmer-bg"></div>
                <div className="space-y-1">
                  <div className="h-3 w-full rounded shimmer-bg"></div>
                  <div className="h-3 w-5/6 rounded shimmer-bg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* List Layout Wireframe */}
      {type === 'list' && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-center space-x-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40">
              <div className="w-5 h-5 rounded-full shimmer-bg"></div>
              <div className="h-3 flex-1 rounded shimmer-bg"></div>
              <div className="h-3 w-16 rounded shimmer-bg"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
