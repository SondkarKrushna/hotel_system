import {
  Phone,
  Mail,
  Calendar,
  User,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { ChevronDown } from "lucide-react";
import Layout from "../../../components/layout/Layout";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { doctorById } from "../../api/doctor.api";

export default function DoctorDetails() {
  const { id } = useParams();
  const [aboutOpen, setAboutOpen] = useState(true);

  const { data: doctor = {}, isLoading, isError, error } = useQuery({
    queryKey: ["doctor-details", id],
    queryFn: () => doctorById(id),
    enabled: !!id,
  });

  // Color mapping for different days
  const getDayColors = (day) => {
    const dayLower = day?.toLowerCase();
    const colorMap = {
      monday: { bg: "", badge: "bg-red-100 text-red-600" },
      tuesday: { bg: "", badge: "bg-orange-100 text-orange-600" },
      wednesday: { bg: "", badge: "bg-yellow-100 text-yellow-600" },
      thursday: { bg: "", badge: "bg-green-100 text-green-600" },
      friday: { bg: "", badge: "bg-blue-100 text-blue-600" },
      saturday: { bg: "", badge: "bg-purple-100 text-purple-600" },
      sunday: { bg: "", badge: "bg-pink-100 text-pink-600" },
    };
    return colorMap[dayLower] || { bg: "bg-gray-50", badge: "bg-gray-100 text-gray-600" };
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">Loading doctor details...</div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="p-6 text-red-500">
          Error loading doctor details: {error?.message}
        </div>
      </Layout>
    );
  }

  if (!doctor?._id) {
    return (
      <Layout>
        <div className="p-6">No doctor found</div>
      </Layout>
    );
  }

  const infoList = [
    { label: "Contact No", value: doctor?.contact || "-", icon: Phone },
    { label: "Email ID", value: doctor?.email || "-", icon: Mail },
    {
      label: "Date of Birth",
      value: doctor?.dateOfBirth
        ? new Date(doctor.dateOfBirth).toLocaleDateString()
        : "-",
      icon: Calendar,
    },
    { label: "Gender", value: doctor?.gender || "-", icon: User },
    { label: "Education", value: doctor?.education || "-", icon: GraduationCap },
    {
      label: "Experience",
      value: `${doctor?.experience ?? 0}+ Years`,
      icon: Briefcase,
    },
  ];

  return (
    <Layout>
      <div className="bg-blue-50 min-h-screen p-4 sm:p-6">
        {/* Breadcrumb */}
        <div className="flex justify-between">
          <p className="text-sm text-gray-500 mb-3">
            Healthcare &gt; Doctors
          </p>

          <div className="flex items-center gap-3 mb-3">
            <button className="text-sm text-gray-500 hover:text-blue-600">
              ← Back to Doctors
            </button>

            <button className="bg-[#2D9AD9] text-white text-sm px-4 py-1.5 rounded-md">
              All Patients
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 border border-blue-100">
          <h2 className="font-semibold mb-6 text-lg">Doctor Details</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT CARD */}
            <div className="border border-blue-100 rounded-xl p-4 bg-white space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={doctor?.image || "/images/doctor.png"}
                  alt={doctor?.name || "Doctor"}
                  className="w-14 h-14 rounded-lg object-cover"
                />

                <div>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                    #{doctor?.UID || "0000"}
                  </span>

                  <h3 className="font-semibold mt-1">
                    {doctor?.name || "-"}
                  </h3>

                  <p className="text-xs text-gray-500">
                    {doctor?.specialization || "-"}
                  </p>
                </div>
              </div>

              <hr />

              <div className="space-y-3 text-sm">
                {infoList.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex justify-between gap-8"
                    >
                      <div className="flex items-center gap-2 text-black">
                        <Icon className="w-4 h-4 font-semibold" />
                        <span>{item.label}</span>
                      </div>

                      <span className="font-normal">
                        {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="lg:col-span-2 space-y-6">
              {/* ABOUT */}
              <div className="border border-blue-100 rounded-xl p-4 bg-white">
                <div
                  className="flex justify-between cursor-pointer"
                  onClick={() => setAboutOpen(!aboutOpen)}
                >
                  <h3 className="font-semibold">About</h3>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      aboutOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {aboutOpen && (
                  <p className="text-sm text-gray-600 mt-3">
                    {doctor?.description || "No description available"}
                  </p>
                )}
              </div>

              {/* AVAILABILITY */}
              <div className="border border-blue-100 rounded-xl p-4 bg-white">
                <h3 className="font-semibold mb-4">
                  Availability Schedule
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {doctor?.availabilitySchedule?.length > 0 ? (
                    doctor.availabilitySchedule.map((day) => {
                      const colors = getDayColors(day.day);
                      return (
                        <div
                          key={day._id}
                          className={`${colors.bg} border flex justify-center rounded-lg p-3 space-y-3`}
                        >
                          <span className={`text-xs font-semibold capitalize ${colors.badge} px-2 py-1  mt-2 mr-3 rounded`}>
                            {day.day}
                          </span>

                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <p className="font-medium text-gray-700">
                                Morning
                              </p>
                              {day.morning?.length > 0 ? (
                                day.morning.map((m) => (
                                  <p key={m._id}>
                                    {m.start} - {m.end}
                                  </p>
                                ))
                              ) : (
                                <p>—</p>
                              )}
                            </div>

                            <div>
                              <p className="font-medium text-gray-700">
                                Evening
                              </p>
                              {day.evening?.length > 0 ? (
                                day.evening.map((e) => (
                                  <p key={e._id}>
                                    {e.start} - {e.end}
                                  </p>
                                ))
                              ) : (
                                <p>—</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500">No schedule available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>  
      </div>
    </Layout>
  );
}