const Intent = require('../models/Intent');

// @desc    Get all intents
// @route   GET /api/v1/chatbot/intents
// @access  Protected (Admin/Agent)
exports.getAllIntents = async (req, res, next) => {
    try {
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit', 'q'];

        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Search by name or trainingPhrases if 'q' is provided
        let searchCriteria = JSON.parse(queryStr);
        if (req.query.q) {
            searchCriteria = {
                $or: [
                    { name: { $regex: req.query.q, $options: 'i' } },
                    { trainingPhrases: { $regex: req.query.q, $options: 'i' } }
                ]
            };
        }

        // Finding resource
        query = Intent.find(searchCriteria);

        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Intent.countDocuments(searchCriteria);

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const intents = await query;

        // Pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        res.status(200).json({
            success: true,
            count: intents.length,
            pagination,
            data: intents
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single intent
// @route   GET /api/v1/chatbot/intents/:id
// @access  Protected (Admin/Agent)
exports.getIntentById = async (req, res, next) => {
    try {
        const intent = await Intent.findById(req.params.id);

        if (!intent) {
            return res.status(404).json({ success: false, error: 'Intent not found' });
        }

        res.status(200).json({
            success: true,
            data: intent
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new intent
// @route   POST /api/v1/chatbot/intents
// @access  Private (Admin)
exports.createIntent = async (req, res, next) => {
    try {
        const intent = await Intent.create(req.body);

        res.status(201).json({
            success: true,
            data: intent
        });
    } catch (error) {
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({ success: false, error: 'Intent name already exists' });
        }
        next(error);
    }
};

// @desc    Update intent
// @route   PUT /api/v1/chatbot/intents/:id
// @access  Private (Admin)
exports.updateIntent = async (req, res, next) => {
    try {
        let intent = await Intent.findById(req.params.id);

        if (!intent) {
            return res.status(404).json({ success: false, error: 'Intent not found' });
        }

        intent = await Intent.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: intent
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, error: 'Intent name already exists' });
        }
        next(error);
    }
};

// @desc    Delete intent
// @route   DELETE /api/v1/chatbot/intents/:id
// @access  Private (Admin)
exports.deleteIntent = async (req, res, next) => {
    try {
        const intent = await Intent.findById(req.params.id);

        if (!intent) {
            return res.status(404).json({ success: false, error: 'Intent not found' });
        }

        await intent.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
