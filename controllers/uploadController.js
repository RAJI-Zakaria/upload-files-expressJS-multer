// controllers/uploadController.js
const fs = require('fs');
const path = require('path');

// Function to generate a unique file name
const generateUniqueFileName = (originalName) => {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = path.extname(originalName);
    return `${timestamp}_${randomString}${fileExtension}`;
};

const getFile = (req, res) => {
    const { userID, folderName, fileName } = req.params;

    // Verify user for files in the 'secretFiles' folder
    if (folderName === 'secretFiles' && userID !== req.userID) {
        return res.status(403).json({ error: 'Access forbidden. Not authorized.' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', userID, folderName, fileName);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: 'File not found' });
    }
};

const getFilesPaginated = (req, res) => {
    const { userID, page } = req.params;
    const itemsPerPage = 10;
    const offset = (page - 1) * itemsPerPage;

    // Get user-specific directory
    const userDirectory = path.join(__dirname, '..', 'uploads', userID);

    // Check if the user directory exists
    if (!fs.existsSync(userDirectory)) {
        return res.status(404).json({ error: 'User directory not found' });
    }

    // Get all files in the 'publicFiles' and 'secretFiles' folders
    const publicFiles = fs.readdirSync(path.join(userDirectory, 'publicFiles'));
    const secretFiles = fs.readdirSync(path.join(userDirectory, 'secretFiles'));

    // Combine public and secret files
    const allFiles = [...publicFiles, ...secretFiles];

    // Paginate the list of files
    const paginatedFiles = allFiles.slice(offset, offset + itemsPerPage);

    // Return the paginated list of files
    res.status(200).json({ files: paginatedFiles });
};

const uploadFile = (req, res) => {
    const userID = req.userID;
    const file = req.files.file;

    // Create user-specific directory if not exists
    const userDirectory = path.join(__dirname, '..', 'uploads', userID);
    if (!fs.existsSync(userDirectory)) {
        fs.mkdirSync(userDirectory);
        fs.mkdirSync(path.join(userDirectory, 'publicFiles'));
        fs.mkdirSync(path.join(userDirectory, 'secretFiles'));
    }

    // Determine destination folder based on the file type
    const folderName = file.mimetype === 'application/pdf' ? 'secretFiles' : 'publicFiles';

    // Generate a unique file name
    const uniqueFileName = generateUniqueFileName(file.name);

    const uploadPath = path.join(userDirectory, folderName, uniqueFileName);

    file.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error uploading file' });
        }

        // Return the URL of the uploaded file
        const fileURL = `/api_blog/uploads/${userID}/${folderName}/${uniqueFileName}`;
        res.status(200).json({ message: 'File uploaded successfully', fileURL });
    });
};

module.exports = {
    getFilesPaginated,
    getFile,
    uploadFile,
};
