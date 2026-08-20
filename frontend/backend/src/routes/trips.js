
// import express from 'express';
// import { prisma } from '../lib/prisma.ts';

// const router = express.Router();

// // Post a Trip (Driver)
// router.post('/', async (req, res) => {
//   try {
//     const { driverId, origin, destination, departureTime, availableSeats, pricePerSeat } = req.body;
    
//     const trip = await prisma.trip.create({
//       data: {
//         driverId: Number(driverId),
//         origin: String(origin),
//         destination: String(destination),
//         departureTime: new Date(departureTime),
//         availableSeats: Number(availableSeats),
//         pricePerSeat: Number(pricePerSeat),
//         status: 'active'
//       }
//     });
    
//     res.json({ success: true, trip });
//   } catch (err) {
//     console.error("Post Trip Error:", err);
//     res.status(400).json({ success: false, error: err.message });
//   }
// });

// // Get All Active Trips (Automatically filters out completed/cancelled trips and past travel times)
// router.get('/', async (req, res) => {
//   try {
//     const { origin, destination } = req.query;
//     const now = new Date();

//     const trips = await prisma.trip.findMany({
//       where: {
//         status: 'active', // Strict filter: completed or cancelled trips never appear in explore feed
//         departureTime: { gte: now },
//         ...(origin ? { origin: { contains: String(origin), mode: 'insensitive' } } : {}),
//         ...(destination ? { destination: { contains: String(destination), mode: 'insensitive' } } : {})
//       },
//       include: {
//         driver: { select: { fullName: true, phoneNumber: true, telegramHandle: true } }
//       },
//       orderBy: { departureTime: 'asc' }
//     });
//     res.json({ success: true, trips });
//   } catch (err) {
//     console.error("Get Trips Error:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // Get all bookings for a specific passenger
// router.get('/passenger/:passengerId/bookings', async (req, res) => {
//   try {
//     const { passengerId } = req.params;
//     const bookings = await prisma.booking.findMany({
//       where: { passengerId: Number(passengerId) },
//       include: {
//         trip: {
//           include: { driver: { select: { fullName: true, phoneNumber: true } } }
//         }
//       }
//     });
//     res.json({ success: true, bookings });
//   } catch (err) {
//     console.error("Passenger Bookings Error:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // Get all bookings for a specific driver's trips
// router.get('/driver/:driverId/bookings', async (req, res) => {
//   try {
//     const { driverId } = req.params;
//     const trips = await prisma.trip.findMany({
//       where: { driverId: Number(driverId) },
//       include: {
//         bookings: {
//           include: {
//             passenger: { select: { fullName: true, phoneNumber: true } }
//           }
//         }
//       }
//     });

//     const bookings = trips.flatMap(trip => 
//       trip.bookings.map(b => ({
//         ...b,
//         tripOrigin: trip.origin,
//         tripDestination: trip.destination,
//         departureTime: trip.departureTime,
//         tripStatus: trip.status
//       }))
//     );

//     res.json({ success: true, bookings });
//   } catch (err) {
//     console.error("Driver Bookings Error:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // Request a Booking on a Trip (Notifies Driver)
// router.post('/bookings', async (req, res) => {
//   try {
//     const { tripId, passengerId, seatsBooked } = req.body;
    
//     const result = await prisma.$transaction(async (tx) => {
//       const trip = await tx.trip.findUnique({ 
//         where: { id: Number(tripId) },
//         include: { driver: true }
//       });
//       if (!trip || trip.status !== 'active' || trip.availableSeats < Number(seatsBooked || 1)) {
//         throw new Error('Trip is inactive or not enough seats available');
//       }

//       const booking = await tx.booking.create({
//         data: {
//           tripId: Number(tripId),
//           passengerId: Number(passengerId),
//           seatsBooked: Number(seatsBooked || 1),
//           status: 'pending'
//         },
//         include: { passenger: true }
//       });

