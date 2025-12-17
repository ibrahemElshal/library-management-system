const request = require('supertest');
const sequelize = require('../config/database');
const Book = require('../models/book');
const Borrower = require('../models/borrower');
const Borrow = require('../models/borrow');
const app = require('../app');

jest.mock('../middlewares/adminAuth', () => {
    return (req, res, next) => {
        req.admin = { id: 1, username: 'testadmin' };
        next();
    };
});

jest.mock('../middlewares/borrowerAuth', () => {
    return (req, res, next) => {
        req.borrower = { id: 1, name: 'testborrower' };
        next();
    };
});

jest.mock('../middlewares/rateLimiter', () => {
    return () => (req, res, next) => next();
});

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Borrow API', () => {
    let bookId;
    let borrowerId;

    const createTestData = async () => {
        const book = await Book.create({
            title: 'Test Book',
            author: 'Test Author',
            isbn: '1234567890',
            quantity: 5,
            shelf_location: 'A1'
        });
        bookId = book.id;

        const borrower = await Borrower.create({
            name: 'Test Borrower',
            email: 'test@example.com',
            password: 'password123'
        });
        borrowerId = borrower.id;
    };

    beforeEach(async () => {
        await Borrow.destroy({ where: {} });
        await Book.destroy({ where: {} });
        await Borrower.destroy({ where: {} });
        await createTestData();
    });

    describe('GET /api/borrows/borrowed/:borrower_id', () => {
        test('should return borrowed books for a specific borrower', async () => {
            // Create a borrow record
            await Borrow.create({
                book_id: bookId,
                borrower_id: borrowerId,
                due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                borrow_date: new Date()
            });

            const res = await request(app)
                .get(`/api/borrows/borrowed/${borrowerId}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.borrows)).toBeTruthy();
            expect(res.body.borrows.length).toBe(1);
            expect(res.body.borrows[0].book_id).toBe(bookId);
            expect(res.body.borrows[0].borrower_id).toBe(borrowerId);
            expect(res.body.borrows[0]).toHaveProperty('Book');
        });

        test('should return empty list if borrower has no borrowed books', async () => {
            const res = await request(app)
                .get(`/api/borrows/borrowed/${borrowerId}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.borrows)).toBeTruthy();
            expect(res.body.borrows.length).toBe(0);
        });
    });

    describe('GET /api/borrows/overdue', () => {
        test('should return overdue books', async () => {
            // Create an overdue borrow record
            await Borrow.create({
                book_id: bookId,
                borrower_id: borrowerId,
                due_date: new Date(Date.now() - 24 * 60 * 60 * 1000),
                borrow_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            });

            const res = await request(app)
                .get('/api/borrows/overdue');

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBeGreaterThan(0);

            const returnedBorrow = res.body[0];
            const dueDate = new Date(returnedBorrow.due_date);
            expect(dueDate < new Date()).toBeTruthy();
        });

        test('should not return non-overdue books', async () => {
            // Create a future borrow record
            await Borrow.create({
                book_id: bookId,
                borrower_id: borrowerId,
                due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                borrow_date: new Date()
            });

            const res = await request(app)
                .get('/api/borrows/overdue');

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBe(0);
        });
    });
});
