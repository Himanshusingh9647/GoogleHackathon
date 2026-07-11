import { PrismaClient } from '@prisma/client';
import { generateMealPlanFromLLM } from '../services/llmService.js';

const prisma = new PrismaClient();

/**
 * Controller to generate and store a new meal plan based on constraints.
 */
export const createMealPlan = async (req, res) => {
  const { schedule, budget, dietType, exclusions } = req.body;

  try {
    // 1. Store the user's constraints in SQLite database
    const userRequest = await prisma.userRequest.create({
      data: {
        schedule,
        budget: parseFloat(budget),
        dietType,
        exclusions: exclusions || '',
      },
    });

    // 2. Call LLM Service to generate the meal plan, grocery list, and substitutions
    const generatedData = await generateMealPlanFromLLM({
      schedule,
      budget: parseFloat(budget),
      dietType,
      exclusions: exclusions || '',
    });

    // 3. Save the generated meal plan to the SQLite database
    const mealPlan = await prisma.mealPlan.create({
      data: {
        requestId: userRequest.id,
        menu: JSON.stringify(generatedData.menu),
        groceryList: JSON.stringify(generatedData.groceryList),
        substitutions: JSON.stringify(generatedData.substitutions),
        budgetCheck: JSON.stringify(generatedData.budgetCheck),
      },
    });

    // 4. Return the complete package to the user
    return res.status(201).json({
      id: mealPlan.id,
      requestId: userRequest.id,
      schedule: userRequest.schedule,
      budget: userRequest.budget,
      dietType: userRequest.dietType,
      exclusions: userRequest.exclusions,
      menu: generatedData.menu,
      groceryList: generatedData.groceryList,
      substitutions: generatedData.substitutions,
      budgetCheck: generatedData.budgetCheck,
      createdAt: mealPlan.createdAt,
    });
  } catch (error) {
    console.error('Error in createMealPlan controller:', error);
    return res.status(500).json({
      error: 'An internal server error occurred while generating the meal plan.',
      message: error.message,
    });
  }
};

/**
 * Controller to get all historical meal plans.
 */
export const getMealPlansHistory = async (req, res) => {
  try {
    const mealPlans = await prisma.mealPlan.findMany({
      include: {
        request: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Parse stringified JSON fields back to objects
    const parsedPlans = mealPlans.map((plan) => ({
      id: plan.id,
      requestId: plan.requestId,
      schedule: plan.request.schedule,
      budget: plan.request.budget,
      dietType: plan.request.dietType,
      exclusions: plan.request.exclusions,
      menu: JSON.parse(plan.menu),
      groceryList: JSON.parse(plan.groceryList),
      substitutions: JSON.parse(plan.substitutions),
      budgetCheck: JSON.parse(plan.budgetCheck),
      createdAt: plan.createdAt,
    }));

    return res.status(200).json(parsedPlans);
  } catch (error) {
    console.error('Error fetching meal plans history:', error);
    return res.status(500).json({
      error: 'An error occurred while fetching the meal plans history.',
      message: error.message,
    });
  }
};

/**
 * Controller to get details of a specific meal plan.
 */
export const getMealPlanById = async (req, res) => {
  const { id } = req.params;

  try {
    const plan = await prisma.mealPlan.findUnique({
      where: { id },
      include: { request: true },
    });

    if (!plan) {
      return res.status(404).json({ error: 'Meal plan not found.' });
    }

    return res.status(200).json({
      id: plan.id,
      requestId: plan.requestId,
      schedule: plan.request.schedule,
      budget: plan.request.budget,
      dietType: plan.request.dietType,
      exclusions: plan.request.exclusions,
      menu: JSON.parse(plan.menu),
      groceryList: JSON.parse(plan.groceryList),
      substitutions: JSON.parse(plan.substitutions),
      budgetCheck: JSON.parse(plan.budgetCheck),
      createdAt: plan.createdAt,
    });
  } catch (error) {
    console.error('Error fetching meal plan by ID:', error);
    return res.status(500).json({
      error: 'An error occurred while retrieving the meal plan.',
      message: error.message,
    });
  }
};
