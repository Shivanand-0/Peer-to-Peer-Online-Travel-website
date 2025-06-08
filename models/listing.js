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
        type:String,
        default:"https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1020&auto=format&fit=crop&ixlib=rb-4.0.3",
        set:(v)=>(v==""?"https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1020&auto=format&fit=crop&ixlib=rb-4.0.3":v)
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
    }]

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