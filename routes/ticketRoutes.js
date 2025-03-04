const express = require('express');
const router = express.Router();
const { createTicket, getTickets, updateTicketStatus } = require('../controllers/ticketController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/roleMiddleware');

// Routes
router.post('/', authMiddleware, createTicket);
router.get('/', authMiddleware, getTickets);
router.put('/:id', authMiddleware, adminMiddleware, updateTicketStatus);

module.exports = router;
