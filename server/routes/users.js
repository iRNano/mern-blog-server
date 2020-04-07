const express = require("express")
const router = express.Router()
const User = require("../models/User")
const bcrpyt = require("bcryptjs")
const jwt = require("jsonwebtoken")


//register
router.post("/", (req,res)=>{   
    //Username must be greater than 8 characters
    if(req.body.username.length < 8) return res.status(400).json({status:400, message: "Username must be greater than 8 characters"})
    //password must be greater than 8 characters
    if(req.body.password.length < 8) return res.status(400).json({status:400,message: "Password must be greater than 8 characters"})

    //Password must be equal to password2
    if(req.body.password != req.body.password2) return res.status(400).json({status:400, message:"Password doesn't match"})

    //Check if the username exists
    User.findOne({username:req.body.username}, (err,user) =>{
        if(user) return res.status(400).json({status:400, message: "Username already exists!"})
        bcrpyt.hash(req.body.password, 10, (err, hashedPassword)=>{
            const newUser = new User()
            newUser.fullname = req.body.fullname
            newUser.username = req.body.username
            newUser.password = hashedPassword
            newUser.save()
            return res.status(200).json({status:200, message: "Registered Successfully"})
        })
        
    })
})

//login

router.post("/login", (req,res)=>{
    User.findOne({username:req.body.username}, (err,user)=>{
        if(!user) return res.status(400).json({status:400, message: "No user found"})
        bcrpyt.compare(req.body.password, user.password, (err,result)=>{
            if(!result) {
                return res.status(401).json({
                    auth:false,
                    message: "Invalid Credentials",
                    token: null
                })
            }else{
                let token = jwt.sign(user.toJSON(), 'b49-blog', {expiresIn: '1h'})
                return res.status(200).json({
                    auth:true,
                    message: "Logged in successfully",
                    user,
                    token
                })
            }
        })
    })
})
// view all
router.get("/", (req,res) =>{
    User.find({}, (err,users)=>{
        return res.json(users)
    })
})

module.exports = router