const express = require('express');
const router = express.Router();
const { getDashboardStats, getUsers } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/adminMiddleware');

// Apply protection and RBAC to all routes in this file
router.use(protect);
router.use(authorizeRoles('admin', 'superadmin', 'moderator'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);

module.exports = router;
