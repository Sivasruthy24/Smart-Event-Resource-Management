import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// 1. Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// 2. Middleware
app.use(cors());
app.use(express.json()); 

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// 4. Schemas & Models
// Added { strict: false } to prevent "Failed to add" if keys don't match exactly
const resourceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: String,
    image: String,
    status: { type: String, default: 'Available' },
    quantity: { type: Number, default: 1 }
}, { strict: false });

const bookingSchema = new mongoose.Schema({
    studentId: String,
    studentName: String,
    resourceName: String,
    date: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' }
}, { strict: false });

const Resource = mongoose.model('Resource', resourceSchema);
const Booking = mongoose.model('Booking', bookingSchema);

// 5. API Routes

// --- RESOURCE ROUTES ---

// GET: Fetch all resources
app.get('/api/resources', async (req, res) => {
    try {
        const resources = await Resource.find();
        res.json(resources);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch resources' });
    }
});

// POST: Add a new resource
app.post('/api/resources', async (req, res) => {
    console.log('RECEIVED DATA:', req.body);
    try {
        const newResource = new Resource(req.body);
        await newResource.save();
        res.status(201).json({ message: 'Resource added successfully!', resource: newResource });
    } catch (error) {
        console.error("POST /api/resources Error:", error);
        res.status(500).json({ error: 'Failed to add resource', details: error.message });
    }
});

// DELETE: Remove a resource
app.delete('/api/resources/:id', async (req, res) => {
    try {
        await Resource.findByIdAndDelete(req.params.id);
        res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete resource' });
    }
});

// PUT: Update a resource
app.put('/api/resources/:id', async (req, res) => {
    try {
        const updatedResource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedResource);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update resource' });
    }
});

// --- BOOKING ROUTES ---

// POST: Create a new booking
app.post('/api/bookings', async (req, res) => {
    try {
        const resource = await Resource.findOne({ name: req.body.resourceName });
        if (resource && resource.category === 'Venue') {
            const existing = await Booking.findOne({ resourceName: req.body.resourceName, eventDate: req.body.eventDate });
            if (existing) {
                return res.status(400).json({ error: 'Already booked for this date' });
            }
        }
        const newBooking = new Booking(req.body);
        await newBooking.save();
        console.log("Saved Booking with eventDate:", newBooking.eventDate);
        res.status(201).json({ message: 'Booking request sent!', booking: newBooking });
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ error: 'Booking failed' });
    }
});

// GET: Fetch all bookings (Admin Dashboard)
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// PATCH: Update booking status (Approve/Reject)
app.patch('/api/bookings/:id', async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status }, 
            { new: true }
        );
        res.json(updatedBooking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update booking status' });
    }
});

// 6. Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});