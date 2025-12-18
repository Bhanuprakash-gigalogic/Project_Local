const mongoose = require('mongoose');


const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true
    },
    keywords: [{
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

// Enable fuzzy searching on 'question' and 'keywords'


module.exports = mongoose.model('Faq', faqSchema);
