import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ShowListItem from "./showListItem";
import Navbar from "../navbar";
import checkAdmin from "../auth/checkAdmin";
import { useSelector } from "react-redux";

function ListShows(){
    var [allShows, setAllShows] = useState([]);
    let user = useSelector(store=>store.auth.user);

    // function handleSearchInput(event){
    //     event.preventDefault();
    //     setSearchTerm(event.target.value);
    // }
    // function handleSearch(event){
    //     event.preventDefault();
    //     axios.get('https://medicalstore.mashupstack.com/api/show/search?keyword=' + searchTerm,{
    //         headers:{"Authorization":"Bearer " + user.token}
    //     })
    //     .then((response)=>{
    //         if(searchTerm.trim() === ''){
    //             setFilteredShows(allShows);
    //         }else{
    //             setFilteredShows(response.data);
    //         }
    //     });
    // };
    function fetchShows(){
        if(user){
            axios.get("http://localhost:8080/show", {
            headers:{"Authorization":"Bearer " + user.token}
        })
        .then((response)=>{
            setAllShows(response.data.shows);
        });}
    }
    useEffect(()=>{
        fetchShows();
        
    }, [])
    return(
        <div>
            <Navbar></Navbar>
            <div className="container">
            <div className="row">
                <div className="col-12">
                    <h1 className="text-center my-3">Shows</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-8 offset-2">
                    {allShows.map(show=><ShowListItem key={show._id} show={show} refresh={fetchShows}/>)}
                </div>
            </div>
        </div>
        </div>

    )
}

export default checkAdmin(ListShows);