const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


const Show = require("../models/show");

router.get("/", (req, res)=>{
    let token = req.headers.authorization.split(' ')[1];
    let decodedToken;
    if(!token){
        res.status(400).json({success: false, message: "Error! Token was not provided"});
    }
    try{
    decodedToken = jwt.verify(token, "mashup_secret_key");
    if(decodedToken.role === "admin"){
    Show.find({})
    .then((shows)=>{
        res.status(200).json({success: true, shows});
    })
    .catch(error=>{
        res.status(400).json({success: false, errors: error});
    })
}else{
    Show.find({status: "enabled"})
    .then((shows)=>{
        res.status(200).json({success: true, shows});
    })
    .catch(error=>{
        res.status(400).json({success: false, errors: error});
    })
}
}
catch(error){
    res.status(400).json({success: false, message: "Token expired!"});
}
});

router.get("/:id", (req, res)=>{
    let token = req.headers.authorization.split(' ')[1];
    let decodedToken;
    if(!token){
        res.status(400).json({success: false, message: "Error! Token was not provided"});
    }
    try{
    decodedToken = jwt.verify(token, "mashup_secret_key");
    let showId = req.params.id;
    Show.findById(showId)
    .then(show=>{
        res.status(200).json({success: true, show});
    })
    .catch(error=>{
        res.status(400).json({success: false, errors: error})
    })
}
catch(error){
    res.status(400).json({message: "Token expired!"})
}
});

module.exports = router;