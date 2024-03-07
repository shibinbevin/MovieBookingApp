import axios from "axios";
import { Link } from "react-router-dom";
import checkUser from "../auth/checkUser";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import movieData from "../../assets/movie.data";

function UserShowListItem(props){
    const [date, setDate] = useState(null)
    const [movie, setMovie] = useState(null)
    const user = useSelector(store=>store.auth.user);

    useEffect(()=>{
        let dateObj = new Date(props.show.date)
        setDate(dateObj.toLocaleDateString())
        // setDate(Date(props.show.date).toLocaleDateString())
    },[props.show.date])

    useEffect(()=>{
        var filteredMovie = movieData.filter((movie)=>{
            return movie.Title === props.show.movie
        })
        console.log(filteredMovie)
        setMovie((movie)=>({
        ...filteredMovie
    }))
    }, [props.show.movie])
    // useEffect(()=>{
    //     var updatedStatus;
    //     if(props.show.status === "enabled"){
    //         updatedStatus = {"name":"Disable", "class":"secondary", "value":"disabled"};
    //     }else{
    //         updatedStatus = {"name":"Enable", "class":"success", "value":"enabled"};
    //     }
    //     setStatus(status=>({
    //         ...updatedStatus
    //     }))
    // },[props.show.status])
    // function changeStatus(){
    //     axios.post("http://localhost:8080/admin/updatestatus/" + props.show._id,{
    //         status: status.value
    //     })
    //     .then((response)=>{
    //         // alert(response.data.message);
    //         props.refresh();
    //     })
    //     .catch(error=>{
    //         console.log(error);
    //     })
    // }
    // function deleteShow(){
    //     axios.delete("http://localhost:8080/admin/delete/" + props.show._id,{
    //         headers:{"Authorization":"Bearer " + user.token}
    //     })
    //     .then((response)=>{
    //         alert(response.data.message);
    //         props.refresh();
    //     })
    //     .catch(error=>{
    //         console.log(error);
    //     })
    // }
    return(
        <div className="col col-12 col-sm-6 col-mg-4 col-lg-3 col-xl-3 col-xxl-3">
        <div className="card mx-3 mb-4" style={{ width: "18vdw"}}>
            {movie &&
            <img class="card-img-top" style={{ height: "50dvh"}} src={movie[0].Poster} alt="Loading..."></img>
            }
        <div className="card-body">
        <h5 className="card-title">
            {props.show.movie}
            </h5>
            <p className="card-text">Date: {date}</p>
            <p className="card-text">Timing: {props.show.timing}</p>
            <p className="card-text">Tickets Left: {props.show.seats}</p>
            <Link to={"/user/book/" + props.show._id} className="btn btn-primary float-right mr-2">Book</Link>
        </div>
        </div>
        </div>
    )   
}

export default checkUser(UserShowListItem);