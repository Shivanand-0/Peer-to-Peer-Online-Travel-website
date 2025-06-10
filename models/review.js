const mongoose=require("mongoose");
const Schema= mongoose.Schema;

const reviewSchema= new Schema({
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    comment:{
        type:String,
        required: true,
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});

const Review= mongoose.model("Review", reviewSchema);

module.exports=Review;