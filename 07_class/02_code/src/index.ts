import express from "express"
import { PrismaClient } from "@prisma/client"

const app = express()
const prismaClient = new PrismaClient()
app.use(express.json())


app.get("/",async(req,res)=>{

    const response = await prismaClient.user.findMany()
    res.json({
        response
    })
})


app.post("/user",async(req,res)=>{
    const {username, password} = req.body

    const response = await prismaClient.user.create({
        data:{
            username:username,
            password:password
        }
    })

    res.json({
        message:"User succesfully signed up",
        id:response.id
    })
})

app.listen(3000)