const mongoose = require("mongoose");

let bookingSchema = mongoose.Schema({
    bookingId: {
        type: String, 
        required: true
    },
    movie: {
        type: String, 
        required: true
    },
    date: {
        type: String,
        required: true
    },
    timing: {
        type: String,
        required: true,
        enum: ["11:30", "14:30", "17:00", "21:00" ]
    },
    tickets:{
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    user_email: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Booking", bookingSchema);