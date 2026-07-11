import dotenv from 'dotenv';

dotenv.config();

/**
 * Service to orchestrate meal plan generation using Gemini API or a smart interactive mock.
 */
export const generateMealPlanFromLLM = async (constraints) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const { schedule, budget, dietType, exclusions } = constraints;

  // Formulate the prompt
  const systemPrompt = `You are an expert culinary assistant, nutritionist, and budget planner.
Generate a structured, schedule-aligned meal plan (Breakfast, Lunch, Dinner) based on these user constraints:
- Daily Schedule / Vibe: "${schedule}"
- Target Daily Budget: $${budget}
- Diet Type: "${dietType}"
- Allergens or Exclusions to Avoid: "${exclusions || 'None'}"

You MUST respond with a single, valid JSON object ONLY. Do not include markdown code block formatting like \`\`\`json ... \`\`\`.
The JSON must follow this exact schema:
{
  "menu": {
    "breakfast": {
      "name": "Meal name",
      "time": "Time estimation based on schedule",
      "whyAligned": "Explanation of how this fits their daily schedule and workout/rest level",
      "instructions": ["Step 1", "Step 2"],
      "ingredients": [
        { "name": "Ingredient name", "amount": "e.g., 2 large", "priceEstimate": 0.50 }
      ]
    },
    "lunch": {
      "name": "Meal name",
      "time": "Time estimation based on schedule",
      "whyAligned": "Explanation of how this fits schedule",
      "instructions": ["Step 1", "Step 2"],
      "ingredients": [
        { "name": "Ingredient name", "amount": "e.g., 200g", "priceEstimate": 3.00 }
      ]
    },
    "dinner": {
      "name": "Meal name",
      "time": "Time estimation based on schedule",
      "whyAligned": "Explanation of how this fits schedule",
      "instructions": ["Step 1", "Step 2"],
      "ingredients": [
        { "name": "Ingredient name", "amount": "e.g., 1 cup", "priceEstimate": 2.50 }
      ]
    }
  },
  "groceryList": [
    { "name": "Ingredient name", "category": "Produce/Protein/Pantry/Dairy/etc.", "amount": "aggregated amount", "estimatedPrice": 1.25 }
  ],
  "substitutions": [
    { "original": "Original ingredient", "alternative": "Substitute ingredient", "reason": "Why use this substitute (e.g. allergy, budget, availability)" }
  ],
  "budgetCheck": {
    "totalCostEstimate": 12.50,
    "meetsBudget": true,
    "analysis": "A detailed explanation of the cost breakdown and how it aligns with their target budget of $${budget}."
  }
}

Ensure all estimated prices are realistic for individual daily portions. Aggregate the grocery list logically from the ingredients. If exclusions are provided, ensure NO ingredients from the exclusions list are present in any recipe, and suggest substitutes in the 'substitutions' list. Check if totalCostEstimate <= budget. Set meetsBudget accordingly.`;

  if (!apiKey) {
    console.log('No GEMINI_API_KEY found in environment. Falling back to Mock generator.');
    return generateMockMealPlan(constraints);
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: systemPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!rawText) {
      throw new Error('Received empty response from LLM.');
    }

    // Parse the JSON returned by Gemini
    return JSON.parse(rawText.trim());
  } catch (error) {
    console.error('LLM generation error, falling back to mock:', error.message);
    return generateMockMealPlan(constraints);
  }
};

/**
 * Generates an intelligent mock meal plan matching constraints when LLM key is absent or fails.
 */
