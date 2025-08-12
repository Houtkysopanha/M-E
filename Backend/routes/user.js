const express = require('express');
const router = express.Router();
const {
  createAction,
  getActions,
  getAction,
  updateAction,
  deleteAction,
  getActionStats
} = require('../controllers/userController');
const { getUserActionPlans } = require('../controllers/actionPlanController');
const { authenticateToken } = require('../MiddleWare/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// @route   POST /api/user/actions
// @desc    Create new action
// @access  Private (User)
router.post('/actions', createAction);

// @route   GET /api/user/actions
// @desc    Get all actions for current user
// @access  Private (User)
router.get('/actions', getActions);

// @route   GET /api/user/actions/stats
// @desc    Get action statistics for current user
// @access  Private (User)
router.get('/actions/stats', getActionStats);

// @route   GET /api/user/actions/:id
// @desc    Get single action
// @access  Private (User)
router.get('/actions/:id', getAction);

// @route   PUT /api/user/actions/:id
// @desc    Update action (only current year)
// @access  Private (User)
router.put('/actions/:id', updateAction);

// @route   DELETE /api/user/actions/:id
// @desc    Delete action (only current year)
// @access  Private (User)
router.delete('/actions/:id', deleteAction);

// @route   GET /api/user/action-plans
// @desc    Get action plans assigned to user
// @access  Private
router.get('/action-plans', getUserActionPlans);

module.exports = router;
