const paymentService = require('./payment.service');

const createTransaction = async (req, res) => {
  try {
    const transaction = await paymentService.createTransaction(req.body);
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create transaction', error: error.message });
  }
};

const handleNotification = async (req, res) => {
  try {
    const statusResponse = await paymentService.handleNotification(req.body);
    res.json(statusResponse);
  } catch (error) {
    res.status(500).json({ message: 'Failed to handle notification', error: error.message });
  }
};

module.exports = {
  createTransaction,
  handleNotification,
};
