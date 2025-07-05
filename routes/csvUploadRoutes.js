const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadCSV } = require('../controllers/csvUploadController');

const upload = multer({ dest: 'uploads/' });

router.post('/csv-upload', upload.single('file'), uploadCSV);

module.exports = router;
