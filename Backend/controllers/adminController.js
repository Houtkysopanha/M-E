const User = require('../models/User');
const Action = require('../models/Action');

// Create new user (Admin only)
const createUser = async (req, res) => {
  try {
    const { username, password, role = 'user' } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check user limit (30 users max)
    const userCount = await User.countActiveUsers();
    if (userCount >= 30) {
      return res.status(400).json({
        success: false,
        message: 'Maximum user limit (30) reached'
      });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ 
      username: username.toLowerCase().trim() 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Create new user
    const newUser = new User({
      username: username.toLowerCase().trim(),
      password,
      role: role === 'admin' ? 'admin' : 'user'
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: newUser._id,
          username: newUser.username,
          role: newUser.role,
          isActive: newUser.isActive,
          createdAt: newUser.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Create user error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        users: users.map(user => ({
          id: user._id,
          username: user.username,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        })),
        totalUsers: users.length,
        activeUsers: users.filter(user => user.isActive).length
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user (Admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role, isActive } = req.body;

    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString() && isActive === false) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }

    // Update fields if provided
    if (username) {
      const existingUser = await User.findOne({ 
        username: username.toLowerCase().trim(),
        _id: { $ne: id }
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists'
        });
      }
      
      user.username = username.toLowerCase().trim();
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
      }
      user.password = password;
    }

    if (role) {
      user.role = role === 'admin' ? 'admin' : 'user';
    }

    if (typeof isActive === 'boolean') {
      user.isActive = isActive;
    }

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete/Deactivate user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent = false } = req.query;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    if (permanent === 'true') {
      // Permanent deletion - also delete all user's actions
      await Action.deleteMany({ userId: id });
      await User.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'User and all associated data permanently deleted'
      });
    } else {
      // Soft delete - just deactivate
      user.isActive = false;
      await user.save();

      res.json({
        success: true,
        message: 'User deactivated successfully'
      });
    }

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user statistics (Admin only)
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countActiveUsers();
    const adminUsers = await User.countDocuments({ role: 'admin', isActive: true });
    const totalActions = await Action.countDocuments();

    // Get actions by year
    const currentYear = new Date().getFullYear();
    const currentYearActions = await Action.countDocuments({
      createdAt: {
        $gte: new Date(currentYear, 0, 1),
        $lt: new Date(currentYear + 1, 0, 1)
      }
    });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers,
          admins: adminUsers,
          regular: activeUsers - adminUsers
        },
        actions: {
          total: totalActions,
          currentYear: currentYearActions,
          previousYears: totalActions - currentYearActions
        },
        limits: {
          maxUsers: 30,
          remainingSlots: Math.max(0, 30 - activeUsers)
        }
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserStats
};
