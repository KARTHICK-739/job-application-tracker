import express from 'express';
import { body } from 'express-validator';
import {
  createApplication,
  deleteApplication,
  getApplicationById,
  getApplications,
  getApplicationStats,
  updateApplication
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';
import { APPLICATION_STATUSES, JOB_TYPES } from '../models/JobApplication.js';

const router = express.Router();

const applicationValidators = [
  body('company').trim().notEmpty().withMessage('Company is required').isLength({ max: 120 }).withMessage('Company is too long'),
  body('position').trim().notEmpty().withMessage('Position is required').isLength({ max: 120 }).withMessage('Position is too long'),
  body('location').optional({ values: 'falsy' }).trim().isLength({ max: 120 }).withMessage('Location is too long'),
  body('jobType').optional().isIn(JOB_TYPES).withMessage('Invalid job type'),
  body('status').optional().isIn(APPLICATION_STATUSES).withMessage('Invalid status'),
  body('appliedDate').optional().isISO8601().withMessage('Applied date must be a valid date'),
  body('salary').optional({ values: 'falsy' }).trim().isLength({ max: 80 }).withMessage('Salary is too long'),
  body('jobUrl').optional({ values: 'falsy' }).trim().isURL({ require_protocol: true }).withMessage('Job URL must include http:// or https://'),
  body('notes').optional({ values: 'falsy' }).trim().isLength({ max: 2000 }).withMessage('Notes are too long')
];

router.use(protect);

router.get('/stats', getApplicationStats);
router.route('/').get(getApplications).post(applicationValidators, validateRequest, createApplication);
router
  .route('/:id')
  .get(getApplicationById)
  .put(applicationValidators, validateRequest, updateApplication)
  .delete(deleteApplication);

export default router;

