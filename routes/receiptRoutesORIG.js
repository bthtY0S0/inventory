const express = require('express');
const router = express.Router();
const { uploadReceipt } = require('../controllers/receiptController');

router.post('/upload', uploadReceipt);

module.exports = router;
