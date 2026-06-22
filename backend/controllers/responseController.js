
import { prisma } from '../lib/prisma.js';
export const submitResponse = async (req, res, next) => {
  try {
    const { formId } = req.params;
    const { answers } = req.body;

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'answers object is required' });
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
  } catch (err) { next(err); }
};

export const getResponses = async (req, res, next) => {
  try {
    const responses = await prisma.response.findMany({
      where: { formId: req.params.formId },
      include: { answers: { include: { question: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(responses);
  } catch (err) { next(err); }
};