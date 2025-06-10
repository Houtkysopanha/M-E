const ActionPlan = require('../models/ActionPlan');
const User = require('../models/User');

// Create new action plan (Admin only)
const createActionPlan = async (req, res) => {
  try {
    const { title, description, userIds } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    // Validate user IDs if provided
    if (userIds && userIds.length > 0) {
      const validUsers = await User.find({ 
        _id: { $in: userIds }, 
        isActive: true 
      });
      
      if (validUsers.length !== userIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more user IDs are invalid or inactive'
        });
      }
    }

    // Create action plan
    const actionPlan = new ActionPlan({
      title,
      description,
      userIds: userIds || [],
      createdBy: req.user.userId
    });

    await actionPlan.save();

    // Populate the created action plan
    await actionPlan.populate('userIds', 'username role');
    await actionPlan.populate('createdBy', 'username');

    res.status(201).json({
      success: true,
      message: 'Action plan created successfully',
      data: {
        actionPlan
      }
    });

  } catch (error) {
    console.error('Create action plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create action plan'
    });
  }
};

// Get all action plans (Admin only)
const getAllActionPlans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const actionPlans = await ActionPlan.find()
      .populate('userIds', 'username role')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalActionPlans = await ActionPlan.countDocuments();
    const totalPages = Math.ceil(totalActionPlans / limit);

    res.json({
      success: true,
      data: {
        actionPlans,
        pagination: {
          currentPage: page,
          totalPages,
          totalActionPlans,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get action plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve action plans'
    });
  }
};

// Get action plans for a specific user
const getUserActionPlans = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const actionPlans = await ActionPlan.find({
      userIds: userId
    })
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        actionPlans
      }
    });

  } catch (error) {
    console.error('Get user action plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve action plans'
    });
  }
};

// Update action plan (Admin only)
const updateActionPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, userIds } = req.body;

    const actionPlan = await ActionPlan.findById(id);
    if (!actionPlan) {
      return res.status(404).json({
        success: false,
        message: 'Action plan not found'
      });
    }

    // Validate user IDs if provided
    if (userIds && userIds.length > 0) {
      const validUsers = await User.find({ 
        _id: { $in: userIds }, 
        isActive: true 
      });
      
      if (validUsers.length !== userIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more user IDs are invalid or inactive'
        });
      }
    }

    // Update fields
    if (title) actionPlan.title = title;
    if (description) actionPlan.description = description;
    if (userIds !== undefined) actionPlan.userIds = userIds;

    await actionPlan.save();

    // Populate the updated action plan
    await actionPlan.populate('userIds', 'username role');
    await actionPlan.populate('createdBy', 'username');

    res.json({
      success: true,
      message: 'Action plan updated successfully',
      data: {
        actionPlan
      }
    });

  } catch (error) {
    console.error('Update action plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update action plan'
    });
  }
};

// Delete action plan (Admin only)
const deleteActionPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const actionPlan = await ActionPlan.findById(id);
    if (!actionPlan) {
      return res.status(404).json({
        success: false,
        message: 'Action plan not found'
      });
    }

    await ActionPlan.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Action plan deleted successfully'
    });

  } catch (error) {
    console.error('Delete action plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete action plan'
    });
  }
};

// Get specific action plan by ID
const getActionPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const actionPlan = await ActionPlan.findById(id)
      .populate('userIds', 'username role')
      .populate('createdBy', 'username');

    if (!actionPlan) {
      return res.status(404).json({
        success: false,
        message: 'Action plan not found'
      });
    }

    res.json({
      success: true,
      data: {
        actionPlan
      }
    });

  } catch (error) {
    console.error('Get action plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve action plan'
    });
  }
};

module.exports = {
  createActionPlan,
  getAllActionPlans,
  getUserActionPlans,
  updateActionPlan,
  deleteActionPlan,
  getActionPlan
};