//       // Create notification for driver
//       await tx.notification.create({
//         data: {
//           userId: trip.driverId,
//           message: `New booking request from ${booking.passenger.fullName} for route ${trip.origin} ➔ ${trip.destination}`,
//           type: 'booking_request'
//         }
//       });

//       return booking;
//     });

//     res.json({ success: true, booking: result });
//   } catch (err) {
//     console.error("Booking Creation Error:", err);
//     res.status(400).json({ success: false, error: err.message });
//   }
// });

// // Driver updates booking status (Notifies Passenger)
// router.patch('/bookings/:bookingId/status', async (req, res) => {
//   try {
//     const { bookingId } = req.params;
//     const { status } = req.body; // 'confirmed' or 'rejected'

//     const updatedBooking = await prisma.$transaction(async (tx) => {
//       const booking = await tx.booking.findUnique({
//         where: { id: Number(bookingId) },
//         include: { trip: true, passenger: true }
//       });

//       if (!booking) throw new Error('Booking not found');

//       if (status === 'confirmed' && booking.status === 'pending') {
//         if (booking.trip.availableSeats < booking.seatsBooked) {
//           throw new Error('Not enough seats available to confirm');
//         }
//         await tx.trip.update({
//           where: { id: booking.tripId },
//           data: { availableSeats: booking.trip.availableSeats - booking.seatsBooked }
//         });
//       }

//       const updated = await tx.booking.update({
//         where: { id: Number(bookingId) },
//         data: { status }
//       });

//       // Create notification for passenger
//       const msg = status === 'confirmed' 
//         ? `Your booking for ${booking.trip.origin} ➔ ${booking.trip.destination} has been CONFIRMED by the driver! ✅`
//         : `Your booking for ${booking.trip.origin} ➔ ${booking.trip.destination} was declined by the driver. ❌`;

//       await tx.notification.create({
//         data: {
//           userId: booking.passengerId,
//           message: msg,
//           type: status === 'confirmed' ? 'booking_accepted' : 'booking_rejected'
//         }
//       });

//       return updated;
//     });

//     res.json({ success: true, updatedBooking });
//   } catch (err) {
//     console.error("Update Status Error:", err);
//     res.status(400).json({ success: false, error: err.message });
//   }
// });

// // Passenger shares pickup location
// router.patch('/bookings/:bookingId/location', async (req, res) => {
//   try {
//     const { bookingId } = req.params;
//     const { latitude, longitude } = req.body;

//     const booking = await prisma.booking.findUnique({
//       where: { id: Number(bookingId) },
//       include: { trip: true, passenger: true }
//     });

//     if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });

//     // Update booking with coordinates
//     const updatedBooking = await prisma.booking.update({
//       where: { id: Number(bookingId) },
//       data: {
//         pickupLat: Number(latitude),
//         pickupLng: Number(longitude),
//         locationSharedAt: new Date()
//       }
//     });

//     // Notify driver that passenger shared location
//     await prisma.notification.create({
//       data: {
//         userId: booking.trip.driverId,
//         message: `📍 ${booking.passenger.fullName} shared their pickup location for route ${booking.trip.origin} ➔ ${booking.trip.destination}!`,
//         type: 'location_shared'
//       }
//     });

//     res.json({ success: true, updatedBooking });
//   } catch (err) {
//     console.error("Location Share Error:", err);
//     res.status(400).json({ success: false, error: err.message });
//   }
// });

// // Driver completes a trip (removes it from live feed and archives it)
// router.patch('/:tripId/complete', async (req, res) => {
//   try {
//     const { tripId } = req.params;

//     const completedTrip = await prisma.$transaction(async (tx) => {
//       const trip = await tx.trip.findUnique({
//         where: { id: Number(tripId) },
//         include: { bookings: true }
//       });

//       if (!trip) throw new Error('Trip not found');

//       // Update trip status to completed (removes from active explore feed)
//       const updated = await tx.trip.update({
//         where: { id: Number(tripId) },
//         data: { status: 'completed' }
//       });

