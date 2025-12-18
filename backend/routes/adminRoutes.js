const express = require('express');
const router = express.Router();
const Faq = require('../models/Faq');
const Ticket = require('../models/Ticket');

// FAQ CRUD

// @desc Create FAQ
router.post('/faqs', async (req, res, next) => {
    try {
        const faq = await Faq.create(req.body);
        res.status(201).json({ success: true, data: faq });
    } catch (error) {
        next(error);
    }
});

// @desc Get FAQs
router.get('/faqs', async (req, res, next) => {
    try {
        const faqs = await Faq.find();
        res.status(200).json({ success: true, count: faqs.length, data: faqs });
    } catch (error) {
        next(error);
    }
});

// @desc Update FAQ
router.put('/faqs/:id', async (req, res, next) => {
    try {
        const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!faq) return res.status(404).json({ success: false, error: 'FAQ not found' });
        res.status(200).json({ success: true, data: faq });
    } catch (error) {
        next(error);
    }
});

// @desc Delete FAQ
router.delete('/faqs/:id', async (req, res, next) => {
    try {
        const faq = await Faq.findByIdAndDelete(req.params.id);
        if (!faq) return res.status(404).json({ success: false, error: 'FAQ not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
});

// TICKET Management (Simple)

// @desc Create Ticket (Escalation)
router.post('/tickets', async (req, res, next) => {
    try {
        const ticket = await Ticket.create(req.body);
        res.status(201).json({ success: true, data: ticket });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
