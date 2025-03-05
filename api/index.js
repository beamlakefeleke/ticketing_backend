const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('../routes/authRoutes');
const ticketRoutes = require('../routes/ticketRoutes');
const userRoutes = require('../routes/userRoutes');
const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes); 

// MongoDB Connection
const MONGO_URI = 'mongodb+srv://bamlakefele:9fcb27@cluster0.uu1zk.mongodb.net/ticketing-system';
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});