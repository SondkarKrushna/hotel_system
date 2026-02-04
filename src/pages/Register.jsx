import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiDish } from "react-icons/bi";
import { CiUser, CiLock } from "react-icons/ci";
import { SlEnvolope } from "react-icons/sl";
import { RiHotelLine } from "react-icons/ri";
import { MdOutlineLocalPhone } from "react-icons/md";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState({});

    const navigate = useNavigate();

    const strongPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    const handleSubmit = (e) => {
        e.preventDefault();

        let newErrors = {};

        if (!e.target.name.value.trim()) {
            newErrors.name = "Name is required";
        }

        if (!e.target.email.value.trim()) {
            newErrors.email = "Email is required";
        }

        if (!e.target.hotel.value.trim()) {
            newErrors.hotel = "Hotel Name is required";
        }

        if (!e.target.phone.value.trim()) {
            newErrors.phone = "Phone number is required";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
        } else if (!strongPassword.test(password)) {
            newErrors.password =
                "Password must include uppercase, lowercase, number and symbol.";
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Confirm Password is required";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Password and confirm password do not match.";
        }

        setError(newErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log("Form submitted successfully ✅");

            // ✅ Redirect to dashboard
            navigate("/dashboard");
        }
    };



    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">

            {/*MOBILE TOP DESIGN*/}
            <div className="lg:hidden bg-gradient-to-br from-slate-900 via-slate-800 to-orange-400 text-white text-center pt-16 pb-20 rounded-bl-4xl">
                <div className="flex justify-center mb-4">
                    <BiDish className="text-5xl" />
                </div>
                <h1 className="text-2xl font-bold">Create Account</h1>
                <p className="text-gray-200 mt-1">Join our management system.</p>
            </div>

            {/*DESKTOP LEFT SIDE*/}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-400 text-white flex-col justify-center items-center p-10">
                <h1 className="text-4xl font-bold mb-3">Create Account</h1>
                <p className="text-gray-200 text-lg">
                    Join our management system.
                </p>
            </div>

            {/*FORM SECTION*/}
            <div className="flex-1 flex justify-center items-start lg:items-center px-4 -mt-10 lg:mt-0">

                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-5 lg:p-6">

                    <h2 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6">
                        Register Your Account
                    </h2>

                    <form className="space-y-3" onSubmit={handleSubmit}>

                        {/* Name */}
                        <div>
                            <label className="text-xs text-gray-600">Name <span className="text-red-500">*</span></label>
                            <div className="relative mt-1">
                                <CiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    className={`w-full border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-slate-700 
                                    ${error.name ? "border-red-500" : "border-gray-300"}`}
                                />
                            </div>
                            {error.name && (
                                <p className="text-red-500 text-xs mt-1">{error.name}</p>
                            )}

                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-xs text-gray-600">Email <span className="text-red-500">*</span></label>
                            <div className="relative mt-1">
                                <SlEnvolope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    className={`w-full border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-slate-700 
                                    ${error.name ? "border-red-500" : "border-gray-300"}`}
                                />
                            </div>
                            {error.email && (
                                <p className="text-red-500 text-xs mt-1">{error.email}</p>
                            )}

                        </div>

                        {/* Hotel Name */}
                        <div>
                            <label className="text-xs text-gray-600">Hotel Name <span className="text-red-500">*</span></label>
                            <div className="relative mt-1">
                                <RiHotelLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                                <input
                                    type="text"
                                    name="hotel"
                                    placeholder="Enter your hotel name"
                                    className={`w-full border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-slate-700 
                                    ${error.name ? "border-red-500" : "border-gray-300"}`}
                                />
                            </div>
                            {error.hotel && (
                                <p className="text-red-500 text-xs mt-1">{error.hotel}</p>
                            )}

                        </div>

                        {/* Phone */}
                        <div>
                            <label className="text-xs text-gray-600">Phone <span className="text-red-500">*</span></label>
                            <div className="relative mt-1">
                                <MdOutlineLocalPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Enter your phone number"
                                    className={`w-full border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-slate-700 
                                    ${error.name ? "border-red-500" : "border-gray-300"}`}
                                />
                            </div>
                            {error.phone && (
                                <p className="text-red-500 text-xs mt-1">{error.phone}</p>
                            )}

                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-xs text-gray-600">Password <span className="text-red-500">*</span></label>
                            <div className="relative mt-1">

                                <CiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    name="password"
                                    placeholder="Enter your password"
                                    className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 text-sm focus:outline-none focus:border-slate-700"
                                />

                                {showPassword ? (
                                    <IoEyeOutline
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl cursor-pointer"
                                        onClick={() => setShowPassword(false)}
                                    />
                                ) : (
                                    <IoEyeOffOutline
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl cursor-pointer"
                                        onClick={() => setShowPassword(true)}
                                    />
                                )}

                            </div>
                            {error.password && (
                                <p className="text-red-500 text-xs mt-1">{error.password}</p>
                            )}

                        </div>


                        {/* Confirm Password */}
                        <div>
                            <label className="text-xs text-gray-600">Confirm Password <span className="text-red-500">*</span></label>
                            <div className="relative mt-1">

                                <CiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    name="confirmPassword"
                                    placeholder="Re-Enter Password"
                                    className={`w-full border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-slate-700 
                                    ${error.name ? "border-red-500" : "border-gray-300"}`}
                                />

                                {showPassword ? (
                                    <IoEyeOutline
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl cursor-pointer"
                                        onClick={() => setShowPassword(false)}
                                    />
                                ) : (
                                    <IoEyeOffOutline
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl cursor-pointer"
                                        onClick={() => setShowPassword(true)}
                                    />
                                )}

                            </div>
                            {error.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">{error.confirmPassword}</p>
                            )}

                        </div>


                        {/* Error Message */}
                        {/* {error && (
                            <p className="text-red-500 text-xs">{error}</p>
                        )} */}

                        {/* Register Button */}
                        <button
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg text-sm shadow-md transition duration-300 pt-2 mt-4"
                        >
                            Register
                        </button>

                        <p className="text-center text-xs text-gray-600">
                            Already have an account?{" "}
                            <span
                                className="font-semibold text-slate-900 cursor-pointer"
                                onClick={() => navigate("/")}
                            >
                                Login
                            </span>
                        </p>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
