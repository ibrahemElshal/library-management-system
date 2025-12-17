const AdminService = require('../services/adminService');

/**
 * Create a new admin.
 */
exports.addAdmin = async (req, res) => {
  try {
    const admin = await AdminService.createAdmin(req.body);

    res.status(201).json({
      message: 'Admin created successfully',
      admin
    });

  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({
      message: err.message || 'Failed to create admin'
    });
  }
};

/**
 * Admin login.
 */
exports.login = async (req, res) => {
  try {
    const { token } = await AdminService.login(req.body);
    res.status(200).json({ token });

  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({
      message: err.message || 'Login failed'
    });
  }
};
