import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function Substitutions({ substitutions }) {
  // If there are no substitutions needed (e.g. no exclusions and no AI-suggested swaps), show a clean notice
  const hasSubstitutions = substitutions && substitutions.length > 0;

  return (
    <section 
      aria-labelledby="substitutions-heading" 
      className="glass-panel rounded-2xl p-6 md:p-8 space-y-6"
    >
      <div className="flex items-center gap-3 border-b border-slate-800/80 pb-5">
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <RefreshCw className="w-6 h-6 animate-spin-slow" aria-hidden="true" />
        </div>
        <div>
          <h2 id="substitutions-heading" className="text-2xl font-bold font-display text-white">
            Smart Ingredient Substitutions
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Alternative choices for allergens, unavailable items, or budget optimizations
          </p>
        </div>
      </div>

      {!hasSubstitutions ? (
        <div className="flex items-center gap-3 p-4 bg-emerald-950/20 border border-emerald-500/10 rounded-xl text-emerald-300">
          <span className="text-lg" aria-hidden="true">✅</span>
          <p className="text-sm">
            No active allergen substitutions required for this plan. All ingredients fit your selected parameters!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left border-collapse" aria-describedby="subs-table-desc">
            <caption id="subs-table-desc" className="sr-only">
              Table lists original ingredients that need replacement, their recommended alternatives, and the specific reason for substitution.
            </caption>
            <thead>
              <tr className="bg-slate-900/85 text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800">
                <th scope="col" className="px-5 py-4">Original Ingredient</th>
                <th scope="col" className="px-5 py-4">Smart Substitution</th>
                <th scope="col" className="px-5 py-4">Substitution Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 bg-slate-950/20 text-sm">
              {substitutions.map((sub, index) => (
                <tr key={index} className="hover:bg-slate-900/30 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-400 line-through">
                    {sub.original}
                  </td>
                  <td className="px-5 py-4 font-bold text-emerald-400">
                    {sub.alternative}
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    <span className="inline-flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                      {sub.reason}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
