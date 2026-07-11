import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  History, 
  ChevronRight, 
  Utensils, 
  HeartHandshake, 
  BookmarkCheck, 
  BookOpenText,
  Clock
} from 'lucide-react';

import AccessibilitySkipLink from './components/AccessibilitySkipLink';
import ConstraintForm from './components/ConstraintForm';
import MealPlanDisplay from './components/MealPlanDisplay';
import GroceryList from './components/GroceryList';
import Substitutions from './components/Substitutions';
import BudgetBreakdown from './components/BudgetBreakdown';

const API_BASE_URL = 'http://localhost:5000/api';

export default function App() {
  const [activeMealPlan, setActiveMealPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [srAnnouncement, setSrAnnouncement] = useState('');
  
  // Fetch historical meal plans on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/meal-plans`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const handleGeneratePlan = async (constraints) => {
    setIsLoading(true);
    setError(null);
    setSrAnnouncement('Submitting constraints. Generating your personal meal plan...');

    try {
      const response = await fetch(`${API_BASE_URL}/meal-plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(constraints),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate meal plan. Please check your parameters.');
      }

      setActiveMealPlan(data);
      setSrAnnouncement('Success! Your meal plan and grocery list have been generated.');
      fetchHistory(); // refresh sidebar list

      // Trigger WOW factor confetti if generated successfully
      if (data.budgetCheck?.meetsBudget) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#fbbf24', '#f59e0b']
        });
      } else {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#f59e0b']
        });
      }
    } catch (err) {
      setError(err.message);
      setSrAnnouncement(`Error generating meal plan: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = async (planId) => {
    setIsLoading(true);
    setError(null);
    setSrAnnouncement('Loading selected historical meal plan...');
    try {
      const response = await fetch(`${API_BASE_URL}/meal-plans/${planId}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to load details.');
      }
      const data = await response.json();
      setActiveMealPlan(data);
      setSrAnnouncement(`Loaded meal plan from ${new Date(data.createdAt).toLocaleDateString()}`);
      
      // Scroll smoothly to display container
      const displayContainer = document.getElementById('meal-plan-results');
      if (displayContainer) {
        displayContainer.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      setError(err.message);
      setSrAnnouncement(`Error loading meal plan: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans">
      {/* Screen Reader Announcement Region */}
      <div 
        className="sr-only" 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {srAnnouncement}
      </div>

      {/* Accessible skip link */}
      <AccessibilitySkipLink targetId="main-content" />

      {/* Header Bar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Utensils className="w-5.5 h-5.5 text-slate-950" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight font-display text-white">
                PrepChef<span className="text-emerald-400">.ai</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 bg-slate-900 text-slate-400 border border-slate-800 rounded">
                WCAG 2.1 AA Compliant
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-400">
            <a 
              href="#history-section" 
              className="hover:text-emerald-400 font-medium transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none p-1 rounded"
            >
              <History className="w-4 h-4" aria-hidden="true" />
              <span>History</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main 
        id="main-content" 
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 focus:outline-none"
        tabIndex="-1"
      >
        {/* Hero Section */}
        <section aria-labelledby="hero-title" className="text-center max-w-3xl mx-auto mb-10">
          <h1 id="hero-title" className="text-3.5xl md:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
            Personalized Culinary Plans <br/>
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Tailored to Your Schedule & Budget
            </span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-400 font-medium">
            Describe your day's schedule, physical demands, and budget limit. 
            PrepChef.ai handles recipe curation, ingredient aggregation, and allergy substitution instantly.
          </p>
        </section>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inputs Column */}
          <div className="lg:col-span-1 space-y-6">
            <ConstraintForm 
              onSubmit={handleGeneratePlan} 
              isLoading={isLoading} 
              apiError={error}
            />

            {/* Sidebar History List */}
            <section 
              id="history-section"
              aria-labelledby="history-heading" 
              className="glass-panel rounded-2xl p-6"
            >
              <h2 id="history-heading" className="text-lg font-bold font-display text-white mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                Previous Meal Plans
              </h2>

              {history.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-900 rounded-xl">
                  <p className="text-sm text-slate-500">No previously generated plans.</p>
                </div>
              ) : (
                <ul className="space-y-3 max-h-[350px] overflow-y-auto pr-1" aria-label="Historical meal plans">
                  {history.map((plan) => {
                    const date = new Date(plan.createdAt);
                    const formattedDate = date.toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    });

                    return (
                      <li key={plan.id}>
                        <button
                          onClick={() => handleSelectHistory(plan.id)}
                          className="w-full text-left p-3.5 bg-slate-950/60 border border-slate-900/80 hover:border-slate-800 hover:bg-slate-900/20 rounded-xl transition-all cursor-pointer flex justify-between items-center group focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none"
                          aria-label={`Select meal plan from ${formattedDate}, schedule: ${plan.schedule.substring(0, 40)}...`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>{formattedDate}</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors truncate">
                              {plan.dietType} • ${plan.budget} Target
                            </p>
                            <p className="text-xs text-slate-400 truncate mt-0.5 italic">
                              "{plan.schedule}"
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:translate-x-0.5 group-hover:text-emerald-400 transition-all shrink-0 ml-2" aria-hidden="true" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>

          {/* Results Column */}
          <div id="meal-plan-results" className="lg:col-span-2 space-y-8">
            {isLoading && !activeMealPlan && (
              <div 
                className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px] border-emerald-500/10"
                aria-busy="true"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-pulse mb-4">
                  <Utensils className="w-8 h-8" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-bold font-display text-white mb-2">Analyzing Constraints & Curation...</h2>
                <p className="text-slate-400 text-sm max-w-sm">
                  Our service layer is currently contacting the LLM backend to construct a nutrition-optimized, budget-friendly meal list.
                </p>
              </div>
            )}

            {!isLoading && !activeMealPlan && (
              <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mb-4">
                  <BookOpenText className="w-7 h-7" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-bold font-display text-white mb-2">Your Meal Plan Will Appear Here</h2>
                <p className="text-slate-400 text-sm max-w-sm">
                  Provide your schedule and dietary requirements in the control panel to generate your custom meal planner.
                </p>
              </div>
            )}

            {activeMealPlan && (
              <div className="space-y-8 animate-fade-in">
                {/* 1. Meal Plan */}
                <MealPlanDisplay menu={activeMealPlan.menu} />

                {/* 2. Budget feasibility */}
                <BudgetBreakdown 
                  budgetCheck={activeMealPlan.budgetCheck} 
                  targetBudget={activeMealPlan.budget}
                />

                {/* 3. Grocery Shopping Checklist */}
                <GroceryList list={activeMealPlan.groceryList} />

                {/* 4. Allergens & Substitutions */}
                <Substitutions substitutions={activeMealPlan.substitutions} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 font-medium text-slate-400">
            <HeartHandshake className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Built with premium accessibility & usability standards</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} PrepChef.ai. All rights reserved. WCAG 2.1 AA Compliant.
          </div>
        </div>
      </footer>
    </div>
  );
}
