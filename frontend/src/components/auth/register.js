import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../navbar";
import checkGuest from "./checkGuest";

function Register(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage , setErrorMessage] = useState('');
    const navigate = useNavigate();
    var registerUser = (event)=>{
        var user = {
            name: name,
            email: email,
            password: password
        }
        axios.post("http://localhost:8080/auth/signup", user)
        .then(response=>{
            setErrorMessage("");
            navigate("/login");
        })
        .catch(error=>{
            console.log(error)
            if(error.response.data){
                console.log(error.response.data)
                setErrorMessage(error.response.data.join(' '));
            }else if(error.response.data.message){
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
                    <div className="col-8 offset-2">
                        <h1 className="text-center">Register</h1>
                        {errorMessage ? <div className="alert alert-danger">{errorMessage}</div>: ''}
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" className="form-control" value={name} onInput={(e)=>{setName(e.target.value)}}></input>
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="text" className="form-control" value={email} onInput={(e)=>{setEmail(e.target.value)}}></input>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" className="form-control" value={password} onInput={(e)=>{setPassword(e.target.value)}}></input>
                        </div>
                        <button className="btn btn-primary" onClick={registerUser}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default checkGuest(Register);