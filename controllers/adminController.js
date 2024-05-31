const User = require('../models/userModel.js');
const bcrypt =require('bcrypt')
const randomstring = require('randomstring')


const securePassword = async(password)=>{
    try{
      const passwordHash = await  bcrypt.hash(password,10);
      return passwordHash;

    }catch (error){
          console.log(error.message)
    }
}


const loadLogin = async(req,res)=>{
    try{
          const msg =req.query.msg;
        res.render('adminlogin',{logoutMessage: msg})
    }catch (error){
       console.log(error.message)
    }
}



const verifyLogin = async(req,res)=>{
    try{
       
        const email = req.body.email;
        const password = req.body.password;
        

      const userData = await User.findOne({email:email});
      
      if(userData){
               const passwordMatch = await bcrypt.compare(password,userData.password)
             if(passwordMatch){
               if(userData.is_admin===0){
                res.render('adminlogin',{message:"Email and password is incorrect"})
               }else{
                req.session.user_id =userData._id
                res.redirect("/adminhome")
               }

             }else{
                res.render('adminlogin',{message:"Email and password is incorrect"})
             }
      }else{
        res.render('adminlogin',{message:"Email and password is incorrect"})
      }

 
 
    }catch(error){
        console.log(error.message)
    }
}

const loadDashboard = async(req,res)=>{
    try{
     const userData = await  User.findById({_id:req.session.user_id})
        res.render('adminhome',{admin:userData})

    }catch(error){
        console.log(error.message)
    }
}

const logout = async(req,res)=>{
    try{
        req.session.destroy();
      
        res.redirect('/admin?msg=Logout Successfully...')

    }catch(error){
        console.log(error.message)
    }
}

const adminDashboard = async(req,res)=>{
    try{
        var search = ''
        if(req.query.search){
            search = req.query.search
        }
      const userData =  await User.find({is_admin:{$ne:1},
                   $or:[
                    {name:{$regex:".*"+search+'.*',$options:'i'}},
                    {email:{$regex:".*"+search+'.*',$options:'i'}},
                    {mobile:{$regex:".*"+search+'.*',$options:'i'}}
                    
                ]
            })
        res.render('dashboard',{users:userData})
    }catch(error){
        console.log(error.message)
    }
}

// Add new user

const newUserLoad = async(req,res)=>{
    try{
        res.render('newuser')

    }catch(error){
        console.log(error.message)
    }
}

// const addUser = async(req,res)=>{
//     try{
//        const name = req.body.name;
//        const email = req.body.email;
//        const mobile = req.body.mobile;
       
//        const password = randomstring.generate(8)

//        const spassword = await securePassword(password)  

//        const user = new User({

        
//         name:name,
//         email:email,
//         mobile:mobile,
//         password:spassword,
//         is_admin:0

//        })

//       const userData = await user.save();
//       if(userData){

//         res.redirect('/admin/dashboard')

//       }else{
//         res.render("newuser",{message:"Something wrong"})
//       }

//     }catch(error){
//         console.log(error.message)
//     }
// }

const addUser = async(req,res)=>{
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
            res.render('newuser',{message:"Fill All Fields"});
        }

        else if(existingUser) {
            res.render('newuser',{message:"User Already Exists"});
        }

        else if(!isValidEmail(email)){
          res.render('newuser',{emailMsg:"Enter a valid Email"});
        }

        else if(mobile.length !== 10){
            res.render('newuser',{mobileMsg:"Enter a valid Mobile"});
        }

        else{
            await user.save();
            res.redirect('/admin/dashboard')
        }

    }catch(error){
        console.log(error.message)
    }
}


//edit user details


const editUserLoad = async(req,res)=>{
    try {
        //use the id from query for identify usr id
        const id = req.query.id;
        //user find by the id when the id from query
        const userData = await User.findById({_id:id});
        if (userData) {
            //render the edit-user page and pass the userData to the render page for specifid edit
            res.render('adminedituser',{user:userData,dashboardType: 'admin-edit-user'});
        }else{
            res.redirect('/admin/dashboard')
        }

    } catch (error) {
        console.log(error.message);
    }
}

//update user
const updateUsers = async(req,res)=>{
    try {
        
        const userData = await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mobile}})
        res.redirect('/admin/dashboard')

    } catch (error) {
        console.log(error.message)
    }
}
// delete 
//delete user
const deleteUsers = async(req,res)=>{
    try {
        //import the id from query selector
        const id = req.query.id;
        //the user is delete using the id selection
        await User.deleteOne({_id:id})
        //redirect to the dashboard for reflection on the remaning data
        res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error.message);
    }
}



module.exports={
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad ,
    updateUsers,
    deleteUsers
}
