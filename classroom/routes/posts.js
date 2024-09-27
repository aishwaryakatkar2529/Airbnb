const express = require("express");
const router = express.Router();



// // POST 
// index
router.get("/" ,(req,res)=>{
    res.send("Get for posts");
});

// show 
router.get("/:id" ,(req,res)=>{
    res.send("Get for show posts");
});

// post

router.post("/" ,(req,res)=>{
    res.send("Post for posts");
});

// Delete 
router.delete("/:id" ,(req,res)=>{
    res.send("Delete for posts id");
});

module.exports = router;