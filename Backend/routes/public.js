const express = require('express');
const router = express.Router();
const ActionInProgress = require('../models/Action');
const User = require('../models/User');

// Get public overview of actions (limited data, no authentication required)
router.get('/actions/overview', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 50); // Max 50 actions
    
    // Get recent actions with limited data
    const actions = await ActionInProgress.find()
      .select('data.title data.category data.priority createdAt') // Only select safe fields
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Get basic stats
    const totalActions = await ActionInProgress.countDocuments();
    const currentYear = new Date().getFullYear();
    const currentYearActions = await ActionInProgress.countDocuments({
      createdAt: {
        $gte: new Date(currentYear, 0, 1),
        $lt: new Date(currentYear + 1, 0, 1)
      }
    });
    const activeUsers = await User.countDocuments({ isActive: true });

    // Transform actions to safe format
    const safeActions = actions.map(action => ({
      id: action._id,
      data: {
        title: action.data?.title || 'Untitled Action',
        category: action.data?.category || null,
        priority: action.data?.priority || null,
        // Don't include description or other sensitive data
      },
      createdAt: action.createdAt
    }));

    res.json({
      success: true,
      data: {
        actions: safeActions,
        stats: {
          totalActions,
          currentYearActions,
          activeUsers
        }
      }
    });

  } catch (error) {
    console.error('Public actions overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch actions overview'
    });
  }
});

// Get public system stats
router.get('/stats', async (req, res) => {
  try {
    const totalActions = await ActionInProgress.countDocuments();
    const currentYear = new Date().getFullYear();
    const currentYearActions = await ActionInProgress.countDocuments({
      createdAt: {
        $gte: new Date(currentYear, 0, 1),
        $lt: new Date(currentYear + 1, 0, 1)
      }
    });
    const activeUsers = await User.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        totalActions,
        currentYearActions,
        activeUsers
      }
    });

  } catch (error) {
    console.error('Public stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system stats'
    });
  }
});

module.exports = router;
