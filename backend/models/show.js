const mongoose = require("mongoose");

let showSchema = mongoose.Schema({
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
    price:{
        type: Number,
        required: true
    },
    seats: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['enabled', 'disabled']
    }
})

module.exports = mongoose.model("Show", showSchema);