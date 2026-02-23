import { Routes, Route } from "react-router-dom";
import Login from "../../pages/Login";
import Register from "../Register";
import AdminDashboard from "../AdminDashboard";
import MyOrders from "../MyOrders";
import TotalRevenue from "../TotalRevenue"; 
<<<<<<< HEAD
import Hotels from "../hotels/Hotels";
import Employees from "../employee/Employees";
import Dishes from "../dishes/Dishes"
import Categories from "../Categories";
import HotelDetails from "../hotels/HotelDetails";
=======
>>>>>>> 8d7bf0b0f71c57eb9a06e99423c7a209f8f1c5d7

const MainRoutes = () => {
  return (
    <Routes>
      <Route path = "/" element = {<Login />} />
      <Route path = "/register" element = {<Register />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="myorders" element={<MyOrders />} />
      <Route path="totalrevenue" element={<TotalRevenue />} />
      <Route path="allhotels" element={<Hotels />} />
      <Route path="staff" element={<Employees />} />
      <Route path="dishes" element={<Dishes />} />
      <Route path="category" element={<Categories />} />
      <Route path="hotelDetails/:id" element={<HotelDetails />} />    </Routes>
  );
}; 

export default MainRoutes;
