// Middleware to get user ID from token
const getUserId = (req, res, next) => {
    try {
        req.userID = "ZAK_102";
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};




module.exports = {
    getUserId
}