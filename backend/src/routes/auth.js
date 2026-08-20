// import express from 'express';
// import { prisma } from '../lib/prisma.ts';

// const router = express.Router();

// // Register or Login User via Phone Number
// router.post('/login', async (req, res) => {
//   try {
//     const { fullName, phoneNumber, role, telegramHandle } = req.body;
    
//     if (!phoneNumber) {
//       return res.status(400).json({ success: false, error: 'Phone number is required' });
//     }

//     let user = await prisma.user.findUnique({
//       where: { phoneNumber: String(phoneNumber) }
//     });

//     if (!user) {
//       if (!fullName) {
//         return res.status(400).json({ success: false, error: 'Full name is required for registration' });
//       }
//       user = await prisma.user.create({
//         data: {
//           fullName: String(fullName),
//           phoneNumber: String(phoneNumber),
//           role: role || 'passenger',
//           telegramHandle: telegramHandle ? String(telegramHandle) : null
//         }
//       });
//     }

//     res.json({ success: true, user });
//   } catch (err) {
//     const error = err;
//     res.status(400).json({ success: false, error: error.message });
//   }
// });

// export default router;
import express from 'express';
import { prisma } from '../lib/prisma.ts';

const router = express.Router();

// Sign Up Route
router.post('/signup', async (req, res) => {
  try {
    const { fullName, phoneNumber, role, telegramHandle } = req.body;
    
    if (!fullName || !phoneNumber) {
      return res.status(400).json({ success: false, error: 'Full name and phone number are required' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber: String(phoneNumber) }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, error: 'An account with this phone number already exists. Please sign in.' });
    }

    const user = await prisma.user.create({
      data: {
        fullName: String(fullName),
        phoneNumber: String(phoneNumber),
        role: role || 'passenger',
        telegramHandle: telegramHandle ? String(telegramHandle) : null
      }
    });

    res.json({ success: true, user });
  } catch (err) {
    const error = err;
    res.status(400).json({ success: false, error: error.message });
  }
});

// Sign In Route
router.post('/signin', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    const user = await prisma.user.findUnique({
      where: { phoneNumber: String(phoneNumber) }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'No account found with this phone number. Please sign up first.' });
    }

    res.json({ success: true, user });
  } catch (err) {
    const error = err;
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;