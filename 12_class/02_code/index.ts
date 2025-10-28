import express from "express";
const app = express();

app.get("/cpu",(req,res)=>{
    const startTime = Date.now();
    for (let i = 0; i < 1000000000; i++) {
        Math.random();        
    };
    const totalTime = Date.now() - startTime;
    res.json("Hello cpu. "+" Total time taken for the operation is: "+totalTime+" ms");
});

app.get("/health",(req,res)=>{
    res.status(202).json("server is healthy");
});

app.get("/",(req,res)=>{
    res.status(202).json({
        "greet":"Hello user",
        "route-1":"http://localhost:3000/cpu",
        "route-2":"http://localhost:3000/health"
    });
});

app.listen(3000);