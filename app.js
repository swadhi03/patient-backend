const express = require("express")
const cors= require("cors")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt= require("bcrypt")
const LoginModel = require("./models/Admin")
const DoctorModel = require("./models/Doctor")
const PatientModel = require("./models/Patient")

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

app.post("/addpatient",(req,res)=>{
    let input=req.body
    let hashedPassword = bcrypt.hashSync(input.password,10)
    input.password = hashedPassword
    const DateObject = new Date()
    const currentYear = DateObject.getFullYear()
    //console.log(currentYear.toString())
    const currentMonth = DateObject.getMonth()+1
    //console.log(currentMonth.toString())
    const randomNumber = Math.floor(Math.random()*9999)+1000
    //console.log(randomNumber.toString())
    const patientid = "XYZ"+currentYear.toString()+currentMonth.toString()+randomNumber.toString()
    console.log(patientid)
    input.patientid = patientid
    console.log(patientid)
    console.log(input)
    const patient = new PatientModel(input)
    patient.save()
    res.json({"status":"success"})
})

app.post("/PatientSignIn",(req,res)=>{
    input = req.body
    let result = PatientModel.find({patientid:input.patientid}).then(
       (response)=>{
        if (response.length>0) {
          const validator = bcrypt.compareSync(input.password,response[0].password)
          if (validator) {
            jwt.sign({id:input.patientid},"patient-app",{expiresIn:"1d"},
                (error,token)=>{
                    if (error) {
                        res.json({"status":"Something went wrong"})
                    } else {
                        res.json({"status":"success","token":token}) 
                    }
                }
            )
          } else {
            res.json({"status":"Invalid password"})
          }  
        } else {
            res.json({"status":"Invalid patient-Id"})
        }
       } 
    ).catch()
})

app.listen(8080,()=>{
    console.log("server started")
})