import React, { useState } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

export default function ConstraintForm({ onSubmit, isLoading, apiError }) {
  const [schedule, setSchedule] = useState('');
  const [budget, setBudget] = useState('15');
  const [dietType, setDietType] = useState('Anything');
  const [exclusions, setExclusions] = useState('');
  
  const maxScheduleLength = 400;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!schedule.trim()) return;
    
    onSubmit({
      schedule,
      budget: parseFloat(budget) || 15,
      dietType,
      exclusions
    });
  };

  return (
    <section 
      aria-labelledby="form-heading" 
      className="glass-panel glass-panel-hover rounded-2xl p-6 md:p-8"
    >
      <h2 id="form-heading" className="text-2xl font-bold font-display text-white mb-6 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-emerald-400" aria-hidden="true" />
        Configure Your Day & Meals
      </h2>

      {apiError && (
        <div 
          role="alert" 
          className="mb-6 p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-200 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h3 className="font-semibold text-red-100">Generation Error</h3>
            <p className="text-sm mt-1">{apiError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Daily Schedule Textarea */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label htmlFor="schedule" className="block text-sm font-semibold text-slate-200">
              Daily Schedule & Physical Activity
            </label>
            <span className="text-xs text-slate-400" aria-hidden="true">
              {schedule.length} / {maxScheduleLength} chars
            </span>
          </div>
          <textarea
            id="schedule"
            rows="3"
            required
            maxLength={maxScheduleLength}
            placeholder="e.g., Busy day with back-to-back Zoom calls. Plan a heavy workout at 6:00 PM."
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            aria-describedby="schedule-help"
            className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm resize-none"
          />
          <p id="schedule-help" className="mt-1 text-xs text-slate-400">
            Describe your day so the AI can time your meals and adjust nutritional needs.
          </p>
        </div>

        {/* Budget & Diet Selection Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Daily Budget */}
          <div>
            <label htmlFor="budget" className="block text-sm font-semibold text-slate-200 mb-2">
              Target Daily Budget ($)
            </label>
            <input
              id="budget"
              type="number"
              min="1"
              max="1000"
              required
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              aria-describedby="budget-help"
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
            />
            <p id="budget-help" className="mt-1 text-xs text-slate-400">
              Enter target price limit for ingredients.
            </p>
          </div>

          {/* Diet Selection */}
          <div>
            <label htmlFor="dietType" className="block text-sm font-semibold text-slate-200 mb-2">
              Diet Type
            </label>
            <select
              id="dietType"
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="Anything">Anything (Standard)</option>
              <option value="High Protein">High Protein</option>
              <option value="Vegan">Vegan (Plant-Based)</option>
              <option value="Keto">Keto (Low Carb)</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Gluten-Free">Gluten-Free</option>
            </select>
          </div>
        </div>

        {/* Exclusions / Allergens */}
        <div>
          <label htmlFor="exclusions" className="block text-sm font-semibold text-slate-200 mb-2">
            Allergens & Exclusions
          </label>
          <input
            id="exclusions"
            type="text"
            placeholder="e.g., Peanuts, dairy, shellfish"
            value={exclusions}
            onChange={(e) => setExclusions(e.target.value)}
            aria-describedby="exclusions-help"
            className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
          />
          <p id="exclusions-help" className="mt-1 text-xs text-slate-400">
            Comma-separated ingredients to completely filter out of your meals.
          </p>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading || !schedule.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/10 cursor-pointer focus:ring-offset-2 focus:ring-offset-slate-950"
          aria-label={isLoading ? 'Generating meal plan, please wait...' : 'Generate Accessible Meal Plan'}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              <span>Analyzing & Planning...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" aria-hidden="true" />
              <span>Generate Meal Plan</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
}
