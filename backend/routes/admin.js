const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken")

const Show = require('../models/show')

router.post("/addshow", [
    body("movie").notEmpty().withMessage("Movie name is required. "),
    body("date").notEmpty().withMessage("Date is required. "),
    body("timing").notEmpty().withMessage("Show timing is required. "),
    body("price").notEmpty().withMessage("Price is required. "),
    body("seats").notEmpty().withMessage("Number of seats is required. "),
],async (req, res)=>{
    let token = req.headers.authorization.split(' ')[1];
    let decodedToken;
    if(!token){
        res.status(400).json({success: false, message: "Error! Token was not provided"});
    }
    try{
    decodedToken = jwt.verify(token, "mashup_secret_key");
    if(decodedToken.role === "admin")
    {
        var { movie, date, timing, price, seats } = req.body;
        var status = "enabled";
        let existingShow
        let errors = validationResult(req);
        if(!errors.isEmpty()){
            let error = errors.errors.map(err=>{
                return err.msg;
            })
            res.status(400).json({success: false, error})
        }
        else{
            existingShow = await Show.findOne({date:date, timing: timing})
            if(existingShow){
                res.status(400).json({message: "A show already exists at this date and time"})
            }else{
        let newShow = new Show({
            movie: movie,
            date: date,
            timing: timing,
            seats: seats,
            price: price,
            status: status
        });
        newShow.save()
        .then(()=>{
            res.status(200).json({success: true, message: "Show Added"})
        })
        .catch(error=>{
            console.log(error)
            res.status(400).json({success: false, error})
        })
    }
    }
    }else{
        res.status(400).json({message: "Unauthorized User"})
    }
    }
    catch(error){
        res.status(400).json({success: false, message: "Token expired"});
    }
});

router.delete("/delete/:id", (req, res)=>{
    let token = req.headers.authorization.split(' ')[1];
    let decodedToken;
    if(!token){
        res.status(400).json({success: false, message: "Error! Token was not provided"});
    }
    try{
    decodedToken = jwt.verify(token, "mashup_secret_key");
    if(decodedToken.role === "admin"){
    let query = {_id: req.params.id}
    Show.deleteOne(query)
    .then(()=>{
        res.status(200).json({success: true, message: "Show Deleted"})
    })
    .catch(error=>{
        res.status(400).json({success: false, error})
    })
}else{
    res.status(400).json({message: "Unauthorized User"})
}
}
catch(error){
    res.status(400).json({success: false, message: "Token expired"});
}
});

router.post("/update/:id" , async (req, res)=>{
    let token = req.headers.authorization.split(' ')[1];
    let decodedToken;
    if(!token){
        res.status(400).json({success: false, message: "Error! Token was not provided"});
    }
    try{
    decodedToken = jwt.verify(token, "mashup_secret_key");
    if(decodedToken.role === "admin"){
    let { movie, date, timing, price, seats } = req.body;
    let existingShow
    existingShow = await Show.findOne({date:date, timing: timing, _id:{$ne: req.params.id}})
    if(existingShow){
        res.status(400).json({message: "A show already exists at this date and time"})
    }else{
    let show = {
        movie: movie,
        date: date,
        timing: timing,
        price: price,
        seats: seats
    }
    let query = {_id: req.params.id};

    Show.updateOne(query, show)
    .then(()=>{
        res.status(200).json({success: true, message: "Show Updated"})
    })
    .catch(error=>{
        res.status(400).json({success: false, error})
    })
}
    }
    else{
        res.status(400).json({message: "Unauthorized User"})
    }
}
    catch(error){
        res.status(400).json({success: false, message: "Token expired"});
    }
});

router.post("/updatestatus/:id" ,(req, res)=>{
    let token = req.headers.authorization.split(' ')[1];
    let decodedToken;
    if(!token){
        res.status(400).json({success: false, message: "Error! Token was not provided"});
    }
    try{
    decodedToken = jwt.verify(token, "mashup_secret_key");
    if(decodedToken.role === "admin"){
    let query = {_id: req.params.id};

    Show.updateOne(query, {status: req.body.status})
    .then(()=>{
        res.status(200).json({success: true, message: "Status Updated"})
    })
    .catch(error=>{
        res.status(400).json({success: false, error})
    })
}else{
    res.status(400).json({message: "Unauthorized User"})
}
}
catch(error){
    res.status(400).json({success: false, message: "Token expired"});
}
});

module.exports = router;