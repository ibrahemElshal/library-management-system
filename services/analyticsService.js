const Borrow = require('../models/borrow');
const Book = require('../models/book');
const Borrower = require('../models/borrower');
const { Op } = require('sequelize');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const { sanitizeCSVValue } = require('../helpers/snaitizecsv');
const { parseDate } = require('../helpers/parseDate');

const mapBorrow = (b) => ({
  borrow_id: b.id,
  borrower_name: sanitizeCSVValue(b.Borrower.name),
  borrower_email: sanitizeCSVValue(b.Borrower.email),
  book_title: sanitizeCSVValue(b.Book.title),
  book_isbn: sanitizeCSVValue(b.Book.isbn),
  borrow_date: b.borrow_date,
  due_date: b.due_date,
  return_date: b.return_date
});

/**
 * Service to handle export of borrow data.
 */
class BorrowExportService {

  /**
   * Get the date range for the previous month.
   */
  static getLastMonthRange() {
    const now = new Date();
    return {
      start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      end: new Date(now.getFullYear(), now.getMonth(), 0)
    };
  }

  /**
   * Find borrow records between two dates.
   */
  static async getBorrowsBetween(start, end, extraWhere = {}) {
    return Borrow.findAll({
      where: {
        borrow_date: { [Op.between]: [start, end] },
      },
      include: [Book, Borrower]
    });
  }

  /**
   * Parse and validate start and end dates.
   */
  static parseAndValidateDates(startDate, endDate) {
    if (!startDate || !endDate)
      throw { status: 400, message: 'startDate and endDate are required' };

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (start > end)
      throw { status: 400, message: 'startDate must be before endDate' };

    return { start, end };
  }

  // -------- CSV --------
  /**
   * Generate CSV from borrow records.
   */
  static generateCSV(borrows, filename) {
    if (!borrows.length)
      throw { status: 404, message: 'No records found' };

    const parser = new Parser();
    const csv = parser.parse(borrows.map(mapBorrow));

    return { csv, filename };
  }

  // -------- XLSX --------
  /**
   * Generate Excel workbook from borrow records.
   */
  static async generateXLSX(borrows) {
    if (!borrows.length)
      throw { status: 404, message: 'No records found' };

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Borrows');

    sheet.columns = [
      { header: 'Borrow ID', key: 'borrow_id', width: 10 },
      { header: 'Borrower Name', key: 'borrower_name', width: 25 },
      { header: 'Borrower Email', key: 'borrower_email', width: 30 },
      { header: 'Book Title', key: 'book_title', width: 30 },
      { header: 'Book ISBN', key: 'book_isbn', width: 20 },
      { header: 'Borrow Date', key: 'borrow_date', width: 20 },
      { header: 'Due Date', key: 'due_date', width: 20 },
      { header: 'Return Date', key: 'return_date', width: 20 }
    ];

    borrows.map(mapBorrow).forEach(row => sheet.addRow(row));

    return workbook;
  }

  // -------- Use cases --------
  /**
   * Export borrows between dates as CSV.
   */
  static async exportBetweenDatesCSV(startDate, endDate) {
    const { start, end } = this.parseAndValidateDates(startDate, endDate);
    const borrows = await this.getBorrowsBetween(start, end);
    return this.generateCSV(borrows, `borrows_${startDate}_${endDate}.csv`);
  }

  /**
   * Export borrows between dates as XLSX.
   */
  static async exportBetweenDatesXLSX(startDate, endDate) {
    const { start, end } = this.parseAndValidateDates(startDate, endDate);
    const borrows = await this.getBorrowsBetween(start, end);
    return this.generateXLSX(borrows);
  }

  /**
   * Export overdue books from last month as CSV.
   */
  static async exportOverdueLastMonth() {
    const { start, end } = this.getLastMonthRange();
    const borrows = await Borrow.findAll({
      where: {
        return_date: null,
        due_date: { [Op.between]: [start, end] }
      },
      include: [Book, Borrower]
    });
    return this.generateCSV(borrows, 'overdue_last_month.csv');
  }

  /**
   * Export all borrows from last month as CSV.
   */
  static async exportBorrowsLastMonth() {
    const { start, end } = this.getLastMonthRange();
    const borrows = await this.getBorrowsBetween(start, end);
    return this.generateCSV(borrows, 'borrows_last_month.csv');
  }
}

module.exports = BorrowExportService;
