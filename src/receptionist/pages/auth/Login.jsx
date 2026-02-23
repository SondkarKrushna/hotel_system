import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../api/auth.api";

const ReceptionistLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // field errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      if (!data?.success) {
        setError(data?.message || "Invalid login credentials");
        return;
      }
      console.log("doctor data", data)

      const { token, user } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "doctor":
          navigate("/doctor/dashboard");
          break;
        case "receptionist":
          navigate("/receptionist/dashboard");
          break;
        default:
          navigate("/login");
      }
    },

    onError: (err) => {
      setError(
        err?.response?.data?.message ||
        "Login failed. Please try again later."
      );
    },
  });

  const validate = () => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    mutate({ email, password });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#3991ca] to-gray-100 px-4 py-10">
      <div className="w-full max-w-sm flex flex-col items-center justify-center">

        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6 text-center">
          Hospital Management System
        </h2>

        <div className="w-full bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

            {error && (
              <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
            )}

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              className={`w-full mb-5 px-3 py-2 border rounded focus:ring-2 ${emailError
                  ? "border-red-500 focus:ring-red-300"
                  : "focus:ring-[#3991ca]"
                }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
            />
            {emailError && (
              <p className="text-red-500 text-xs mb-2">{emailError}</p>
            )}

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              className={`w-full mb-1 px-3 py-2 border rounded focus:ring-2 ${passwordError
                  ? "border-red-500 focus:ring-red-300"
                  : "focus:ring-[#3991ca]"
                }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
            />
            {passwordError && (
              <p className="text-red-500 text-xs mb-2">{passwordError}</p>
            )}

            <div className="flex justify-between text-sm mb-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-1" />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-[#3991ca] hover:underline"
              >
                Forgot?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`w-full py-2 rounded text-white transition ${isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#3991ca] hover:bg-[#2f7fb3]"
                }`}
            >
              {isPending ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>

  );
};

export default ReceptionistLogin;
/*
Todays Updates:

Hospital Management Project-
- create Schedule Available Slots Apis like 
  - Get All Slots 
  - Add New Slot 
  - update Slot 
  - Delete Slot 
- Integrate this all Apis in frontend view 
- also display doctor available appoinments in same page
*/