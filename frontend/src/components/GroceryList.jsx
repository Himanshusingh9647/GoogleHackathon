import React, { useState, useEffect } from 'react';
import { ShoppingCart, Check, Trash2, ListChecks } from 'lucide-react';

export default function GroceryList({ list }) {
  const [checkedItems, setCheckedItems] = useState({});

  // Reset checked items when a new meal plan list is provided
  useEffect(() => {
    setCheckedItems({});
  }, [list]);

  if (!list || list.length === 0) return null;

  // Group list by category
  const categories = list.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const handleToggle = (name) => {
    setCheckedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const totalItems = list.length;
  const completedItems = Object.values(checkedItems).filter(Boolean).length;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <section 
      aria-labelledby="grocery-heading" 
      className="glass-panel rounded-2xl p-6 md:p-8 space-y-6"
    >
      {/* Header and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShoppingCart className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h2 id="grocery-heading" className="text-2xl font-bold font-display text-white">
              Aggregated Grocery Shopping List
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Aggregated and sorted checklist of ingredients needed for your day
            </p>
          </div>
        </div>

        {/* Progress stat */}
        <div className="flex items-center gap-3 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-900 shrink-0">
          <ListChecks className="w-5 h-5 text-emerald-400" aria-hidden="true" />
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shopping Progress</div>
            <div className="text-sm font-semibold text-white mt-0.5" aria-live="polite">
              {completedItems} of {totalItems} items ({completionPercentage}%)
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden" aria-hidden="true">
        <div 
          className="bg-emerald-500 h-full transition-all duration-500 ease-out" 
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(categories).map(([category, items]) => (
          <div 
            key={category} 
            className="bg-slate-950/40 p-5 rounded-2xl border border-slate-900/80 flex flex-col"
          >
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>{category}</span>
              <span className="text-xs bg-slate-900 text-slate-400 px-2.5 py-0.5 rounded-md font-medium border border-slate-800">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </h3>

            <ul className="space-y-3 flex-1" aria-label={`${category} ingredients`}>
              {items.map((item, index) => {
                const isChecked = !!checkedItems[item.name];
                const inputId = `grocery-item-${item.name.replace(/\s+/g, '-').toLowerCase()}`;
                
                return (
                  <li 
                    key={index} 
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isChecked 
                        ? 'bg-slate-900/30 border-slate-800/40 opacity-50' 
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Standard accessible checkbox */}
                      <input
                        type="checkbox"
                        id={inputId}
                        checked={isChecked}
                        onChange={() => handleToggle(item.name)}
                        className="w-5 h-5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950 cursor-pointer accent-emerald-500 shrink-0"
                      />
                      <label 
                        htmlFor={inputId}
                        className={`text-sm select-none cursor-pointer truncate font-medium ${
                          isChecked ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {item.name}
                      </label>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs bg-slate-900 text-slate-300 px-2 py-1 rounded border border-slate-800">
                        {item.amount}
                      </span>
                      <span className="text-xs font-semibold text-emerald-400/90 min-w-[45px] text-right">
                        ${item.estimatedPrice.toFixed(2)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
