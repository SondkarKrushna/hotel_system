import { Routes, Route } from "react-router-dom";
import Login from "../../pages/Login";
import Register from "../Register";
import AdminDashboard from "../AdminDashboard";
import MyOrders from "../MyOrders";
import TotalRevenue from "../TotalRevenue"; 
import Hotels from "../hotels/Hotels";
import Employees from "../employee/Employees";
import Users from "../users/Users";
import Dishes from "../dishes/Dishes"
import Categories from "../Categories";

const MainRoutes = () => {
  return (
    <Routes>
      <Route path = "/" element = {<Login />} />
      <Route path = "/register" element = {<Register />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="myorders" element={<MyOrders />} />
      <Route path="totalrevenue" element={<TotalRevenue />} />
      <Route path="allhotels" element={<Hotels />} />
      <Route path="employee" element={<Employees />} />
      <Route path="users" element={<Users />} />
      <Route path="dishes" element={<Dishes />} />
      <Route path="category" element={<Categories />} />
    </Routes>
  );
}; 

export default MainRoutes;
