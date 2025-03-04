const express = require('express');
const Ticket = require('../models/Ticket');
const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/roleMiddleware');

// Ticket Controller (controllers/ticketController.js)
exports.createTicket = async (req, res) => {
    const { title, description } = req.body;
    try {
        const newTicket = await Ticket.create({
            title,
            description,
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
        const updatedTicket = await Ticket.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedTicket) return res.status(404).json({ error: 'Ticket not found' });
        res.json(updatedTicket);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};