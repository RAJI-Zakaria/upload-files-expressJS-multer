const express = require('express');
const router = express.Router();
const {
    uploadFile,
    getFile,
    getFilesPaginated
} = require('../controllers/uploadController');

const {
    verifyIfValidFile,
    validatePDF
} = require('../validators/uploadValidator');




// Route for file upload

router.post('/uploads', verifyIfValidFile, uploadFile);

// Endpoint to access a specific file
router.get('/uploads/:userID/:folderName/:fileName', getFile);


// Endpoint to get files paginated by user ID
router.get('/uploads/:userID/:page', getFilesPaginated);

module.exports = router;
