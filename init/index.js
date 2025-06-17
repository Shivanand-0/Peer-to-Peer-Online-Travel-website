// requiring dependencies
const mongoose=require("mongoose");
const sampleData=require("./data");
const Listing=require("../models/listing");
const dotenv=require("dotenv");
const delay = ms => new Promise(res => setTimeout(res, ms));

//accessing url from .env file
dotenv.config({path:"../.env"})    // configuring .env for path of it
const MONGO_URL=process.env.ATLASDB_URL   // mongo url for  triphut database
// const MONGO_URL=process.env.MONGO_URL   // mongo url for  triphut database

// initialisation of database
async function main(){
    await mongoose.connect(MONGO_URL)
}
main()
.then(()=>{console.log("db connected...")})
.catch((e)=>{console.log("db connecton error: ",e)});

//adding data in database collection named Listing


async function initData2(){
    let count=0;
    await Listing.deleteMany({});     // before initialisation delete all previous data
    for(eachdata of sampleData.data){
        const urlMap = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(eachdata.location)}`;
        try{
            const response = await fetch(
                urlMap,{ headers: {'User-Agent': 'TripHut/1.0 (my.email@example.com)'}} // polite usage
            );
            const data = await response.json();
            if (data.length > 0) {
                let coordiate = [data[0].lat, data[0].lon];
                let newListing = await Listing(eachdata);
                // newListing.owner = "684600e6e425aacfe9acb13b";  // local
                newListing.owner = "684cb46cbf9dd92c08de870e"; //Atlus owner
                newListing.coordinate = coordiate;
                await newListing.save();
                console.log(count++);

            }else {
                console.log("No results found.");
            }   

        }catch (err) {
            console.error("Geocoding error:", err);
        }
        await delay(1000);
    }



}


initData2()

