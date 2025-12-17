const BorrowExportService = require('../services/analyticsService');

/**
 * Export borrows between dates as CSV.
 */
exports.exportBorrowDataCSV = async (req, res) => {
  try {
    const { csv, filename } =
      await BorrowExportService.exportBetweenDatesCSV(
        req.query.startDate,
        req.query.endDate
      );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(csv);

  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

/**
 * Export borrows between dates as XLSX.
 */
exports.exportBorrowDataXLSX = async (req, res) => {
  try {
    const workbook =
      await BorrowExportService.exportBetweenDatesXLSX(
        req.query.startDate,
        req.query.endDate
      );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=borrows.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

/**
 * Export overdue books from last month.
 */
exports.exportOverdueLastMonth = async (req, res) => {
  try {
    const { csv, filename } =
      await BorrowExportService.exportOverdueLastMonth();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(csv);

  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

/**
 * Export all borrows from last month.
 */
exports.exportBorrowsLastMonth = async (req, res) => {
  try {
    const { csv, filename } =
      await BorrowExportService.exportBorrowsLastMonth();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(csv);

  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};