function generateMockMealPlan(constraints) {
  const { schedule, budget, dietType, exclusions } = constraints;
  
  const isHighProtein = dietType.toLowerCase().includes('protein') || schedule.toLowerCase().includes('workout') || schedule.toLowerCase().includes('exercise');
  const isVegan = dietType.toLowerCase().includes('vegan') || dietType.toLowerCase().includes('plant');
  const isKeto = dietType.toLowerCase().includes('keto') || dietType.toLowerCase().includes('carb');
  const hasAllergens = exclusions && exclusions.trim().length > 0;

  // Normalize allergen check
  const allergenList = hasAllergens ? exclusions.toLowerCase().split(',').map(s => s.trim()) : [];

  // Helper to check if ingredient is allergen
  const isExcluded = (name) => {
    return allergenList.some(allergen => name.toLowerCase().includes(allergen));
  };

  // Base recipes database
  let breakfastRecipe = {
    name: 'Greek Yogurt with Oats and Berries',
    time: '08:00 AM (Quick 5-min prep)',
    whyAligned: 'Quick to consume before starting a busy day. Provides complex carbs and quick energy.',
    instructions: ['Spoon yogurt into a bowl.', 'Top with oats, berries, and a drizzle of honey.'],
    ingredients: [
      { name: 'Greek Yogurt', amount: '1 cup', priceEstimate: 1.50 },
      { name: 'Rolled Oats', amount: '0.5 cup', priceEstimate: 0.30 },
      { name: 'Mixed Berries', amount: '0.25 cup', priceEstimate: 0.80 },
      { name: 'Honey', amount: '1 tbsp', priceEstimate: 0.20 }
    ]
  };

  let lunchRecipe = {
    name: 'Turkey and Avocado Wrap',
    time: '01:00 PM (Quick 10-min prep)',
    whyAligned: 'Portable and fast meal during a hectic schedule. Provides lean protein and healthy fats.',
    instructions: ['Spread avocado on whole wheat tortilla.', 'Layer turkey slices, spinach, and roll up tightly.'],
    ingredients: [
      { name: 'Whole Wheat Tortilla', amount: '1 large', priceEstimate: 0.50 },
      { name: 'Sliced Turkey Breast', amount: '100g', priceEstimate: 2.20 },
      { name: 'Avocado', amount: '0.5 medium', priceEstimate: 1.00 },
      { name: 'Baby Spinach', amount: '1 cup', priceEstimate: 0.40 }
    ]
  };

  let dinnerRecipe = {
    name: 'Pan-Seared Salmon with Quinoa and Asparagus',
    time: '07:30 PM (Relaxed 25-min cook)',
    whyAligned: 'Nutrient-dense dinner to recover after a heavy workout or a demanding day.',
    instructions: ['Season salmon with salt and pepper, sear in pan for 4-5 mins per side.', 'Cook quinoa according to instructions.', 'Steam asparagus and serve.'],
    ingredients: [
      { name: 'Salmon Fillet', amount: '150g', priceEstimate: 5.50 },
      { name: 'Quinoa', amount: '0.5 cup dry', priceEstimate: 0.60 },
      { name: 'Asparagus', amount: '100g', priceEstimate: 1.50 },
      { name: 'Olive Oil', amount: '1 tbsp', priceEstimate: 0.25 }
    ]
  };

  // Modify recipes based on dietType
  if (isVegan) {
    breakfastRecipe = {
      name: 'Chia Seed Coconut Pudding with Berries',
      time: '07:45 AM (Make ahead or 5-min prep)',
      whyAligned: 'Plant-based recipe loaded with healthy fats and fibers, keeping you full through a busy morning.',
      instructions: ['Mix chia seeds with coconut milk and vanilla extract.', 'Let sit overnight or for 15 mins.', 'Top with mixed berries.'],
      ingredients: [
        { name: 'Chia Seeds', amount: '3 tbsp', priceEstimate: 0.60 },
        { name: 'Coconut Milk', amount: '1 cup', priceEstimate: 1.20 },
        { name: 'Mixed Berries', amount: '0.25 cup', priceEstimate: 0.80 },
        { name: 'Maple Syrup', amount: '1 tbsp', priceEstimate: 0.30 }
      ]
    };
    
    lunchRecipe = {
      name: 'Spiced Chickpea & Quinoa Salad',
      time: '12:30 PM (Quick assembly)',
      whyAligned: 'High fiber, protein-packed plant salad that can be prepped in advance for your active schedule.',
      instructions: ['Rinse and drain canned chickpeas.', 'Toss cooked quinoa, chickpeas, diced cucumber, and olive oil dressing.', 'Garnish with fresh parsley.'],
      ingredients: [
        { name: 'Canned Chickpeas', amount: '0.5 can', priceEstimate: 0.60 },
        { name: 'Quinoa', amount: '0.5 cup dry', priceEstimate: 0.60 },
        { name: 'Cucumber', amount: '0.5 medium', priceEstimate: 0.40 },
        { name: 'Olive Oil & Lemon Dressing', amount: '2 tbsp', priceEstimate: 0.40 }
      ]
    };

    dinnerRecipe = {
      name: 'Tofu and Broccoli Stir-Fry with Rice',
      time: '06:45 PM (Quick 15-min stir fry)',
      whyAligned: 'Warm, savory plant-based stir-fry that replenishes glycogen stores post-workout.',
      instructions: ['Press tofu, slice, and pan-fry until golden.', 'Add broccoli florets and soy-ginger sauce, stir fry for 5 mins.', 'Serve hot over jasmine rice.'],
      ingredients: [
        { name: 'Firm Tofu', amount: '200g', priceEstimate: 1.50 },
        { name: 'Broccoli Florets', amount: '1.5 cups', priceEstimate: 1.00 },
        { name: 'Jasmine Rice', amount: '0.5 cup dry', priceEstimate: 0.30 },
        { name: 'Soy Sauce & Ginger Stir-fry Sauce', amount: '2 tbsp', priceEstimate: 0.50 }
      ]
    };
  } else if (isKeto) {
    breakfastRecipe = {
      name: 'Bacon, Avocado, and Scrambled Eggs',
      time: '08:30 AM (Quick 10-min cook)',
      whyAligned: 'High fat, ultra-low-carb breakfast to kickstart ketosis on a busy day.',
      instructions: ['Fry bacon until crispy.', 'Whisk eggs and cook in bacon fat.', 'Slice avocado and serve alongside.'],
      ingredients: [
        { name: 'Eggs', amount: '3 large', priceEstimate: 0.75 },
        { name: 'Bacon', amount: '3 slices', priceEstimate: 1.50 },
        { name: 'Avocado', amount: '0.5 medium', priceEstimate: 1.00 },
        { name: 'Butter', amount: '1 tbsp', priceEstimate: 0.20 }
      ]
    };

    lunchRecipe = {
      name: 'Keto Grilled Chicken Caesar Salad',
      time: '01:30 PM (Quick 10-min assembly)',
      whyAligned: 'No-carbs salad with rich healthy fats to power your afternoon schedule.',
      instructions: ['Chop Romaine lettuce.', 'Toss with Caesar dressing, parmesan cheese, and pre-grilled chicken breast.'],
      ingredients: [
        { name: 'Grilled Chicken Breast', amount: '150g', priceEstimate: 2.50 },
        { name: 'Romaine Lettuce', amount: '2 cups', priceEstimate: 0.80 },
        { name: 'Keto Caesar Dressing', amount: '2 tbsp', priceEstimate: 0.50 },
        { name: 'Parmesan Cheese', amount: '2 tbsp', priceEstimate: 0.60 }
      ]
    };

    dinnerRecipe = {
      name: 'Garlic Butter Steak with Zucchini Noodles',
      time: '08:00 PM (Quick 15-min cook)',
      whyAligned: 'Satisfying high-fat dinner to rebuild muscles without interrupting fat adaptation.',
      instructions: ['Sear steak in butter and minced garlic for 3-4 mins per side.', 'Saute zucchini noodles in the remaining garlic butter for 2 mins.', 'Serve steak over noodles.'],
      ingredients: [
        { name: 'Ribeye Steak', amount: '180g', priceEstimate: 7.50 },
        { name: 'Zucchini Noodles (Zoodles)', amount: '1.5 cups', priceEstimate: 1.20 },
        { name: 'Butter & Garlic', amount: '2 tbsp', priceEstimate: 0.50 }
      ]
    };
  } else if (isHighProtein) {
    breakfastRecipe = {
      name: 'High-Protein Egg White & Spinach Omelette',
      time: '07:30 AM (Quick 10-min prep)',
      whyAligned: 'Fueled with premium lean proteins to prepare your body for a heavy workout session.',
      instructions: ['Whisk egg whites and whole eggs together.', 'Sauté spinach in olive oil, then pour eggs over.', 'Cook until set, fold and serve.'],
      ingredients: [
        { name: 'Eggs', amount: '2 large', priceEstimate: 0.50 },
        { name: 'Egg Whites', amount: '0.5 cup', priceEstimate: 1.00 },
        { name: 'Baby Spinach', amount: '1 cup', priceEstimate: 0.40 },
        { name: 'Feta Cheese', amount: '2 tbsp', priceEstimate: 0.60 }
      ]
    };

    lunchRecipe = {
      name: 'Double Chicken Quinoa Salad Cup',
      time: '12:30 PM (Quick prepped meal)',
      whyAligned: 'Double serving of lean chicken paired with complex carb quinoa to keep protein synthesis active.',
      instructions: ['Toss shredded cooked chicken breast with cooked quinoa, cucumber, and light dressing.'],
      ingredients: [
        { name: 'Chicken Breast', amount: '200g', priceEstimate: 3.50 },
        { name: 'Quinoa', amount: '0.75 cup cooked', priceEstimate: 0.50 },
        { name: 'Cucumber', amount: '0.5 medium', priceEstimate: 0.40 },
        { name: 'Light Vinaigrette', amount: '1 tbsp', priceEstimate: 0.20 }
      ]
    };

    dinnerRecipe = {
      name: 'Lean Beef Stir-Fry with Broccoli and Brown Rice',
      time: '07:00 PM (Quick 20-min stir fry)',
      whyAligned: 'Post-workout muscle repair dinner with creatine-rich beef and complex carbs.',
      instructions: ['Stir-fry beef strips in a hot pan with sesame oil.', 'Add broccoli florets and low-sodium soy sauce.', 'Serve over steamed brown rice.'],
      ingredients: [
        { name: 'Lean Beef Strips', amount: '180g', priceEstimate: 4.80 },
        { name: 'Broccoli Florets', amount: '1.5 cups', priceEstimate: 1.00 },
        { name: 'Brown Rice', amount: '0.5 cup dry', priceEstimate: 0.25 },
        { name: 'Sesame Oil & Soy Sauce', amount: '1.5 tbsp', priceEstimate: 0.40 }
      ]
    };
  }

  // Adjust ingredients based on exclusions (e.g. substitute allergens)
  const substitutions = [];
  const handleSubstitution = (recipe) => {
    recipe.ingredients = recipe.ingredients.map(ing => {
      if (isExcluded(ing.name)) {
        let altName = 'Tofu';
        let altPrice = ing.priceEstimate;
        let reason = 'Excluded ingredient detected';

        if (ing.name.toLowerCase().includes('egg')) {
          altName = isVegan ? 'Chia Pudding Base' : 'Silken Tofu scramble';
          reason = 'Egg exclusion requested.';
        } else if (ing.name.toLowerCase().includes('yogurt') || ing.name.toLowerCase().includes('milk')) {
          altName = 'Coconut Milk Yogurt';
          altPrice = ing.priceEstimate + 0.5; // Dairy-free alternatives cost more
          reason = 'Dairy exclusion requested.';
        } else if (ing.name.toLowerCase().includes('turkey') || ing.name.toLowerCase().includes('chicken') || ing.name.toLowerCase().includes('beef') || ing.name.toLowerCase().includes('steak') || ing.name.toLowerCase().includes('salmon')) {
          altName = 'Tempeh / Extra Firm Tofu';
          altPrice = Math.max(1.5, ing.priceEstimate - 1.5); // Meat replacements can be cheaper
          reason = 'Meat/Fish exclusion requested.';
        } else if (ing.name.toLowerCase().includes('oat') || ing.name.toLowerCase().includes('tortilla') || ing.name.toLowerCase().includes('quinoa') || ing.name.toLowerCase().includes('rice')) {
          altName = 'Cauliflower Rice';
          reason = 'Grain/Carb exclusion requested.';
        } else if (ing.name.toLowerCase().includes('avocado')) {
          altName = 'Hummus';
          altPrice = 0.75;
          reason = 'Avocado/Nut exclusion requested.';
        }

        substitutions.push({
          original: ing.name,
          alternative: altName,
          reason: reason
        });

        return { ...ing, name: altName, priceEstimate: altPrice };
      }
      return ing;
    });
  };

  handleSubstitution(breakfastRecipe);
  handleSubstitution(lunchRecipe);
  handleSubstitution(dinnerRecipe);

  // Compile full ingredient list
  const allIngredients = [
    ...breakfastRecipe.ingredients,
    ...lunchRecipe.ingredients,
    ...dinnerRecipe.ingredients
  ];

  // Aggregate grocery list (combine duplicate ingredients)
  const aggregatedMap = new Map();
  allIngredients.forEach(ing => {
    const key = ing.name;
    if (aggregatedMap.has(key)) {
      const existing = aggregatedMap.get(key);
      existing.priceEstimate += ing.priceEstimate;
      // Combine amounts if possible
      existing.amount = `${existing.amount} + ${ing.amount}`;
    } else {
      aggregatedMap.set(key, {
        name: ing.name,
        amount: ing.amount,
        estimatedPrice: ing.priceEstimate,
        category: determineCategory(ing.name)
      });
    }
  });

  const groceryList = Array.from(aggregatedMap.values());

  // Calculate total cost
  const totalCostEstimate = parseFloat(
    groceryList.reduce((sum, item) => sum + item.estimatedPrice, 0).toFixed(2)
  );

  const meetsBudget = totalCostEstimate <= budget;

  // Generate budget analysis
  let analysis = `The total estimated cost for your meal plan is $${totalCostEstimate.toFixed(2)}. `;
  if (meetsBudget) {
    analysis += `This is under your daily target budget of $${budget.toFixed(2)} (saving you $${(budget - totalCostEstimate).toFixed(2)}). You are in a great financial range to prepare these healthy meals! To save more, buy grains and beans in bulk.`;
  } else {
    analysis += `This exceeds your target budget of $${budget.toFixed(2)} by $${(totalCostEstimate - budget).toFixed(2)}. To reduce costs, consider replacing premium ingredients (like fresh salmon or avocados) with canned salmon/tuna, frozen vegetables, or bulk beans.`;
  }

  return {
    menu: {
      breakfast: breakfastRecipe,
      lunch: lunchRecipe,
      dinner: dinnerRecipe
    },
    groceryList,
    substitutions,
    budgetCheck: {
      totalCostEstimate,
      meetsBudget,
      analysis
    }
  };
}

// Utility to categorize ingredients for grocery shopping list
function determineCategory(name) {
  const n = name.toLowerCase();
  if (n.includes('chicken') || n.includes('beef') || n.includes('turkey') || n.includes('salmon') || n.includes('steak') || n.includes('tofu') || n.includes('tempeh') || n.includes('bacon')) {
    return 'Protein';
  }
  if (n.includes('spinach') || n.includes('berry') || n.includes('berries') || n.includes('avocado') || n.includes('broccoli') || n.includes('cucumber') || n.includes('lettuce') || n.includes('asparagus') || n.includes('garlic')) {
    return 'Produce';
  }
  if (n.includes('yogurt') || n.includes('feta') || n.includes('butter') || n.includes('cheese')) {
    return 'Dairy / Alternatives';
  }
  if (n.includes('oat') || n.includes('tortilla') || n.includes('quinoa') || n.includes('rice') || n.includes('chia') || n.includes('milk') || n.includes('honey') || n.includes('maple') || n.includes('oil') || n.includes('sauce') || n.includes('dressing') || n.includes('chickpea')) {
    return 'Pantry / Grains';
  }
  return 'Other';
}
