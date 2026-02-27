import { Routes, Route } from "react-router-dom";
import Login from "../../pages/Login";
import Register from "../Register";
import AdminDashboard from "../AdminDashboard";
import MyOrders from "../MyOrders";
import TotalRevenue from "../TotalRevenue"; 
import Hotels from "../hotels/Hotels";
import Employees from "../employee/Employees";
import Dishes from "../dishes/Dishes"
import Categories from "../Categories";
import HotelDetails from "../hotels/HotelDetails";
import EmployeeDetails from "../employee/EmployeeDetails";

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
      <Route path="hotelDetails/:id" element={<HotelDetails />} />
      <Route path="staff/staffdetails/:id" element={<EmployeeDetails />} />
      </Routes>
  );
}; 

export default MainRoutes;
