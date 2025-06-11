const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("../models/review.js")

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        url: String,
        filename:String,
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

});

// mongoose midelware {will we active if findByIdAndDelete will requested}
// it will delete all the attached review to listing.if llisting will be delete
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;