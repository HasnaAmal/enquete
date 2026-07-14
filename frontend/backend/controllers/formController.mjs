import { prisma } from '../lib/prisma.mjs';

export const getForms = async (req, res, next) => {
  try {
    const forms = await prisma.form.findMany({
      include: {
        _count: {
          select: { questions: true, responses: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json(forms);
  } catch (err) {
    next(err);
  }
};

export const getFormById = async (req, res, next) => {
  try {
    const form = await prisma.form.findUnique({
      where: { id: req.params.id },
      include: {
        questions: { orderBy: { order: 'asc' } }
      }
    });

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.json(form);
  } catch (err) {
    next(err);
  }
};

export const createForm = async (req, res, next) => {
  try {
    console.log('content-type:', req.headers['content-type']);
    console.log('req.body:', req.body);

    const { title, description } = req.body || {};

    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const form = await prisma.form.create({
      data: {
        title: String(title).trim(),
        description: description ? String(description).trim() : ''
      }
    });

    res.status(201).json(form);
  } catch (err) {
    next(err);
  }
};

export const updateForm = async (req, res, next) => {
  try {
    const { title, description, status } = req.body || {};

    const form = await prisma.form.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title: String(title).trim() }),
        ...(description !== undefined && { description: String(description).trim() }),
        ...(status && { status })
      }
    });

    res.json(form);
  } catch (err) {
    next(err);
  }
};

export const deleteForm = async (req, res, next) => {
  try {
    await prisma.form.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
