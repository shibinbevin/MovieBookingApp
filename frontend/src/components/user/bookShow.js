import { useEffect, useState } from "react";
import Navbar from "../navbar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import checkUser from "../auth/checkUser";

function BookShow(){
    const user = useSelector(store=>store.auth.user);
    const [show, setShow] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [totalAmount, setTotalAmount] = useState([]);
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const params = useParams();
    const navigate = useNavigate();

    useEffect(()=>{
        if(user){
            setEmail(user.userData.email)
        }
    },[user])
    const getCount = () => {
        let content = [];
        for (let i = 1; i <= 10; i++) {
          content.push(<option key={i} value={i}>{i}</option>);
        }
        return content;
      };
    useEffect(()=>{
        if(user){
        axios.get("http://localhost:8080/show/" + params._id,{ 
            headers:{"Authorization":"Bearer " + user.token}
    })
        .then(response=>{
            setShow(response.data.show)
        })
    }
    },[params._id, user])
    function calcAmount(e){
        setTickets(e.target.value);
        setTotalAmount(show.price * e.target.value);
      }
    function bookTickets(){
        axios.post("http://localhost:8080/user/booktickets/" + params._id,{
            tickets: tickets,
            amount: totalAmount,
            user_id: user.userData.userId,
            user_email: email
        },
        {
            headers:{"Authorization":"Bearer " + user.token}
        })
        .then((response)=>{
            console.log(response.data)
            navigate('/user/bookingConfirmation/' + response.data.bookingId)
            alert(response.data.message)
        })
        .catch(error=>{
            console.log(error.response.data)
            if(error.response.data.error){
                setErrorMessage(error.response.data.error);
            }
            else if(error.response.data.message){
                setErrorMessage(error.response.data.message);
            }else{
                setErrorMessage("Failed to connect to api")
            }
        })
    }
    return(
        <div>
            <Navbar></Navbar>
            <div className="container">
            <div className="row">
                <div className="col-12">
                    <h1 className="text-center my-3">{show.movie}</h1>
                    {errorMessage ? <div className="alert alert-danger">{errorMessage}</div>: ''}
                </div>
            </div>
            <div className="row">
                <div className="col-3">
                <label>Ticket Price: {show.price}</label>
                <div className="form-group">
                            <label>Email: </label>
                            <input className="form-control" type="text" value={email} onChange={(e)=>{setEmail(e.target.value)}}></input>
                        </div>
                <div className="form-group">
                            <label>Tickets: </label>
                            <select className="form-control" value={tickets} onChange={calcAmount}>
                                <option value={0}>--select--</option>
                                {getCount()}
                            </select>
                        </div>
                    <button className="btn btn-primary" onClick={bookTickets}>Pay Rs. {totalAmount}</button>
                </div>
            </div>
            </div>
        </div>
    )
}

export default checkUser(BookShow);