const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { handleUpload } = require('../controllers/unifiedUploadController');

router.post('/upload', upload.single('file'), handleUpload);

module.exports = router;

