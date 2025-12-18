const Session = require('../models/Session');
const Message = require('../models/Message');
const botService = require('../services/botService');
const { v4: uuidv4 } = require('uuid');

// @desc    Initialize a new session
// @route   POST /api/v1/chatbot/sessions
// @access  Public (Guest) or Protected (User)
exports.createSession = async (req, res, next) => {
    try {
        const { userId } = req.body; // Optional: provided if authenticated

        const session = await Session.create({
            sessionId: uuidv4(),
            userId: userId || null,
            status: 'active'
        });

        res.status(201).json({
            success: true,
            data: session
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Send a message
// @route   POST /api/v1/chatbot/sessions/:sessionId/messages
// @access  Public
exports.sendMessage = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const { content } = req.body;

        // 1. Validate Session
        const session = await Session.findOne({ sessionId });
        if (!session) {
            return res.status(404).json({ success: false, error: 'Session not found' });
        }

        // 2. Save User Message
        const userMessage = await Message.create({
            sessionId,
            sender: 'user',
            content
        });

        // 3. Emit User Message via Socket (to other potential listeners, e.g. agent dashboard)
        const io = req.app.get('socketio');
        io.emit('message_received', userMessage);

        // 4. Process for Bot Response
        const botResponse = await botService.processMessage(sessionId, content);

        // 5. Emit Bot Response
        io.emit('message_received', botResponse);

        // 6. Update Session Activity
        session.lastActivity = Date.now();
        await session.save();

        res.status(200).json({
            success: true,
            data: {
                userMessage,
                botResponse
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get session messages
// @route   GET /api/v1/chatbot/sessions/:sessionId/messages
// @access  Public
exports.getMessages = async (req, res, next) => {
    try {
        const { sessionId } = req.params;

        const messages = await Message.find({ sessionId }).sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        next(error);
    }
};
