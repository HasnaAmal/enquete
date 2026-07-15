import { prisma } from '../lib/prisma.mjs';

export const getForms = async (req, res, next) => {
  try {
    const forms = await prisma.form.findMany({
      include: {
        _count: {
          select: { questions: true, responses: true }
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
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
        questions: { orderBy: { order: 'asc' } },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        }
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
    console.log('createForm req.body:', req.body);
    console.log('createForm req.user:', req.user);

    const title = req.body?.title;
    const description = req.body?.description;

    if (!req.user?.id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!title || !String(title).trim()) {
      return res.status(400).json({
        error: 'Title is required',
        debug: {
          body: req.body,
          contentType: req.headers['content-type'] || null
        }
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
    const { title, description, status } = req.body || {};

    const existingForm = await prisma.form.findUnique({
      where: { id: req.params.id }
    });

    if (!existingForm) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const isOwner = existingForm.userId === req.user?.id;
    const isAdmin = req.user?.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to update this form' });
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
    const existingForm = await prisma.form.findUnique({
      where: { id: req.params.id }
    });

    if (!existingForm) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const isOwner = existingForm.userId === req.user?.id;
    const isAdmin = req.user?.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this form' });
    }

    await prisma.form.delete({
      where: { id: req.params.id }
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
