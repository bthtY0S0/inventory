const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Use temp folder to store uploads
const upload = multer({ dest: path.join(__dirname, '../temp') });

const { uploadUnified } = require('../controllers/unifiedUploadController');

router.post('/upload', upload.single('file'), uploadUnified);

module.exports = router;

