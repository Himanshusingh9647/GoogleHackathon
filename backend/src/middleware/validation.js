import { body, validationResult } from 'express-validator';

// Blacklist of terms commonly used in prompt injection attacks
const PROMPT_INJECTION_BLACKLIST = [
  'ignore previous instructions',
  'ignore all instructions',
  'ignore the rules',
  'forget everything',
  'bypass filter',
  'system prompt',
  'you are now',
  'act as',
  'override',
  'jailbreak',
  'translate this to',
  'do not translate',
  'read from',
  'read file',
  'database dump',
  'sql injection',
  'select * from',
  '<script>',
  'javascript:',
];

// Helper function to check for prompt injection
const detectPromptInjection = (value) => {
  if (!value || typeof value !== 'string') return false;
  const lowercaseValue = value.toLowerCase();
  return PROMPT_INJECTION_BLACKLIST.some((term) => lowercaseValue.includes(term));
};

export const validateMealPlanRequest = [
  // 1. Validate 'schedule'
  body('schedule')
    .trim()
    .notEmpty()
    .withMessage('Schedule detail is required.')
    .isLength({ max: 400 })
    .withMessage('Schedule description cannot exceed 400 characters.')
    .custom((value) => {
      if (detectPromptInjection(value)) {
        throw new Error('Potential prompt injection detected. Please avoid system-level command phrases.');
      }
      return true;
    }),

  // 2. Validate 'budget'
  body('budget')
    .trim()
    .notEmpty()
    .withMessage('Budget is required.')
    .isFloat({ min: 1, max: 1000 })
    .withMessage('Budget must be a number between $1 and $1000.')
    .toFloat(),

  // 3. Validate 'dietType'
  body('dietType')
    .trim()
    .notEmpty()
    .withMessage('Diet type is required.')
    .isLength({ max: 50 })
    .withMessage('Diet type description is too long.')
    .custom((value) => {
      if (detectPromptInjection(value)) {
        throw new Error('Potential prompt injection detected in diet type field.');
      }
      return true;
    }),

  // 4. Validate 'exclusions' (optional)
  body('exclusions')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Exclusions list cannot exceed 200 characters.')
    .custom((value) => {
      if (value && detectPromptInjection(value)) {
        throw new Error('Potential prompt injection detected in exclusions field.');
      }
      return true;
    }),

  // Middleware execution function
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array()[0].msg,
        details: errors.array(),
      });
    }
    next();
  },
];
