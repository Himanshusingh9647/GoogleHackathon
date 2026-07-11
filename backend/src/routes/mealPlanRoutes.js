import { Router } from 'express';
import {
  createMealPlan,
  getMealPlansHistory,
  getMealPlanById,
} from '../controllers/mealPlanController.js';
import { mealPlanGeneratorLimiter } from '../middleware/rateLimiter.js';
import { validateMealPlanRequest } from '../middleware/validation.js';

const router = Router();

// Route to generate a new meal plan (Rate limited to avoid AI API spamming)
router.post('/', mealPlanGeneratorLimiter, validateMealPlanRequest, createMealPlan);

// Route to fetch all generated meal plans
router.get('/', getMealPlansHistory);

// Route to fetch a single meal plan by ID
router.get('/:id', getMealPlanById);

export default router;
