const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        required: true,
        unique: true,
        default: () => 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    },
    sessionId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        default: null
    },
    issueSummary: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'in_progress', 'resolved'],
        default: 'open'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Ticket', ticketSchema);
