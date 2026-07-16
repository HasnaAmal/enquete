import { Router } from 'express';
import {
  getForms,
  getFormById,
  createForm,
  updateForm,
  deleteForm
} from '../controllers/formController.mjs';
import { saveQuestions } from '../controllers/questionController.mjs';
import {
  submitResponse,
  getResponses
} from '../controllers/responseController.mjs';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/forms', protect, getForms);
router.get('/forms/:id', protect, getFormById);

router.post('/forms', protect, createForm);
router.put('/forms/:id', protect, updateForm);
router.delete('/forms/:id', protect, deleteForm);

router.post('/forms/:formId/questions', protect, saveQuestions);

router.post('/forms/:formId/responses', submitResponse);
router.get('/forms/:formId/responses', protect, getResponses);

export default router;
