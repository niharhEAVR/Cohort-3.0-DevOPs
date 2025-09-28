const express = require('express')
const mongoose = require('mongoose')
const { userModel } = require("./db")
const app = express()
require('dotenv').config()

mongoose.connect(process.env.DATABASE_URL)
console.log(process.env.DATABASE_URL);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    await userModel.create({
        username: username,
        password: password
    })

    res.json({
        messege: "You are signed up"
    })
});

app.listen(3001)