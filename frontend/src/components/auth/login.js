import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";
import checkGuest from "./checkGuest";
import { jwtDecode } from "jwt-decode";

function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let userData;

    function attemptLogin(){
        axios.post('http://localhost:8080/auth/login', {
            email: email,
            password: password
        })
        .then(response=>{
            userData = jwtDecode(response.data);
            setErrorMessage('');
            var user = {
                userData,
                token: response.data
            }
            dispatch(setUser(user));
            navigate('/')
        })
        .catch(error=>{
            if(error.response.data.errors){
                setErrorMessage(error.response.data.errors)
            }else if(error.response.data.message){
                setErrorMessage(error.response.data.message);
            }else{
                setErrorMessage("Failed to login. Please contact admin")
            }
            
        })
    }
    return(
        <div>
            <Navbar></Navbar>
            <div className="container">
                <div className="row">
                    <div className="col-8 offset-2">
                        <h1 className="text-center">Login</h1>
                        {errorMessage?<div className="alert alert-danger">{errorMessage}</div>:''}
                        <div className="form-group">
                            <label>Email</label>
                            <input className="form-control" type="text" value={email} onInput={e=>{setEmail(e.target.value)}}></input>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input className="form-control" type="password" value={password} onInput={e=>{setPassword(e.target.value)}}></input>
                        </div>
                        <button className="btn btn-primary" onClick={attemptLogin}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default checkGuest(Login);