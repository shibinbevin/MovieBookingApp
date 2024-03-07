import { useSelector } from "react-redux";
import Navbar from "./components/navbar";
import { useState } from "react";

function App(){
  const user = useSelector(store=>store.auth.user)

  return(
    <div>
      <Navbar/>
      {user?
      <h1>Hello {user.userData.name}</h1>
    : null
    }
      
    </div>
  );
}

export default App;