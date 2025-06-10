const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/adminController');
const {
  createActionPlan,
  getAllActionPlans,
  updateActionPlan,
  deleteActionPlan,
  getActionPlan
} = require('../controllers/actionPlanController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Apply authentication and admin middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// @route   POST /api/admin/users
// @desc    Create new user
// @access  Admin only
router.post('/users', createUser);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin only
router.get('/users', getAllUsers);

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Admin only
router.put('/users/:id', updateUser);

// @route   DELETE /api/admin/users/:id
// @desc    Delete/Deactivate user
// @access  Admin only
router.delete('/users/:id', deleteUser);

// @route   GET /api/admin/stats
// @desc    Get user and system statistics
// @access  Admin only
router.get('/stats', getUserStats);

// Action Plan Routes

// @route   POST /api/admin/action-plans
// @desc    Create new action plan
// @access  Admin only
router.post('/action-plans', createActionPlan);

// @route   GET /api/admin/action-plans
// @desc    Get all action plans
// @access  Admin only
router.get('/action-plans', getAllActionPlans);

// @route   GET /api/admin/action-plans/:id
// @desc    Get specific action plan
// @access  Admin only
router.get('/action-plans/:id', getActionPlan);

// @route   PUT /api/admin/action-plans/:id
// @desc    Update action plan
// @access  Admin only
router.put('/action-plans/:id', updateActionPlan);

// @route   DELETE /api/admin/action-plans/:id
// @desc    Delete action plan
// @access  Admin only
router.delete('/action-plans/:id', deleteActionPlan);

module.exports = router;
