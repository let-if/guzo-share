import express from 'express';
import cors from 'cors';
import { prisma } from './lib/prisma.ts'; // Import the configured adapter instance
import authRoutes from './routes/auth.js';
import tripRoutes from './routes/trips.js';
import notificationRoutes from './routes/notifications.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/notifications', notificationRoutes);
// ... (keep the rest of your route endpoints below)

// 1. Register User
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, phoneNumber, role, telegramHandle } = req.body;
    const user = await prisma.user.create({
      data: { fullName, phoneNumber, role, telegramHandle }
    });
    res.json({ success: true, user });
  } catch (err) {
    const error = err;
    res.status(400).json({ success: false, error: error.message });
  }
});

// 2. Post a Trip (Driver)
app.post('/api/trips', async (req, res) => {
  try {
    const { driverId, origin, destination, departureTime, availableSeats, pricePerSeat } = req.body;
    
    const trip = await prisma.trip.create({
      data: {
        driverId: Number(driverId),
        origin: String(origin),
        destination: String(destination),
        departureTime: new Date(departureTime),
        availableSeats: Number(availableSeats),
        pricePerSeat: Number(pricePerSeat)
      }
    });
    
    res.json({ success: true, trip });
  } catch (err) {
    const error = err;
    res.status(400).json({ success: false, error: error.message });
  }
});

// 3. Get All Active Trips (Passenger Search Feed)
app.get('/api/trips', async (req, res) => {
  try {
    const destinationQuery = req.query.destination;
    const trips = await prisma.trip.findMany({
      where: {
        status: 'active',
        ...(destinationQuery ? { destination: { contains: String(destinationQuery), mode: 'insensitive' } } : {})
      },
      include: {
        driver: { select: { fullName: true, phoneNumber: true, telegramHandle: true } }
      },
      orderBy: { departureTime: 'asc' }
    });
    res.json({ success: true, trips });
  } catch (err) {
    const error = err;
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Book a Seat on a Trip
app.post('/api/bookings', async (req, res) => {
  try {
    const { tripId, passengerId, seatsBooked } = req.body;
    
    const booking = await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({ where: { id: Number(tripId) } });
      if (!trip || trip.availableSeats < Number(seatsBooked)) {
        throw new Error('Not enough seats available');
      }

      await tx.trip.update({
        where: { id: Number(tripId) },
        data: { availableSeats: trip.availableSeats - Number(seatsBooked) }
      });

      return await tx.booking.create({
        data: {
          tripId: Number(tripId),
          passengerId: Number(passengerId),
          seatsBooked: Number(seatsBooked)
        }
      });
    });

    res.json({ success: true, booking });
  } catch (err) {
    const error = err;
    res.status(400).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Guzo-Share backend running on port ${PORT}`));