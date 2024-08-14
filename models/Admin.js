const mongoose = require("mongoose")
const LoginSchema = mongoose.Schema(
    {
        username:{type:String},
        password:{type:String}
    }
)



const LoginModel = mongoose.model("admin",LoginSchema)
module.exports=LoginModel