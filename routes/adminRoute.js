const express =require('express');
const admin_route = express();

const session =require('express-session');
const config = require("../config/config");

const nocache = require("nocache")
admin_route.use(nocache());


admin_route.use(session({secret:config.sessionSecret,resave: false,
    saveUninitialized: false}))

const bodyParser = require("body-parser")
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

const auth = require('../middleware/adminAuth')
   
const adminController = require("../controllers/adminController");

admin_route.get('/admin',auth.isLogout,adminController.loadLogin)


admin_route.post('/verifyLogin',adminController.verifyLogin);

admin_route.get('/adminhome',auth.isLogin, adminController.loadDashboard)

admin_route.get('/admin/logout',auth.isLogin, adminController.logout)

admin_route.get('/admin/dashboard',adminController.adminDashboard)

admin_route.get('/newuser',auth.isLogin,adminController.newUserLoad);

admin_route.post('/newuser',adminController.addUser);

admin_route.get('/adminedituser',auth.isLogin,adminController.editUserLoad);

admin_route.post('/adminedituser',adminController.updateUsers);

admin_route.get('/admindeleteuser',adminController.deleteUsers);

// admin_route.get('*',function(req,res){
//     res.redirect('/admin')
// })
module.exports = admin_route; 