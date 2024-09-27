const express = require("express");
const router = express.Router();


// Index -users
router.get("/" ,(req,res)=>{
    res.send("Get for users");
});

// show -users
router.get("/:id" ,(req,res)=>{
    res.send("Get for show users id");
});

// post-user

router.post("/" ,(req,res)=>{
    res.send("Post for users");
});

// Delete -users
router.delete("/:id" ,(req,res)=>{
    res.send("Delete for user id");
});

module.exports = router;