const  mongoose  = require("mongoose")
const Event = require("./models/Event")


const connectDb = ()=>{
    return mongoose.connect(process.env.MONGODB_URI).then(()=>console.log("DB connected")).catch((e)=>{console.log("Failed to connect "+ process.env.MONGODB_URI+"\n" + e)})
}

module.exports = {connectDb}