const express = require('express');
const router = express.Router();
const { listUsers, updateUser, deleteUser } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware'); // Import the middleware
const { adminMiddleware } = require('../middleware/roleMiddleware');


// List all users - Admin only
router.get('/', authMiddleware, adminMiddleware, listUsers);

// Update a user - Admin only
router.put('/:userId', authMiddleware, adminMiddleware,updateUser);

// Delete a user - Admin only
router.delete('/:userId', authMiddleware, adminMiddleware, deleteUser);

module.exports = router;
