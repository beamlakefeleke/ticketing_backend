
const Ticket = require('../models/Ticket');


// Ticket Controller (controllers/ticketController.js)
exports.createTicket = async (req, res) => {
    const { title, description } = req.body;
    try {
        const newTicket = await Ticket.create({
            title,
            description,
            status: 'Open',
            user: req.user.id
        });
        res.status(201).json(newTicket);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTickets = async (req, res) => {
    try {
        const tickets = req.user.role === 'Admin' 
            ? await Ticket.find().populate('user', 'username')
            : await Ticket.find({ user: req.user.id });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTicketStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const ticket = await Ticket.findById(id);
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

        // Check if user is authorized to update the ticket
        if (ticket.user.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ error: 'Not authorized to update this ticket' });
        }

        ticket.status = status;
        await ticket.save();

        res.json(ticket);
    } catch (error) {
        res.status(500).json({ error: 'Server error while updating ticket' });
    }
};