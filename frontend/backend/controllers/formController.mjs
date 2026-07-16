import { prisma } from '../lib/prisma.mjs';

export const getForms = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const forms = await prisma.form.findMany({
      where: { userId: req.user.id },
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
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const form = await prisma.form.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
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
    const title = req.body?.title;
    const description = req.body?.description;

    if (!req.user?.id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!title || !String(title).trim()) {
      return res.status(400).json({
        error: 'Title is required'
      });
    }

    const form = await prisma.form.create({
      data: {
        title: String(title).trim(),
        description: description ? String(description).trim() : '',
        userId: req.user.id
      }
    });

    return res.status(201).json(form);
  } catch (err) {
    next(err);
  }
};

export const updateForm = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { title, description, status } = req.body || {};

    const existingForm = await prisma.form.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!existingForm) {
      return res.status(404).json({ error: 'Form not found' });
    }

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
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const existingForm = await prisma.form.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!existingForm) {
      return res.status(404).json({ error: 'Form not found' });
    }

    await prisma.form.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
