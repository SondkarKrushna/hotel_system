import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Layout from "../../../components/layout/Layout";
import { Input, Select, DateInput } from "../../../components/FormInputs";
import { addDoctor } from "../../api/doctor.api";
import { toast } from "react-toastify";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;

const AddDoctor = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    const defaultAvailability = days.map((day) => ({
        day,
        morning: [{ start: "", end: "" }],
        evening: [{ start: "", end: "" }],
    }));

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        specialization: "",
        dateOfBirth: "",
        gender: "",
        education: "",
        experience: "",
        description: "",
        location: "",
        isExternal: false,
        password: "",
        availabilitySchedule: defaultAvailability,
    });


    /* ================= VALIDATION ================= */
    const validate = (data) => {
        const err = {};

        if (!data.name.trim()) err.name = "Doctor name is required";

        if (!data.contact) err.contact = "Contact number is required";
        else if (!phoneRegex.test(data.contact))
            err.contact = "Enter valid 10 digit number";

        if (!data.email) err.email = "Email is required";
        else if (!emailRegex.test(data.email))
            err.email = "Invalid email address";

        if (!data.specialization) err.specialization = "Specialization is required";
        if (!data.gender) err.gender = "Gender is required";
        if (!data.dateOfBirth) err.dateOfBirth = "Date of birth is required";

        if (!data.education) err.education = "Education is required";
        if (!data.experience) err.experience = "Experience is required";

        if (!data.password || data.password.length < 6)
            err.password = "Password must be at least 6 characters";

        return err;
    };

    /* ================= MUTATION ================= */
    const createMutation = useMutation({
        mutationFn: addDoctor,
        onSuccess: () => {
            toast.success("Doctor added successfully ✅");
            navigate("/receptionist/doctors");
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Something went wrong");
        },
    });

    /* ================= HANDLERS ================= */
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    const handleAvailabilityChange = (dayIndex, session, field, value) => {
        setFormData((prev) => {
            const updated = [...prev.availabilitySchedule];

            updated[dayIndex][session] = value
                ? [{ ...updated[dayIndex][session][0], [field]: value }]
                : [];

            return { ...prev, availabilitySchedule: updated };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = validate(formData);
        setErrors(newErrors);

        if (Object.keys(newErrors).length !== 0) return;

        const payload = {
            ...formData,
            experience: Number(formData.experience),
            availabilitySchedule: formData.availabilitySchedule.map((d) => ({
                day: d.day,
                morning:
                    d.morning[0]?.start && d.morning[0]?.end
                        ? [{ start: d.morning[0].start, end: d.morning[0].end }]
                        : [],
                evening:
                    d.evening[0]?.start && d.evening[0]?.end
                        ? [{ start: d.evening[0].start, end: d.evening[0].end }]
                        : [],
            })),
        };

        //console.log("Doctor payload:", payload);
        createMutation.mutate(payload);
    };

    return (
        <Layout>
            <div className="bg-[#f5fbff] min-h-screen p-4 sm:p-6">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-lg font-semibold">Add Doctor</h1>
                    <p className="text-sm text-gray-500">Healthcare → Doctors</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl border border-gray-200">

                    <div className="border-b border-gray-200 px-6 py-4">
                        <h2 className="text-md font-semibold">Doctor Information</h2>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        <Input
                            label="Doctor Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                        />

                        <Input
                            label="Contact No"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            error={errors.contact}
                        />

                        <Input
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                        />

                        <Select
                            label="Gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            error={errors.gender}
                            options={["male", "female", "other"]}
                        />

                        <Input
                            label="Specialization"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            error={errors.specialization}
                        />

                        <DateInput
                            label="Date of Birth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            error={errors.dateOfBirth}
                        />

                        <Input
                            label="Education"
                            name="education"
                            value={formData.education}
                            onChange={handleChange}
                            error={errors.education}
                        />

                        <Input
                            label="Experience (Years)"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            error={errors.experience}
                        />

                        <Input
                            label="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                        />

                        <Input
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="md:col-span-2"
                        />

                        <div className="flex items-center gap-2 mt-6">
                            <input
                                type="checkbox"
                                name="isExternal"
                                checked={formData.isExternal}
                                onChange={handleChange}
                            />
                            <label className="text-sm">External Doctor</label>
                        </div>
                        {/* ===== Availability Schedule ===== */}
                        <div className="md:col-span-4 mt-4">
                            <h3 className="font-semibold text-sm mb-3">Doctor Availability</h3>

                            <div className="grid gap-3">
                                {formData.availabilitySchedule.map((item, index) => (
                                    <div
                                        key={item.day}
                                        className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-center bg-[#f5fbff] p-3 rounded-lg"
                                    >
                                        {/* Day */}
                                        <div className="font-medium capitalize sm:col-span-1">
                                            {item.day}
                                        </div>

                                        {/* Morning */}
                                        <Input
                                            label="Morning Start"
                                            type="time"
                                            value={item.morning[0]?.start || ""}
                                            onChange={(e) =>
                                                handleAvailabilityChange(index, "morning", "start", e.target.value)
                                            }
                                        />
                                        <Input
                                            label="Morning End"
                                            type="time"
                                            value={item.morning[0]?.end || ""}
                                            onChange={(e) =>
                                                handleAvailabilityChange(index, "morning", "end", e.target.value)
                                            }
                                        />

                                        {/* Evening */}
                                        <Input
                                            label="Evening Start"
                                            type="time"
                                            value={item.evening[0]?.start || ""}
                                            onChange={(e) =>
                                                handleAvailabilityChange(index, "evening", "start", e.target.value)
                                            }
                                        />
                                        <Input
                                            label="Evening End"
                                            type="time"
                                            value={item.evening[0]?.end || ""}
                                            onChange={(e) =>
                                                handleAvailabilityChange(index, "evening", "end", e.target.value)
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>


                        {/* Submit */}
                        <div className="md:col-span-4 flex justify-end mt-4">
                            <button
                                type="submit"
                                disabled={createMutation.isLoading}
                                className="bg-[#2D9AD8] text-white px-6 py-2 rounded-md hover:opacity-90 disabled:opacity-50"
                            >
                                {createMutation.isLoading ? "Adding..." : "+ Add Doctor"}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </Layout>
    );
};

export default AddDoctor;
