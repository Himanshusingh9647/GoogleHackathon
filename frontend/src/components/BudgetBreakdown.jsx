import React from 'react';
import { DollarSign, CheckCircle2, AlertTriangle, PiggyBank } from 'lucide-react';

export default function BudgetBreakdown({ budgetCheck, targetBudget }) {
  if (!budgetCheck) return null;

  const { totalCostEstimate, meetsBudget, analysis } = budgetCheck;

  return (
    <section 
      aria-labelledby="budget-breakdown-heading" 
      className="glass-panel rounded-2xl p-6 md:p-8 space-y-6"
    >
      <div className="flex items-center gap-3 border-b border-slate-800/80 pb-5">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <PiggyBank className="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <h2 id="budget-breakdown-heading" className="text-2xl font-bold font-display text-white">
            Budget Feasibility Report
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            AI-driven cost analysis matching your daily limits
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Target Budget */}
        <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-900 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Target Budget</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-extrabold text-white">${targetBudget.toFixed(2)}</span>
            <span className="text-xs text-slate-400">/ day</span>
          </div>
        </div>

        {/* Metric 2: Estimated Cost */}
        <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-900 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Total Cost</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-extrabold text-emerald-400">${totalCostEstimate.toFixed(2)}</span>
            <span className="text-xs text-slate-400">/ day</span>
          </div>
        </div>

        {/* Metric 3: Feasibility Status */}
        <div 
          className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
            meetsBudget 
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200' 
              : 'bg-red-950/40 border-red-500/30 text-red-200'
          }`}
          aria-live="polite"
        >
          <span className="text-xs font-bold uppercase tracking-wider opacity-85">Feasibility Status</span>
          <div className="flex items-center gap-2 mt-2">
            {meetsBudget ? (
              <>
                <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" aria-hidden="true" />
                <span className="text-lg font-bold">Meets Budget</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-7 h-7 text-red-400 shrink-0" aria-hidden="true" />
                <span className="text-lg font-bold">Exceeds Budget</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Details Panel */}
      <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-900 leading-relaxed text-sm">
        <h3 className="font-bold text-slate-200 mb-2 flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          AI Cost & Sourcing Insights
        </h3>
        <p className="text-slate-300 font-medium leading-relaxed">
          {analysis}
        </p>
      </div>
    </section>
  );
}
