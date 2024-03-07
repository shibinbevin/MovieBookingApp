const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const mailer = require('express-mailer');
const path = require('path');

require('dotenv').config({ path: 'E:/MovieBooking/backend/.env' });

console.log("Environment variables:", process.env.connection_string);

mongoose.connect(process.env.connection_string)
.then(()=>{
    console.log("connected to mongodb")
})
.catch(error=>{
    console.log(error);
})

const app = express();
app.use(cors());

app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({extended: true}))

mailer.extend(app, {
    from: process.env.email_id,
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
      user: process.env.email_id,
      pass: process.env.passkey
    }
});


const auth = require("./routes/auth");
app.use("/auth", auth);

const admin = require("./routes/admin");
app.use("/admin", admin);

const shows = require("./routes/shows");
app.use("/show", shows);

const user = require("./routes/user");
app.use("/user", user);

app.listen(8080, function(){
    console.log("server started on port 8080")
})