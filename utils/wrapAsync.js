// handling error whichh occurs due to async function

module.exports=(fn)=>{
    return (req,resp,next)=>{
        fn(req,resp,next).catch((err)=>(next(err)))
    }
}