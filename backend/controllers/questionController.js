import { prisma } from '../lib/prisma.js';

export const saveQuestions = async (req, res) => {
  try {
    const formId = req.params.formId;
    const { questions } = req.body;

    if (!formId || typeof formId !== 'string') {
      return res.status(400).json({ error: 'Invalid formId' });
    }

    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: 'questions must be an array' });
    }

    const responseCount = await prisma.response.count({
      where: { formId }
    });

    if (responseCount > 0) {
      return res.status(400).json({
        error: 'This form already has responses, so its questions can no longer be edited.'
      });
    }

    await prisma.question.deleteMany({
      where: { formId }
    });

    const created = [];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      const item = await prisma.question.create({
        data: {
          formId,
          order: i,
          text: q.text,
          type: q.type.toUpperCase(),
          required: q.required ?? false,
          options: q.options ?? []
        }
      });

      created.push(item);
    }

    const saved = await prisma.question.findMany({
      where: { formId },
      orderBy: { order: 'asc' }
    });

    return res.json(saved);
  } catch (err) {
    console.error('SAVE QUESTIONS ERROR FULL:', err);
    return res.status(500).json({
      error: err.message,
      code: err.code || null,
      meta: err.meta || null
    });
  }
};