const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type :String,
        reuired : true
    } ,
    description:{ 
        type :String,
    },
    image: {
        url: {
            type: String,
            default: "https://unsplash.com/photos/a-house-with-a-pool-in-front-of-it-puk9ju-kWHI",
            set: (v) =>
                v === "" ? "https://unsplash.com/photos/a-house-with-a-pool-in-front-of-it-puk9ju-kWHI" : v,
        },
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
});

const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;
    