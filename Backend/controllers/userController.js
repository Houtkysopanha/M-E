const Action = require('../models/Action');
const { canModifyAction, getTimeErrorMessage, getCurrentYear } = require('../utils/timeValidation');

// Create new action
const createAction = async (req, res) => {
  try {
    const { data } = req.body;

    // Validate input
    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'Action data is required'
      });
    }

    // Create new action
    const newAction = new Action({
      userId: req.user._id,
      data: data
    });

    await newAction.save();

    res.status(201).json({
      success: true,
      message: 'Action created successfully',
      data: {
        action: {
          id: newAction._id,
          data: newAction.data,
          createdAt: newAction.createdAt,
          updatedAt: newAction.updatedAt,
          creationYear: newAction.creationYear,
          canModify: newAction.canModify()
        }
      }
    });

  } catch (error) {
    console.error('Create action error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all actions for the current user
const getActions = async (req, res) => {
  try {
    const { year, page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    let query = { userId };
    
    // Filter by year if specified
    if (year) {
      const yearNum = parseInt(year);
      if (isNaN(yearNum)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid year format'
        });
      }
      
      const startOfYear = new Date(yearNum, 0, 1);
      const endOfYear = new Date(yearNum + 1, 0, 1);
      
      query.createdAt = {
        $gte: startOfYear,
        $lt: endOfYear
      };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Get actions with pagination
    const actions = await Action.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalActions = await Action.countDocuments(query);
    const totalPages = Math.ceil(totalActions / limitNum);

    // Format actions with additional info
    const formattedActions = actions.map(action => ({
      id: action._id,
      data: action.data,
      createdAt: action.createdAt,
      updatedAt: action.updatedAt,
      creationYear: action.creationYear,
      canModify: action.canModify()
    }));

    res.json({
      success: true,
      data: {
        actions: formattedActions,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalActions,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        },
        filter: {
          year: year ? parseInt(year) : null,
          currentYear: getCurrentYear()
        }
      }
    });

  } catch (error) {
    console.error('Get actions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get single action
const getAction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const action = await Action.findOne({ _id: id, userId });

    if (!action) {
      return res.status(404).json({
        success: false,
        message: 'Action not found'
      });
    }

    res.json({
      success: true,
      data: {
        action: {
          id: action._id,
          data: action.data,
          createdAt: action.createdAt,
          updatedAt: action.updatedAt,
          creationYear: action.creationYear,
          canModify: action.canModify()
        }
      }
    });

  } catch (error) {
    console.error('Get action error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update action (only if created in current year)
const updateAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'Action data is required'
      });
    }

    // Find action
    const action = await Action.findOne({ _id: id, userId });

    if (!action) {
      return res.status(404).json({
        success: false,
        message: 'Action not found'
      });
    }

    // Check if action can be modified (time-based restriction)
    if (!canModifyAction(action.createdAt)) {
      return res.status(403).json({
        success: false,
        message: getTimeErrorMessage('update', action.createdAt)
      });
    }

    // Update action
    action.data = data;
    action.updatedAt = new Date();
    await action.save();

    res.json({
      success: true,
      message: 'Action updated successfully',
      data: {
        action: {
          id: action._id,
          data: action.data,
          createdAt: action.createdAt,
          updatedAt: action.updatedAt,
          creationYear: action.creationYear,
          canModify: action.canModify()
        }
      }
    });

  } catch (error) {
    console.error('Update action error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete action (only if created in current year)
const deleteAction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find action
    const action = await Action.findOne({ _id: id, userId });

    if (!action) {
      return res.status(404).json({
        success: false,
        message: 'Action not found'
      });
    }

    // Check if action can be modified (time-based restriction)
    if (!canModifyAction(action.createdAt)) {
      return res.status(403).json({
        success: false,
        message: getTimeErrorMessage('delete', action.createdAt)
      });
    }

    // Delete action
    await Action.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Action deleted successfully'
    });

  } catch (error) {
    console.error('Delete action error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user's action statistics
const getActionStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentYear = getCurrentYear();

    // Total actions
    const totalActions = await Action.countDocuments({ userId });

    // Current year actions
    const currentYearActions = await Action.countDocuments({
      userId,
      createdAt: {
        $gte: new Date(currentYear, 0, 1),
        $lt: new Date(currentYear + 1, 0, 1)
      }
    });

    // Actions by year
    const actionsByYear = await Action.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { $year: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        total: totalActions,
        currentYear: currentYearActions,
        previousYears: totalActions - currentYearActions,
        byYear: actionsByYear.map(item => ({
          year: item._id,
          count: item.count,
          canModify: item._id === currentYear
        })),
        currentYearInfo: {
          year: currentYear,
          canCreate: true,
          canModify: true
        }
      }
    });

  } catch (error) {
    console.error('Get action stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createAction,
  getActions,
  getAction,
  updateAction,
  deleteAction,
  getActionStats
};
