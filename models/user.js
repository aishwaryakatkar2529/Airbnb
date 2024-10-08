const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passpostLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email :{
        type:String,
        required :true,
    }
});

userSchema.plugin(passpostLocalMongoose);  
//You're free to define your User how you like.
//  Passport-Local Mongoose will add a username, 
// hash and salt field to store the username, 
// the hashed password and the salt value.

module.exports = mongoose.model('User',userSchema);
