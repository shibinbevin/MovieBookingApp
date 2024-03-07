import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import checkUser from "../auth/checkUser";

const { default: Navbar } = require("../navbar");

function BookingConfirmation(){
    const {bookingId} = useParams();
    const [bookingDetails, setBookingDetails] = useState([]);
    useEffect(()=>{
        axios.get("http://localhost:8080/user/booking/" + bookingId)
        .then((response)=>{
            console.log(response);
            setBookingDetails(response.data.bookingDetails);
        })
    },[bookingId])
    return(
        <div>
            <Navbar/>
            <div className="container mt-5">
                <div className="row">
                    <div className="col">
                        <div className="card">
                        <div className="card-body">
                        <h2 className="mb-4">Booking Confirmation</h2>
         <div className="mb-3">
            <strong>Booking Id:</strong> {bookingDetails.bookingId}
        </div>
         <div className="mb-3">
            <strong>Movie:</strong> {bookingDetails.movie}
        </div>
        <div className="mb-3">
            <strong>Date:</strong> {bookingDetails.date}
        </div>
        <div className="mb-3">
            <strong>Time:</strong> {bookingDetails.timing}
        </div>
        <div className="mb-3">
            <strong>Seats:</strong> {bookingDetails.tickets}
        </div>
        <div className="mb-3">
            <strong>Total Price:</strong> Rs.{bookingDetails.amount}
        </div>
      <p>Thank you for booking with us!</p>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default checkUser(BookingConfirmation);