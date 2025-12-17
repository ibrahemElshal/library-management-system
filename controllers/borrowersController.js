const BorrowerService = require('../services/borrowerService');


/**
 * Register a new borrower.
 */
exports.register = async (req, res) => {
  try {


    const borrower = await BorrowerService.register(req.body);
    res.status(201).json({
      message: 'Borrower registered successfully',
      borrower: {
        id: borrower.id,
        name: borrower.name,
        email: borrower.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

/**
 * Login a borrower.
 */
exports.login = async (req, res) => {
  try {
    const token = await BorrowerService.login(req.body);
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: err.message });
  }
};

/**
 * Update borrower details.
 */
exports.updateBorrower = async (req, res) => {
  try {


    const borrower = await BorrowerService.updateBorrower(req.params.id, req.body);
    res.json(borrower);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

/**
 * Delete a borrower.
 */
exports.deleteBorrower = async (req, res) => {
  try {
    const result = await BorrowerService.deleteBorrower(req.params.id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

/**
 * Get all borrowers with pagination.
 */
exports.getAllBorrowers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await BorrowerService.getAllBorrowers(page, limit);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
