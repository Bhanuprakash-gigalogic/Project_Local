const mongoose = require('mongoose');

const intentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add an intent name'],
        unique: true,
        trim: true
    },
    trainingPhrases: {
        type: [String],
        required: [true, 'Please add at least one training phrase']
    },
    response: {
        type: String,
        required: [true, 'Please add a response']
    },
    tags: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Intent', intentSchema);
