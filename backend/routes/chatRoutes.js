const express = require('express');
const router = express.router ? express.Router() : require('express').Router(); // Safe import
const { createSession, sendMessage, getMessages } = require('../controllers/chatController');

router.post('/sessions', createSession);
router.post('/sessions/:sessionId/messages', sendMessage);
router.get('/sessions/:sessionId/messages', getMessages);

module.exports = router;
