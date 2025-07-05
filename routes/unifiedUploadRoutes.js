const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadUnified } = require('../controllers/unifiedUploadController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadUnified);

module.exports = router;

