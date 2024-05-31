const User = require('../models/userModel.js');
const bcrypt =require('bcrypt')

const securePassword = async(password)=>{
    try{
      const passwordHash = await  bcrypt.hash(password,10);
      return passwordHash;

    }catch (error){
          console.log(error.message)
    }
}


const loadRegister = async(req,res)=>{
    try{
        res.render('signup');
    } catch (error){
        console.log(error.message);

    }
}


const insertUser = async(req,res)=>{
    try{
        const spassword = await securePassword(req.body.password);
        const user =new User({
            name:req.body.name,
            email:req.body.email,
            password:spassword, 
            mobile:req.body.mobile,
            is_admin:0
        }); 

     const {name,email,password,mobile}= req.body;

     const existingUser = await User.findOne({email: email});

     const isValidEmail = email => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
        
        if(!name || !email || !password || !mobile) {
            res.render('signup',{message:"Fill All Fields"});
        }

        else if(existingUser) {
            res.render('signup',{message:"User Already Exists"});
        }

        else if(!isValidEmail(email)){
          res.render('signup',{emailMsg:"Enter a valid Email"});
        }

        else if(mobile.length !== 10){
            res.render('signup',{mobileMsg:"Enter a valid Mobile"});
        }

        else{
            await user.save();
            res.render('login',{signupMessage:"Your Registration is Successfull"});
        }

    }catch(error){
        console.log(error.message)
    }
}

// login up user 

const login = async(req,res)=>{
    try{
        const msg = req.query.msg;
        res.render('login', {logoutMessage: msg})
    }catch (error){
       console.log(error.message)
    }
}

const verifyLogin = async(req,res)=>{
    try{
       
        const email = req.body.email;
        const password = req.body.password;
        const mobile = req.body.mobile;

      const userData = await User.findOne({email:email});
      
    if(!userData) {
        if(!email || !password) {
            res.render('login',{message:"Fill All Fields"});
        }
        else {
            res.render('login',{message:"Email and password is incorrect"});
        }
}else {
    const passwordMatch = await bcrypt.compare(password,userData.password)
    
      if(email !== userData.email || !passwordMatch){
        res.render('login',{message:"Email and password is incorrect"})
      }
      else{
         req.session.user_id = userData._id;
         res.redirect('/home');
    }
}

    }catch(error){
        console.log(error.message)
    }
}

const loadHome =async(req,res)=>{
    try{
     const userData = await User.findById({_id:req.session.user_id})
     const upmsg = req.query.upmsg;
        res.render('home',{user:userData,message: upmsg})
    }catch(error){
        console.log(error.message)
    }
}


const userLogout = async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/login?msg=Logout Successfully...')

    }catch(error){
        console.log(error.message)
    }
}

//user profile edit and update

const editLoad =async(req,res)=>{
    try{
      
       const id =req.query.id
      const userData = await User.findById({_id:id})
         
    if(userData){
       res.render('edit',{user:userData})

    }else{
        res.redirect('/home')
    }

    }catch(error){
        console.log(error.message)
    }
}
const updateProfile =async(req,res)=>{
    try{
        
        const userData = await  User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name, email:req.body.email, mobile:req.body.mobile,}})
          res.redirect('/home?upmsg=Updated successfully...')
 
    }catch(error){
        console.log(error.message)
    }
}




module.exports = {
    loadRegister,
    insertUser,
    login,
    verifyLogin,
    loadHome,
    userLogout,
    editLoad,
    updateProfile
}
