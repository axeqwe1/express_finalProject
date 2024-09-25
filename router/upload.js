const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router()

// Set up storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images/')  // Ensure this directory exists
    },
    filename: function(req, file, cb) {
        const extension = path.extname(file.originalname);
        cb(null, file.originalname);  // Create a new filename with a timestamp
    }
});
const upload = multer({ storage: storage });
// Route for file upload
router.post('/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        console.log('File uploaded and renamed to: ', req.file.filename);
        res.status(200).send({ message: 'File uploaded successfully', filename: req.file.filename });
    } else {
        res.status(400).send({ message: 'File upload failed' });
    }
});

module.exports = router