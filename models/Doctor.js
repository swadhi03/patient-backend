const mongoose = require("mongoose")
const DoctorSchema = mongoose.Schema(
    {
        name:String,
        qualification:String,
        specialization:String,
        contact:String
    }
)

const DoctorModel = mongoose.model("doctors",DoctorSchema)
module.exports = DoctorModel