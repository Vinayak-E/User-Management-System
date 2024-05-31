const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_management");
const path = require("path");

const express = require("express");
const app =express();

app.set('view engine','ejs');
app.use('/static', express.static(path.join(__dirname, 'public')));

//add nocache for session handling
const nocache = require("nocache")
app.use(nocache());

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });


//for user routes
const userRoute = require('./routes/userRoute');
app.use('/',userRoute);

 
//for admin routes
const adminRoute =require('./routes/adminRoute');
app.use('/',adminRoute); 

app.listen(3000,()=>{
    console.log("server is running at http://localhost:3000/")
})              