//       // Notify all confirmed passengers that the trip has concluded
//       const confirmedBookings = trip.bookings.filter(b => b.status === 'confirmed');
//       for (const booking of confirmedBookings) {
//         await tx.notification.create({
//           data: {
//             userId: booking.passengerId,
//             message: `🏁 Your trip from ${trip.origin} to ${trip.destination} has been completed by the driver. Thank you for riding with Guzo-Share!`,
//             type: 'trip_completed'
//           }
//         });
//       }

//       return updated;
//     });

//     res.json({ success: true, completedTrip });
//   } catch (err) {
//     console.error("Complete Trip Error:", err);
//     res.status(400).json({ success: false, error: err.message });
//   }
// });

// export default router;
import express from 'express';
import { prisma } from '../lib/prisma.ts';

const router = express.Router();

// Post a Trip (Driver)
router.post('/', async (req, res) => {
  try {
    const { driverId, origin, destination, departureTime, availableSeats, pricePerSeat } = req.body;

    const parsedDate = departureTime ? new Date(departureTime) : new Date(Date.now() + 7200000);
    const validDeparture = isNaN(parsedDate.getTime()) ? new Date(Date.now() + 7200000) : parsedDate;

    const trip = await prisma.trip.create({
      data: {
        driverId: Number(driverId),
        origin: String(origin),
        destination: String(destination),
        departureTime: validDeparture,
        availableSeats: Number(availableSeats || 1),
        pricePerSeat: Number(pricePerSeat || 0),
        status: 'active'
      }
    });

    res.json({ success: true, trip });
  } catch (err) {
    console.error("Post Trip Error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// Get All Active Trips (Reliably shows active trips on the Explore page)
router.get('/', async (req, res) => {
  try {
    const { origin, destination } = req.query;

    const trips = await prisma.trip.findMany({
      where: {
        status: 'active', // Strict filter: only active trips appear in explore feed
        ...(origin ? { origin: { contains: String(origin), mode: 'insensitive' } } : {}),
        ...(destination ? { destination: { contains: String(destination), mode: 'insensitive' } } : {})
      },
      include: {
        driver: { select: { fullName: true, phoneNumber: true, telegramHandle: true } }
      },
      orderBy: { departureTime: 'asc' }
    });
    
    res.json({ success: true, trips });
  } catch (err) {
    console.error("Get Trips Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all bookings for a specific passenger
router.get('/passenger/:passengerId/bookings', async (req, res) => {
  try {
    const { passengerId } = req.params;
    const bookings = await prisma.booking.findMany({
      where: { passengerId: Number(passengerId) },
      include: {
        trip: {
          include: { driver: { select: { fullName: true, phoneNumber: true } } }
        }
      }
    });
    res.json({ success: true, bookings });
  } catch (err) {
    console.error("Passenger Bookings Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all bookings for a specific driver's trips
router.get('/driver/:driverId/bookings', async (req, res) => {
  try {
    const { driverId } = req.params;
    const trips = await prisma.trip.findMany({
      where: { driverId: Number(driverId) },
      include: {
        bookings: {
          include: {
            passenger: { select: { fullName: true, phoneNumber: true } }
          }
        }
      }
    });

    const bookings = trips.flatMap(trip => 
      trip.bookings.map(b => ({
        ...b,
        tripOrigin: trip.origin,
        tripDestination: trip.destination,
        departureTime: trip.departureTime,
        tripStatus: trip.status
      }))
    );

    res.json({ success: true, bookings });
  } catch (err) {
    console.error("Driver Bookings Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Request a Booking on a Trip (Notifies Driver & Handles Multi-Seats)
router.post('/bookings', async (req, res) => {
  try {
    const { tripId, passengerId, seatsBooked } = req.body;
    const requestedSeats = Number(seatsBooked || 1);

    const result = await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({ 
        where: { id: Number(tripId) },
        include: { driver: true }
      });
      if (!trip || trip.status !== 'active' || trip.availableSeats < requestedSeats) {
        throw new Error('Trip is inactive or not enough seats available');
      }

      const booking = await tx.booking.create({
        data: {
          tripId: Number(tripId),
          passengerId: Number(passengerId),
          seatsBooked: requestedSeats,
          status: 'pending'
        },
        include: { passenger: true }
      });

      // Create notification for driver
      await tx.notification.create({
        data: {
          userId: trip.driverId,
          message: `New booking request: ${booking.passenger.fullName} requested ${requestedSeats} seat(s) for ${trip.origin} ➔ ${trip.destination}`,
          type: 'booking_request'
        }
      });

      return booking;
    });

    res.json({ success: true, booking: result });
  } catch (err) {
    console.error("Booking Creation Error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// Driver updates booking status (Notifies Passenger)
router.patch('/bookings/:bookingId/status', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body; // 'confirmed' or 'rejected'

    const updatedBooking = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: Number(bookingId) },
        include: { trip: true, passenger: true }
      });

      if (!booking) throw new Error('Booking not found');

      if (status === 'confirmed' && booking.status === 'pending') {
        if (booking.trip.availableSeats < booking.seatsBooked) {
          throw new Error('Not enough seats available to confirm');
        }
        await tx.trip.update({
          where: { id: booking.tripId },
          data: { availableSeats: booking.trip.availableSeats - booking.seatsBooked }
        });
      }

      const updated = await tx.booking.update({
        where: { id: Number(bookingId) },
        data: { status }
      });

      // Create notification for passenger
      const msg = status === 'confirmed' 
        ? `Your booking for ${booking.trip.origin} ➔ ${booking.trip.destination} has been CONFIRMED by the driver! ✅`
        : `Your booking for ${booking.trip.origin} ➔ ${booking.trip.destination} was declined by the driver. ❌`;

      await tx.notification.create({
        data: {
          userId: booking.passengerId,
          message: msg,
          type: status === 'confirmed' ? 'booking_accepted' : 'booking_rejected'
        }
      });

      return updated;
    });

    res.json({ success: true, updatedBooking });
  } catch (err) {
    console.error("Update Status Error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// Passenger shares pickup location
router.patch('/bookings/:bookingId/location', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { latitude, longitude } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
      include: { trip: true, passenger: true }
    });

    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });

    // Update booking with coordinates
    const updatedBooking = await prisma.booking.update({
      where: { id: Number(bookingId) },
      data: {
        pickupLat: Number(latitude),
        pickupLng: Number(longitude),
        locationSharedAt: new Date()
      }
    });

    // Notify driver that passenger shared location
    await prisma.notification.create({
      data: {
        userId: booking.trip.driverId,
        message: `📍 ${booking.passenger.fullName} shared their pickup location for route ${booking.trip.origin} ➔ ${booking.trip.destination}!`,
        type: 'location_shared'
      }
    });

    res.json({ success: true, updatedBooking });
  } catch (err) {
    console.error("Location Share Error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// Driver completes a trip (removes it from live feed and archives it)
router.patch('/:tripId/complete', async (req, res) => {
  try {
    const { tripId } = req.params;

    const completedTrip = await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({
        where: { id: Number(tripId) },
        include: { bookings: true }
      });

      if (!trip) throw new Error('Trip not found');

      // Update trip status to completed (removes from active explore feed)
      const updated = await tx.trip.update({
        where: { id: Number(tripId) },
        data: { status: 'completed' }
      });

      // Notify all confirmed passengers that the trip has concluded
      const confirmedBookings = trip.bookings.filter(b => b.status === 'confirmed');
      for (const booking of confirmedBookings) {
        await tx.notification.create({
          data: {
            userId: booking.passengerId,
            message: `🏁 Your trip from ${trip.origin} to ${trip.destination} has been completed by the driver. Thank you for riding with Guzo-Share!`,
            type: 'trip_completed'
          }
        });
      }

      return updated;
    });

    res.json({ success: true, completedTrip });
  } catch (err) {
    console.error("Complete Trip Error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;