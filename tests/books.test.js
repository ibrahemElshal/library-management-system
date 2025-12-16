const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const Book = require('../models/book');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Books API', () => {
  
  let bookId;

  test('POST /api/books - should create a new book', async () => {
    const res = await request(app)
      .post('/api/books')
      .send({
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '9780132350884',
        quantity: 10,
        shelf_location: 'A1'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Clean Code');

    bookId = res.body.id; 
  });

  test('GET /api/books - should return all books', async () => {
    const res = await request(app).get('/api/books');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('PUT /api/books/:id - should update a book', async () => {
    const res = await request(app)
      .put(`/api/books/${bookId}`)
      .send({
        quantity: 15
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(15);
  });

  test('DELETE /api/books/:id - should delete a book', async () => {
    const res = await request(app)
      .delete(`/api/books/${bookId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

});
