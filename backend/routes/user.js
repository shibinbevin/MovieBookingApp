const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken")
const {body, validationResult} = require('express-validator');

const Show = require('../models/show')
const Booking = require('../models/booking')

router.post("/booktickets/:_id", [
    body("user_email").notEmpty().withMessage("Email Id is required. ")
], async (req, res)=>{
    let token = req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(400).json({success: false, message: "Error! Token was not provided"})
    }
    try{
    let decodedToken = jwt.verify(token, "mashup_secret_key");
    }
    catch(error){
        return res.status(400).json({message: "Token expired"});
    }
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        let error = errors.errors.map(err=>{
            return err.msg;
        })
        return res.status(400).json({success: false, error})
    }

    const bookingId = Math.random().toString(36).substring(2,10);   //code to generate bookingId
    
    const {tickets, amount, user_id, user_email} = req.body;
    let query = {_id: req.params._id};
    var existingShow;
    existingShow = await Show.findOne(query)
    if(!existingShow){
        return res.status(400).json({success: false, message: "Show not found"})
    }
    let seats = existingShow.seats - tickets;
    if(seats < 0){
        return res.status(400).json({success: false, message: "Not enough tickets left"})
    }
    Show.updateOne(query, {seats: seats})
    .catch(error=>{
        res.status(400).json(error)
    })
    let booking = new Booking({
        bookingId: bookingId,
        movie: existingShow.movie,
        date: existingShow.date,
        timing: existingShow.timing,
        tickets: tickets,
        amount: amount,
        user_id: user_id,
        user_email: user_email
    })
    booking.save()
    .then(()=>{
        // res.status(200).json({success: true, message: "Tickets Booked", bookingId})
        res.mailer.send('email',{
            to: user_email,
            subject: "Booking Confirmation",
            bookingId: bookingId, 
            movie: existingShow.movie,
            date: existingShow.date,
            timing: existingShow.timing,
            tickets: tickets,
            amount: amount
        },
        function(err){
            if(err){
                console.log(err);
                return res.status(400).json({success: false, err, message: "There was an error sending the email"})
            }
            res.status(200).json({success: true, message: "Tickets Booked" , bookingId})
        });
    })
    .catch(error=>{
        console.log(error)
        return res.status(400).json({success: false, error})
    })
});

router.get("/booking/:bookingId", (req, res)=>{
    let query = {bookingId: req.params.bookingId};
    Booking.findOne(query)
    .then((bookingDetails)=>{
        res.status(200).json({success: true, bookingDetails})
    })
    .catch(error=>{
        res.status(400).json({success: false, error})
    })
})

module.exports = router;