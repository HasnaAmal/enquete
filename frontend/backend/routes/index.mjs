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

const router = Router();

router.get('/forms', getForms);
router.post('/forms', createForm);
router.get('/forms/:id', getFormById);
router.put('/forms/:id', updateForm);
router.delete('/forms/:id', deleteForm);

router.post('/forms/:formId/questions', saveQuestions);

router.post('/forms/:formId/responses', submitResponse);
router.get('/forms/:formId/responses', getResponses);

export default router;
