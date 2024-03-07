import axios from "axios";
import { Link } from "react-router-dom";
import checkAdmin from "../auth/checkAdmin";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function ShowListItem(props){
    const [date, setDate] = useState(null)
    const [status, setStatus] = useState({})
    const user = useSelector(store=>store.auth.user);
    var updatedStatus;
    useEffect(()=>{
        let dateObj = new Date(props.show.date)
        setDate(dateObj.toLocaleDateString())
        // setDate(Date(props.show.date).toLocaleDateString())
    },[props.show.date])
    useEffect(()=>{
        if(props.show.status === "enabled"){
            updatedStatus = {"name":"Disable", "class":"secondary", "value":"disabled"};
        }else{
            updatedStatus = {"name":"Enable", "class":"success", "value":"enabled"};
        }
        setStatus(status=>({
            ...updatedStatus
        }))
    },[props.show.status])
    function changeStatus(){
        axios.post("http://localhost:8080/admin/updatestatus/" + props.show._id,{
            status: status.value
        },
        {
            headers:{"Authorization":"Bearer " + user.token}
        })
        .then((response)=>{
            // alert(response.data.message);
            props.refresh();
        })
        .catch(error=>{
            console.log(error);
        })
    }
    function deleteShow(){
        axios.delete("http://localhost:8080/admin/delete/" + props.show._id,{
            headers:{"Authorization":"Bearer " + user.token}
        })
        .then((response)=>{
            alert(response.data.message);
            props.refresh();
        })
        .catch(error=>{
            console.log(error);
        })
    }
    return(
        <div className="card mb-2">
        <div className="card-body">
        <h5 className="card-title">
            {props.show.movie}
            </h5>
            <p className="card-text">Date: {date}</p>
            <p className="card-text">Timing: {props.show.timing}</p>
            <p className="card-text">Seats: {props.show.seats}</p>
            <p className="card-text">Status: {props.show.status}</p>
            <button className={"btn btn-danger float-right mr-2"} onClick={deleteShow}>Delete</button>
            <button className={"btn btn-" + (status.class) + " float-right mr-2"} onClick={changeStatus}>{status.name}</button>
            <Link to={"/admin/edit/" + props.show._id} className="btn btn-primary float-right mr-2">Edit</Link>
        </div>
        </div>
    )   
}

export default checkAdmin(ShowListItem);