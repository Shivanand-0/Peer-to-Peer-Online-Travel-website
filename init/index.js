// requiring dependencies
const mongoose=require("mongoose");
const sampleData=require("./data");
const Listing=require("../models/listing");
const dotenv=require("dotenv");


//accessing url from .env file
dotenv.config({path:"../.env"})    // configuring .env for path of it
const MONGO_URL=process.env.MONGO_URL   // mongo url for  triphut database

// initialisation of database
async function main(){
    await mongoose.connect(MONGO_URL)
}
main()
.then(()=>{console.log("db connected...")})
.catch((e)=>{console.log("db connecton error: ",e)});

//adding data in database collection named Listing
async function initData(){
    await Listing.deleteMany({});     // before initialisation delete all previous data

    let dataList=sampleData.data.map((data)=>({...data,owner:"684600e6e425aacfe9acb13b"}));           // here sampleData: object of a list named data & data: a list of object containg each listing-data
    await Listing.insertMany(dataList);  //inserted a list of data
    console.log("data initialised");
}

initData();
