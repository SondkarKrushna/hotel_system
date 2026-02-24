import { Routes, Route } from "react-router-dom";
import Login from "../../pages/Login";
import Register from "../Register";
import AdminDashboard from "../AdminDashboard";
import MyOrders from "../MyOrders";
import TotalRevenue from "../TotalRevenue"; 

const MainRoutes = () => {
  return (
    <Routes>
      <Route path = "/" element = {<Login />} />
      <Route path = "/register" element = {<Register />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="myorders" element={<MyOrders />} />
      <Route path="totalrevenue" element={<TotalRevenue />} />
    </Routes>
  );
};

export default MainRoutes;
