const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Service to handle admin-related operations.
 */
class AdminService {

  /**
   * Create a new admin.
   */
  static async createAdmin({ username, email, password }) {
    if (!username || !email || !password) {
      throw { status: 400, message: 'All fields are required' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword
    });

    return {
      id: admin.id,
      username: admin.username,
      email: admin.email
    };
  }

  /**
   * Validate admin credentials and login.
   */
  static async login({ username, password }) {
    if (!username || !password) {
      throw { status: 400, message: 'Username and password are required' };
    }

    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { token };
  }
}

module.exports = AdminService;
