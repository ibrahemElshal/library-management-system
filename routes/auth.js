// fake login to complete the auth part (beacause there is no user with password )
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

router.post('/login', (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: 'Username is required' });

    const token = jwt.sign(
        { role: 'admin', name: username },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({ token });
});

module.exports = router;
