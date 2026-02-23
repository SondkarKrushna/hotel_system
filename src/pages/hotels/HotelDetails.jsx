import Layout from "../../components/layout/Layout";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    Users,
    Utensils,
    ShoppingCart,
    DollarSign,
} from "lucide-react";

import { useGetHotelByIdQuery } from "../../store/Api/hotelApi";

const StatBox = ({ icon: Icon, label, value }) => (
    <div className="border border-gray-100 rounded p-3 flex items-center gap-3 text-sm">
        <div className="w-8 h-8 flex items-center justify-center rounded bg-blue-100 text-[#24435d]">
            <Icon size={16} />
        </div>
        <div>
            <p className="text-gray-500 text-xs">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    </div>
);

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 bg-[#F5FAFF] p-3 rounded border border-gray-100">
        <div className="w-8 h-8 bg-[#24435d] text-white flex items-center justify-center rounded-full">
            <Icon size={16} />
        </div>
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-sm font-medium break-all">{value}</p>
        </div>
    </div>
);

const HotelDetails = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("staff");

    const { data, isLoading, isError } = useGetHotelByIdQuery(id, {
        skip: !id,
    });

    if (isLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen">
                    Loading...
                </div>
            </Layout>
        );
    }
    if (isError) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen text-red-500">
                    Failed to load hotel details
                </div>
            </Layout>
        );
    }

    const hotel = data || {};

    const staff = [];
    const menus = [];
    const orders = [];
    const customers = [];
    const revenue = 0;
    // console.log("hotel data==",hotel.data.phone)
    return (
        <Layout>
            <div className="bg-[#F2F8FF] min-h-screen p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* ================= LEFT SIDE ================= */}
                    <div className="col-span-12 lg:col-span-4 space-y-4">

                        {/* Hotel Profile Card */}
                        <div className="bg-[#24435d] text-white rounded p-6 text-center">
                            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-3 overflow-hidden">
                                <img
                                    src={hotel?.data?.image || "/images/hotel.jpg"}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h2 className="font-semibold text-lg">{hotel?.data?.name}</h2>
                            <p className="text-sm">Hotel ID: {hotel?.data?.hotelId}</p>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white p-4 rounded grid grid-cols-2 gap-3">
                            <StatBox icon={Users} label="Total Staff" value={staff.length} />
                            <StatBox icon={Utensils} label="Menus" value={menus.length} />
                            <StatBox icon={ShoppingCart} label="Orders" value={orders.length} />
                            <StatBox icon={DollarSign} label="Revenue" value={`₹ ${revenue}`} />
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white p-4 rounded space-y-3">
                            <h3 className="font-semibold">Contact Information</h3>
                            <InfoItem icon={Phone} label="Phone" value={hotel?.data?.phone} />
                            <InfoItem icon={Mail} label="Email" value={hotel?.data?.email} />
                            <InfoItem
                                icon={MapPin}
                                label="Address"
                                value={`${hotel?.data?.address || ""}, ${hotel?.data?.city || ""}, ${hotel?.data?.country || ""}`}
                            />                        </div>

                    </div>

                    {/* ================= RIGHT SIDE ================= */}
                    <div className="col-span-12 lg:col-span-8">

                        <div className="bg-white rounded-2xl shadow p-6">

                            {/* Tabs */}
                            <div className="flex gap-6 border-b pb-3 text-sm font-semibold">

                                {["staff", "menus", "orders", "revenue", "customers"].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-2 capitalize ${activeTab === tab
                                            ? "text-[#24435d] border-b-2 border-[#24435d]"
                                            : "text-gray-500"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}

                            </div>

                            {/* ================= TAB CONTENT ================= */}

                            <div className="mt-6">

                                {/* Staff */}
                                {activeTab === "staff" && (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {staff.map((emp, index) => (
                                            <div key={index} className="border p-4 rounded-lg">
                                                <p className="font-semibold">{emp.name}</p>
                                                <p className="text-sm text-gray-500">{emp.role}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Menus */}
                                {activeTab === "menus" && (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {menus.map((menu, index) => (
                                            <div key={index} className="border p-4 rounded-lg">
                                                <p className="font-semibold">{menu.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    ₹ {menu.price}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Orders */}
                                {activeTab === "orders" && (
                                    <div className="space-y-4">
                                        {orders.map((order, index) => (
                                            <div key={index} className="border p-4 rounded-lg">
                                                <p className="font-semibold">Order #{order.id}</p>
                                                <p className="text-sm text-gray-500">
                                                    ₹ {order.total}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Revenue */}
                                {activeTab === "revenue" && (
                                    <div className="text-center text-2xl font-bold text-green-600">
                                        Total Revenue: ₹ {revenue}
                                    </div>
                                )}

                                {/* Customers */}
                                {activeTab === "customers" && (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {customers.map((cust, index) => (
                                            <div key={index} className="border p-4 rounded-lg">
                                                <p className="font-semibold">{cust.name}</p>
                                                <p className="text-sm text-gray-500">{cust.phone}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default HotelDetails;