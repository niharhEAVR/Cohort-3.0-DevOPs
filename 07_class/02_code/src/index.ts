import express from "express"
import { PrismaClient } from "@prisma/client"

const app = express()
const prismaClient = new PrismaClient()
app.use(express.json())

const randomNames = [
    "Ava", "Liam", "Olivia", "Noah", "Emma", "Elijah", "Sophia", "James", "Isabella", "Benjamin",
    "Mia", "Lucas", "Charlotte", "Henry", "Amelia", "Alexander", "Harper", "William", "Evelyn", "Michael",
    "Abigail", "Daniel", "Ella", "Matthew", "Scarlett", "Jackson", "Grace", "Sebastian", "Chloe", "Jack",
    "Aria", "Owen", "Lily", "Theodore", "Avery", "Aiden", "Sofia", "Samuel", "Camila", "David",
    "Layla", "Joseph", "Riley", "John", "Nora", "Wyatt", "Zoey", "Carter", "Luna", "Julian"
];
  

app.get("/",async(req,res)=>{


    const random = Math.ceil(Math.random() * 50);
    const random2 = Math.ceil(Math.random() * 50);

    await prismaClient.user.create({
        data:{
            username:randomNames[random],
            password:randomNames[random2]
        }
    })

    const response = await prismaClient.user.findMany()
    res.json({
        response
    })
})

app.listen(3000)