import express from "express";
const app = express();

app.get("/cpu",(req,res)=>{
    const startTime = Date.now();
    for (let i = 0; i < 1000000000; i++) {
        Math.random();        
    };
    const totalTime = Date.now() - startTime;
    res.send("Hello cpu. "+" Total time taken for the operation is: "+totalTime+" ms");
});

app.get("/health",(req,res)=>{
    res.status(202).send("server is healthy");
});

app.listen(3000);