const express = require('express');
const fileUpload = require('express-fileupload');

const {
    getUserId
} = require('./middleware/getUserIdToken')

const app = express();
const port = 4000;

//import router
const uploadRoute = require('./routes/uploadRoute');

//fetching the userID from a token : 
//please note that for testing purpose i am not using a real token 
//the following middleware will just add the id directly to the req object so that it can be used by controllers later
app.use(getUserId)


// Enable file uploads
app.use(fileUpload());

app.use("/api",uploadRoute)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
