const express = require('express');
const router = express.Router();
const {
    getAllIntents,
    getIntentById,
    createIntent,
    updateIntent,
    deleteIntent
} = require('../controllers/intentController');
const { protect, admin } = require('../middlewares/authMiddleware');

// All routes protected and admin/agent only
router.use(protect);
router.use(admin);

router
    .route('/')
    .get(getAllIntents)
    .post(createIntent);

router
    .route('/:id')
    .get(getIntentById)
    .put(updateIntent)
    .delete(deleteIntent);

module.exports = router;
