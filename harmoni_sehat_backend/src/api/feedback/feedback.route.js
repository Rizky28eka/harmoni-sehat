const express = require('express');
const router = express.Router();
const feedbackController = require('./feedback.controller');
const { createFeedbackValidation, updateFeedbackValidation } = require('./feedback.validation');

router.get('/', feedbackController.getAllFeedback);
router.get('/:id', feedbackController.getFeedbackById);
router.post('/', createFeedbackValidation, feedbackController.createFeedback);
router.put('/:id', updateFeedbackValidation, feedbackController.updateFeedback);
router.delete('/:id', feedbackController.deleteFeedback);

module.exports = router;
