const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");


const listingSchema = new Schema({
    title : {
        type :String,
        reuired : true
    } ,
    description:{ 
        type :String,
    },
    image: {
        // url: {
        //     type: String,
        //     default: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
        //     set: (v) =>
        //         v === "" ? "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" : v,
        // },
        // filename : {
        //     type: String,
        // }
        url : String,
        filename :String,
    },
    price :{ 
        type:Number,
    },
    location : {
        type:String,
    },
    country : {
        type:String,
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        },
    ],
    owner : {
        type: Schema.Types.ObjectId,
        ref :"User",
    },
    geometry : {
        type :{
            type : String,
            enum :['Point'],
            required : true
        },
        coordinates : {
            type : [Number],
            required : true
        },
    }
});

listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});

const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;
    