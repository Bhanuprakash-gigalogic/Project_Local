const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sessionId: {
        type: String, // We reference the sessionId string, not the ObjectId for easier lookup/guest support
        required: true,
        index: true
    },
    sender: {
        type: String,
        enum: ['user', 'bot', 'agent'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'image', 'options'],
        default: 'text'
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
