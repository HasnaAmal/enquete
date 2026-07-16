import { prisma } from '../lib/prisma.mjs';

export const submitResponse = async (req, res, next) => {
  try {
    const { formId } = req.params;
    const { answers } = req.body;

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'answers object is required' });
    }

    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: { questions: true }
    });

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const response = await prisma.response.create({
      data: {
        formId,
        answers: {
          create: Object.entries(answers).map(([questionId, value]) => ({
            questionId,
            value: Array.isArray(value) ? JSON.stringify(value) : String(value)
          }))
        }
      },
      include: { answers: true }
    });

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export const getResponses = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const form = await prisma.form.findFirst({
      where: {
        id: req.params.formId,
        userId: req.user.id
      }
    });

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const responses = await prisma.response.findMany({
      where: { formId: req.params.formId },
      include: {
        answers: {
          include: { question: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(responses);
  } catch (err) {
    next(err);
  }
};
