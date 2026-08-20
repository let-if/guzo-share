import express from 'express';
import { prisma } from '../lib/prisma.ts';

const router = express.Router();

// Get notifications for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await prisma.notification.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Mark notifications as read
router.patch('/:userId/read', async (req, res) => {
  try {
    const { userId } = req.params;
    await prisma.notification.updateMany({
      where: { userId: Number(userId), isRead: false },
      data: { isRead: true }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;