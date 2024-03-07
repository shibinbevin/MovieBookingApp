import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../navbar";
import { useSelector } from "react-redux";
import movieData from "../../assets/movie.data";
import checkAdmin from "../auth/checkAdmin";

function EditShow(){
    const params = useParams();
    const [movie, setMovie] = useState("");
    const [date, setDate] = useState("");
    const [timing, setTiming] = useState('');
    const [price, setPrice] = useState('');
    const [seats, setSeats] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const user = useSelector(store=>store.auth.user)
    const navigate = useNavigate();
    useEffect(()=>{
        if(user){
            axios.get("http://localhost:8080/show/" + params._id,{
            headers:{"Authorization":"Bearer " + user.token}
        })
        .then((response)=>{ 
            setMovie(response.data.movie);
            setDate(response.data.date);
            setTiming(response.data.timing);
            setPrice(response.data.price);
            setSeats(response.data.seats);
        })}
    }, [params.id, user])
    function updateShow(){
        axios.post("http://localhost:8080/admin/update/" + params._id,
        {
            movie: movie,
            date: date,
            timing: timing,
            price: price,
            seats: seats
        },{
            headers:{"Authorization":"Bearer " + user.token}
        })
        .then(response=>{
            alert(response.data.message);
            navigate('/admin/show');
        })
        .catch(error=>{
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
                    <div className="col-8">
                        <h1 className="text-center">Edit Show</h1>
                        {errorMessage ? <div className="alert alert-danger">{errorMessage}</div>: ''}
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="form-group">
                        <label>Movie </label>
                            <select className="form-control" value={movie} onChange={e=>{setMovie(e.target.value)}}>
                                <option>--select--</option>
                                {movieData.map(movie=>{
                                    return <option key={movie.Title} value={movie.Title}>{movie.Title}</option>
                                })}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="form-group">
                            <label>Date</label>
                            <input type="date" className="form-control" value={date} onChange={e=>{setDate(e.target.value)}}></input>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                            <label>Show Timing: </label>
                            <select className="form-control" value={timing} onChange={(e)=>setTiming(e.target.value)}>
                            <option>--select--</option>
                                <option key={"11:30"} value={"11:30"}>11:30</option>
                                <option key={"14:30"} value={"14:30"}>14:30</option>
                                <option key={"17:00"} value={"17:00"}>17:00</option>
                                <option key={"21:00"} value={"21:00"}>21:00</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Price: </label>
                            <input className="form-control" type="number" value={price} onChange={(e)=>setPrice(e.target.value)}></input>
                        </div>
                        <div className="form-group">
                            <label>Seats: </label>
                            <input className="form-control" type="number" value={seats} onChange={(e)=>setSeats(e.target.value)}></input>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <button className="btn btn-primary" onClick={updateShow}>Edit Show</button>
                            </div>
                        </div>
            </div>
        </div>
    )
}

export default checkAdmin(EditShow);