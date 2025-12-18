const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String, // Optional, for authenticated users
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'escalated', 'closed'],
        default: 'active'
    },
    lastActivity: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // adds createdAt and updatedAt
});

module.exports = mongoose.model('Session', sessionSchema);
