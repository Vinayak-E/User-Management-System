const express = require("express");
const user_route = express();
const path = require("path");
const session = require("express-session")

const config =require("../config/config")
user_route.use(session({secret:config.sessionSecret,resave: false,
    saveUninitialized: false}));

const auth =require("../middleware/auth")

const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}))

const userController = require("../controllers/userController");


user_route.get('/signup',auth.isLogout, userController.loadRegister);
user_route.post('/signup',userController.insertUser)

user_route.get('/', auth.isLogout, userController.login)
user_route.get('/login',auth.isLogout, userController.login) 

user_route.post('/login',userController.verifyLogin)

user_route.get('/home',auth.isLogin, userController.loadHome)

user_route.get('/logout',auth.isLogin,userController.userLogout)

user_route.get('/edit',auth.isLogin,userController.editLoad)

user_route.post('/edit', userController.updateProfile)

module.exports = user_route;