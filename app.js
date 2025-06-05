const express=require("express");

const app=express();

app.get("/",(req,resp)=>{
    resp.send("at root")
})

app.listen(3000,()=>{
    console.log("server started at 3000")
})