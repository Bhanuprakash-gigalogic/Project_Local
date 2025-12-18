const mongoose = require('mongoose');
const { processMessage } = require('../services/botService');
const Faq = require('../models/Faq');
const Message = require('../models/Message');

// Mock Mongoose models
jest.mock('../models/Faq');
jest.mock('../models/Message');

describe('Bot Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a matched FAQ answer if similarity > 0.6', async () => {
        const mockFaqs = [
            { question: 'How do I return an item?', answer: 'Go to "My Orders" and click Return.' }
        ];
        // Mock Faq.find to return our mock FAQs
        Faq.find.mockResolvedValue(mockFaqs);

        // Mock Message.create
        Message.create.mockResolvedValue({
            content: 'Go to "My Orders" and click Return.',
            sender: 'bot',
            type: 'text'
        });

        const result = await processMessage('session-123', 'How can i return items?'); // Similar string

        expect(Faq.find).toHaveBeenCalledWith({ isActive: true });
        expect(Message.create).toHaveBeenCalledWith(expect.objectContaining({
            content: 'Go to "My Orders" and click Return.',
            sender: 'bot'
        }));
        expect(result.content).toBe('Go to "My Orders" and click Return.');
    });

    it('should return default fallback if similarity < 0.6', async () => {
        const mockFaqs = [
            { question: 'How do I return an item?', answer: 'Go to "My Orders" and click Return.' }
        ];
        Faq.find.mockResolvedValue(mockFaqs);

        Message.create.mockResolvedValue({
            content: "I'm not sure how to help with that. Would you like to create a support ticket?",
            sender: 'bot',
            type: 'options'
        });

        const result = await processMessage('session-123', 'What is the capital of France?'); // Irrelevant

        expect(result.content).toContain('support ticket');
        expect(result.type).toBe('options');
    });
});
