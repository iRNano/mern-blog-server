const express = require("express")
const router = express.Router()
const Post = require("../models/Post")
const jwt = require("jsonwebtoken")


//Add a post

router.post("/", (req,res)=>{
    let token = req.headers["x-auth-token"]
    if(!token) return res.status(401).json({message: "You are not logged in"})

    let decoded = jwt.verify(token, 'b49-blog')
    if(decoded) {
        const newPost = Post()
        newPost.title = req.body.title
        newPost.description = req.body.description
        newPost.author = decoded.username
        newPost.save()
        return res.json(newPost)
    }
    
})
//view all posts
router.get("/", (req,res)=>{
    Post.find({}, (err,posts)=>{
        return res.json(posts)
    })
})

//view post
router.get("/:id", (req,res)=>{
    Post.findOne({_id:req.params.id}, (err,post)=>{
        return res.json(post)
    })
})

//edit a post
router.put("/:id", (req,res)=>{
    let token = req.headers["x-auth-token"]
    if(!token) return res.status(401).json({message: "You are not logged in"})

    let decoded = jwt.verify(token, "b49-blog")
    if(decoded){
        Post.findOne({_id:req.params.id}, (err,post)=>{
            if(decoded.username !== post.author) return res.status(401).json({
                message: "You are not authorized to edit this post"
            })
            post.title = req.body.title
            post.description = req.body.description
            post.save()
            return res.json(post)
        })
    }
    

})

//delete a post
router.delete("/:id", (req,res)=>{
    let token = req.headers["x-auth-token"]
    if(!token) return res.status(401).json({message: "Unauthorized!"})

    let decoded = jwt.verify(token, 'b49-blog')

    if(decoded){
        Post.findOne({_id:req.params.id}, (err,post)=>{
            if(post.author == decoded.username){
                post.delete()
                return res.status(200).json({message: "Post deleted"})
            }else{
                return res.status(401).json({message: "Unauthorized to delete this post"})
            }
        })
    }

})
module.exports = router;