import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { removeUser } from "../store/authSlice";
import { useEffect, useState } from "react";


function Navbar() {
    const user = useSelector(store=>store.auth.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ role, setRole] = useState(null)

    useEffect(()=>{
        if(user){
            if(user.userData.role === "admin"){
                setRole("admin")
            }else if(user.userData.role === "user"){
                setRole("user")
            }
    }
    },[user])

    function logout(){
        if(user){
            axios.post("http://localhost:8080/auth/logout", {},{
            headers:{"Authorization":"Bearer " + user.token}
        });
        dispatch(removeUser());
        navigate("/login")
        }
    }
    return <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <div className="navbar-brand">
            <h4>Movie Booking App</h4>
        </div>
        <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        >
            <span className="navbar-toggler-icon"></span>
        </button>
        <div
        className="collapse navbar-collapse mr-auto"
        id="navbarNav"
        style={{ float: "left" }}
        >
            <ul className="navbar-nav ml-auto" style={{ color: "#ffffff" }}>
                <li className="nav-item">
                <NavLink to={"/"} className={ 'nav-link '+(status => status.isActive ? 'active' : '')}>
                    Home
                </NavLink>
                </li>
                {!user &&
                <>
                <li className="nav-item">
                <NavLink to={"/signup"} className={ 'nav-link '+(status => status.isActive ? 'active' : '')}>
                    Sign Up
                </NavLink>
                </li>
                <li className="nav-item">
                <NavLink to={"/login"} className={ 'nav-link '+(status => status.isActive ? 'active' : '')}>
                    Login
                </NavLink>
                </li>
                </>
                }
                {role === "admin" &&
                <>
                <li className="nav-item">
                <NavLink to={"/admin/addshow"} className={ 'nav-link '+(status => status.isActive ? 'active' : '')}>
                    Add Show
                </NavLink>
                </li>
                <li className="nav-item">
                <NavLink to={"/admin/show"} className={ 'nav-link '+(status => status.isActive ? 'active' : '')}>
                    Shows
                </NavLink>
                </li>
                </>
                }
                {role === "user" &&
                <li className="nav-item">
                <NavLink to={"/user/show"} className={ 'nav-link '+(status => status.isActive ? 'active' : '')}>
                    Book Show
                </NavLink>
                </li>
                }
                {user &&
                <>
                <li className="nav-item">
                <span className="nav-link" onClick={logout}>Logout</span>
                </li>
                </>
                }
            </ul>
        </div>
    </nav>;
}

export default Navbar;