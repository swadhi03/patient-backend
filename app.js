const express = require("express")
const cors= require("cors")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt= require("bcrypt")
const LoginModel = require("./models/Admin")
const DoctorModel = require("./models/Doctor")

mongoose.connect("mongodb+srv://swathi:swathi2609@cluster0.em0miqo.mongodb.net/patientappdb?retryWrites=true&w=majority&appName=Cluster0")

const app = express()
app.use(cors())
app.use(express.json())


//api for Admin Sign up
app.post("/adminsignup", (req,res)=>{
    let input=req.body
    let hashedPassword= bcrypt.hashSync(input.password,10)
    //console.log(hashedPassword)
    input.password=hashedPassword
    console.log(input)
    let result = new LoginModel(input)
    result.save()
    res.json({"status":"success"})
})

app.post("/adminsignin",(req,res)=>{
    let input=req.body
    let result=LoginModel.find({username:input.username}).then(
        (response)=>{
            if (response.length>0) {
                const validator=bcrypt.compareSync(input.password,response[0].password)
                if (validator) {
                    jwt.sign({email:input.username},"patient-app",{expiresIn:"1d"},
                        (error,token)=>{
                            if (error) {
                                res.json({"status":"Something went wrong"})
                            } else {
                                res.json({"status":"success","token":token})
                            }
                        }
                    )
                } else {
                    res.json({"status":"invalid password"})
                }
            } else {
                res.json({"status":"Invalid username"})
            }
        }
    ).catch()
})

app.post("/addDoctor",(req,res)=>{
    let input=req.body
    let token=req.headers.token
    jwt.verify(token,"patient-app",
        (error,decoded)=>{
            if (decoded && decoded.email) {
                let result = new DoctorModel(input)
                result.save()
                res.json({"status":"success"})
            } else {
                res.json("Ivalid authentication")
            }
        }
    )
})


app.listen(8080,()=>{
    console.log("server started")
})