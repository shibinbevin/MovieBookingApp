import { createBrowserRouter } from "react-router-dom";
import Register from "./components/auth/register";
import App from "./App";
import Login from "./components/auth/login";
import AddShow from "./components/admin/addShow";
import ListShow from "./components/admin/listShow";
import EditShow from "./components/admin/editShow";
import UserListShow from "./components/user/userListShow";
import BookShow from "./components/user/bookShow";
import BookingConfirmation from "./components/user/bookingConfirmation";

const router = createBrowserRouter([
    {path: "/", element: <App/>},
    {path: "/signup", element: <Register/>},
    {path: "/login", element: <Login/>},
    {path: "/admin/addshow", element: <AddShow/>},
    {path: "/admin/show", element: <ListShow/>},
    {path: "/admin/edit/:_id", element: <EditShow/>},
    {path: "/user/show", element: <UserListShow/>},
    {path: "/user/book/:_id", element: <BookShow/>},
    {path: "/user/bookingConfirmation/:bookingId", element: <BookingConfirmation/>}
])

export default router;