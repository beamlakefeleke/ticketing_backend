const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Environment Variables
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// Auth Controller (controllers/authController.js)
exports.signup = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword, role });
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
        res.json({ token, role: user.role });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// List all users (only accessible to Admin users)
exports.listUsers = async (req, res) => {
    try {
        // Check if the logged-in user is an admin
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ error: 'Access denied, Admin only' });
        }

        // Fetch all users from the database
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a user (only accessible to Admin users)
exports.updateUser = async (req, res) => {
    try {
        // Check if the logged-in user is an admin
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ error: 'Access denied, Admin only' });
        }

        const { userId } = req.params;
        const { username, role } = req.body;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the user information
        user.username = username || user.username;
        user.role = role || user.role;

        await user.save();
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a user (only accessible to Admin users)
exports.deleteUser = async (req, res) => {
    try {
        // Check if the logged-in user is an admin
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ error: 'Access denied, Admin only' });
        }

        const { userId } = req.params;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete the user
        await user.deleteOne();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};