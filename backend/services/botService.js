const stringSimilarity = require('string-similarity');
const Faq = require('../models/Faq');
const Intent = require('../models/Intent');
const Message = require('../models/Message');

/**
 * Process a user message and generate a response.
 * @param {string} sessionId
 * @param {string} content - The user's message.
 * @returns {Promise<Object>} The bot's response message object.
 */
const processMessage = async (sessionId, content) => {
    try {
        // 1. Fetch all active Intents & FAQs
        // In production, use optimized search (e.g., Atlas Search).
        const [intents, faqs] = await Promise.all([
            Intent.find({ isActive: true }),
            Faq.find({ isActive: true })
        ]);

        let bestMatch = null;
        let maxScore = 0;
        let matchType = 'none';

        // 2. Check Intents first (Priority)
        if (intents.length > 0) {
            // Flatten training phrases to search against
            // We need to keep track of which intent the phrase belongs to
            let allPhrases = [];
            let phraseMap = {}; // phrase -> intent

            intents.forEach(intent => {
                intent.trainingPhrases.forEach(phrase => {
                    allPhrases.push(phrase);
                    phraseMap[phrase] = intent;
                });
            });

            if (allPhrases.length > 0) {
                const intentMatches = stringSimilarity.findBestMatch(content, allPhrases);
                if (intentMatches.bestMatch.rating > maxScore) {
                    bestMatch = phraseMap[intentMatches.bestMatch.target];
                    maxScore = intentMatches.bestMatch.rating;
                    matchType = 'intent';
                }
            }
        }

        // 3. Check FAQs if Intent match is weak (or just to find better match if we want global max)
        // Requirement said: Priority: Intent match > FAQ match.
        // But we should probably check if Intent match is good enough.
        // Let's use the same threshold for both or check if FAQ is significantly better?
        // For simplicity & priority: If Intent match > THRESHOLD, use it. Else check FAQ.

        const THRESHOLD = 0.6;
        let responseContent = '';
        let responseType = 'text';

        if (maxScore > THRESHOLD && matchType === 'intent') {
            responseContent = bestMatch.response;
        } else {
            // Fallback to FAQ search
            if (faqs.length > 0) {
                const questions = faqs.map(f => f.question);
                const faqMatches = stringSimilarity.findBestMatch(content, questions);

                // If FAQ match is better than current maxScore (which is < threshold or 0 from intent)
                if (faqMatches.bestMatch.rating > maxScore && faqMatches.bestMatch.rating > THRESHOLD) {
                    const matchedFaq = faqs.find(f => f.question === faqMatches.bestMatch.target);
                    responseContent = matchedFaq ? matchedFaq.answer : "I'm sorry, I found a match but lost the answer.";
                    maxScore = faqMatches.bestMatch.rating;
                    matchType = 'faq';
                }
            }
        }

        if (maxScore <= THRESHOLD) {
            responseContent = "I'm not sure how to help with that. Would you like to create a support ticket?";
            responseType = 'options';
        }

        // Create Bot Message
        const botMessage = await Message.create({
            sessionId,
            sender: 'bot',
            content: responseContent,
            type: responseType,
            metadata: {
                confidence: maxScore,
                matchedQuestion: maxScore > THRESHOLD ? bestMatch.target : null
            }
        });

        return botMessage;

    } catch (error) {
        console.error('Bot Logic Error:', error);
        throw error;
    }
};

module.exports = { processMessage };
