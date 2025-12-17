const Borrower = require('../models/borrower');
const { sanitizeString } = require('../helpers/sanitize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Service to handle borrower-related operations.
 */
class BorrowerService {
  /**
   * Register a new borrower.
   */
  static async register(data) {
    const { name, email, password } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const borrower = await Borrower.create({
      name: sanitizeString(name),
      email: sanitizeString(email),
      password: hashedPassword
    });

    return {
      id: borrower.id,
      name: borrower.name,
      email: borrower.email
    };
  }

  /**
   * Validate borrower credentials and login.
   */
  static async login(data) {
    const { email, password } = data;

    const borrower = await Borrower.findOne({ where: { email } });
    if (!borrower) throw new Error('Invalid credentials');

    const match = await bcrypt.compare(password, borrower.password);
    if (!match) throw new Error('Invalid credentials');

    const token = jwt.sign(
      { id: borrower.id, email: borrower.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return token;
  }

  /**
   * Update borrower details.
   */
  static async updateBorrower(id, data) {
    const borrower = await Borrower.findByPk(id);
    if (!borrower) throw new Error('Borrower not found');

    const { name, email } = data;

    await borrower.update({
      name: name ? sanitizeString(name) : borrower.name,
      email: email ? sanitizeString(email) : borrower.email
    });

    return borrower;
  }

  /**
   * Delete a borrower.
   */
  static async deleteBorrower(id) {
    const borrower = await Borrower.findByPk(id);
    if (!borrower) throw new Error('Borrower not found');

    await borrower.destroy();
    return { message: 'Borrower deleted successfully' };
  }

  /**
   * Get all borrowers.
   */
  static async getAllBorrowers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Borrower.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      borrowers: rows
    };
  }
}

module.exports = BorrowerService;
