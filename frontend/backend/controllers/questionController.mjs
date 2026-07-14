import { prisma } from '../lib/prisma.mjs';

export const saveQuestions = async (req, res, next) => {
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

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      await prisma.question.create({
        data: {
          formId,
          order: i,
          text: q.text,
          type: q.type.toUpperCase(),
          required: q.required ?? false,
          options: q.options ?? []
        }
      });
    }

    const saved = await prisma.question.findMany({
      where: { formId },
      orderBy: { order: 'asc' }
    });

    return res.json(saved);
  } catch (err) {
    next(err);
  }
};
