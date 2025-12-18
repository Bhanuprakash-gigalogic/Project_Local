const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');

// Initialize App
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all for now, lock down in prod
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Database Connection
connectDB();

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Make io accessible in routes
app.set('socketio', io);

const chatRoutes = require('./routes/chatRoutes');
const intentRoutes = require('./routes/intentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const { optionalAuth } = require('./middlewares/authMiddleware');

// Mount Routes
app.use('/api/v1/chatbot/auth', authRoutes); // Auth Routes (Public)
app.use('/api/v1/chatbot', optionalAuth, chatRoutes); // Apply optional auth to chat
app.use('/api/v1/chatbot/intents', intentRoutes); // Intent routes (protected inside)
app.use('/api/v1/chatbot/admin', adminRoutes); // Admin routes (will need protect middleware later)

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('Chatbot Service API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: err.message || 'Server Error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    // Init Logic
    try {
        const Intent = require('./models/Intent');
        const User = require('./models/User');

        // Seed Default Intents
        const intentCount = await Intent.countDocuments();
        if (intentCount === 0) {
            console.log('Seeding default intents...');
            await Intent.create([
                {
                    name: "Track Order",
                    trainingPhrases: ["track my order", "where is my package", "order status", "shipping update", "track delivery"],
                    response: "To track your order, please provide your Order ID. You can find it in your confirmation email.",
                    tags: ["shipping", "order"]
                },
                {
                    name: "Return Policy",
                    trainingPhrases: ["return policy", "how do i return", "can i return items", "refund policy", "return window"],
                    response: "You can return items within 30 days of receipt. Please visit our Returns page to start the process.",
                    tags: ["shipping", "returns"]
                },
                {
                    name: "Payment Issue",
                    trainingPhrases: ["payment failed", "card declined", "cannot pay", "payment options", "charged twice"],
                    response: "If your payment failed, please check your card details or try a different payment method. Contact support for assistance.",
                    tags: ["payment", "support"]
                }
            ]);
            console.log('Default intents seeded!');
        }

        // Seed Admin User
        const userCount = await User.countDocuments();
        const adminEmail = "admin@example.com";
        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            console.log('Seeding admin user...');
            await User.create({
                name: "Admin User",
                email: adminEmail,
                password: "admin123", // Plain text per authController simplicity
                role: "admin"
            });
            console.log('Admin user seeded (admin@example.com / admin123)');
        }

    } catch (err) {
        console.error('Seeding error:', err);
    }
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
