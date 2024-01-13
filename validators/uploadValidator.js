
// Middleware to verify if there is a valid file
const verifyIfValidFile = (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.file;
    const fileType = file.mimetype;

    if (fileType !== 'image/jpeg' && fileType !== 'image/png' && fileType !== 'application/pdf') {
        return res.status(400).json({ error: 'Unsupported file type' });
    }

    next();
};

// Middleware to validate PDF files
const validatePDF = (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.file;
    const fileType = file.mimetype;

    if (fileType !== 'application/pdf') {
        return res.status(400).json({ error: 'Invalid file type. Only PDF files are allowed.' });
    }

    next();
};



module.exports = {
    verifyIfValidFile,
    validatePDF
}