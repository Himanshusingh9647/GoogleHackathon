import React from 'react';
import { Coffee, Sun, Moon, Clock, ChevronRight } from 'lucide-react';

export default function MealPlanDisplay({ menu }) {
  if (!menu) return null;

  const mealCards = [
    {
      key: 'breakfast',
      label: 'Breakfast',
      icon: Coffee,
      colorClass: 'from-amber-500/20 to-orange-500/5 border-amber-500/30',
      iconColor: 'text-amber-400',
      data: menu.breakfast,
    },
    {
      key: 'lunch',
      label: 'Lunch',
      icon: Sun,
      colorClass: 'from-emerald-500/20 to-teal-500/5 border-emerald-500/30',
      iconColor: 'text-emerald-400',
      data: menu.lunch,
    },
    {
      key: 'dinner',
      label: 'Dinner',
      icon: Moon,
      colorClass: 'from-indigo-500/20 to-purple-500/5 border-indigo-500/30',
      iconColor: 'text-indigo-400',
      data: menu.dinner,
    },
  ];

  return (
    <section 
      aria-labelledby="meal-plan-heading" 
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 id="meal-plan-heading" className="text-2xl font-bold font-display text-white">
          Your Schedule-Aligned Daily Menu
        </h2>
        <span className="text-xs bg-emerald-500/10 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
          3 Meals Planned
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mealCards.map(({ key, label, icon: Icon, colorClass, iconColor, data }) => {
          if (!data) return null;

          return (
            <article 
              key={key}
              className={`glass-panel border-l-4 p-6 rounded-2xl bg-gradient-to-r ${colorClass} transition-all duration-300 hover:shadow-lg`}
              aria-labelledby={`meal-${key}-title`}
            >
              {/* Header: Icon, Meal Type, Time, Alignment */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800 ${iconColor}`}>
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {label}
                    </span>
                    <h3 id={`meal-${key}-title`} className="text-lg md:text-xl font-bold text-white mt-0.5">
                      {data.name}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    <span>{data.time}</span>
                  </div>
                </div>
              </div>

              {/* Body: Schedule Alignment reason */}
              <div className="mb-4 bg-slate-950/40 p-3.5 rounded-xl border border-slate-900">
                <span className="text-xs font-bold text-emerald-400 block mb-1">
                  Schedule Alignment:
                </span>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {data.whyAligned}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Ingredients column */}
                <div className="md:col-span-2 space-y-3">
                  <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    Ingredients
                  </h4>
                  <ul className="space-y-2" aria-label={`${label} ingredients list`}>
                    {data.ingredients?.map((ing, idx) => (
                      <li 
                        key={idx} 
                        className="text-sm text-slate-300 flex justify-between items-center bg-slate-950/20 px-3 py-2 rounded-lg border border-slate-900/60"
                      >
                        <span className="font-medium">{ing.name}</span>
                        <span className="text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md">
                          {ing.amount}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions column */}
                <div className="md:col-span-3 space-y-3">
                  <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    Preparation Steps
                  </h4>
                  <ol className="space-y-2.5" aria-label={`${label} steps`}>
                    {data.instructions?.map((step, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
