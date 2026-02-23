import Layout from "../../../components/layout/Layout";
import ProfileCard from "../../../components/cards/ProfileCard";
import PrimaryButton from "../../../components/buttons/PrimaryButton";
import { Plus, Eye } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { doctorData } from "../../api/doctor.api";

const Doctors = () => {
  const location = useLocation();

  const isDoctor = location.pathname.startsWith("/doctor");
  const basePath = isDoctor ? "/doctor" : "/receptionist";

  const {
    data: doctors = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: doctorData,
  });

  return (
    <Layout>
      <div className="bg-[#f5fbff] min-h-screen p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold">Doctors</h1>
            <p className="text-xs text-gray-500">Healthcare &gt; Doctors</p>
          </div>

          {!isDoctor && (
            <div className="flex gap-3">
              <a href="/receptionist/add-doctors">
              <PrimaryButton icon={Plus} bgcolor="bg-[#2D9AD8] text-white">
                Add External Doctor
              </PrimaryButton>
              </a>

              <PrimaryButton icon={Eye} bgcolor="bg-[#04C53B2B] text-[#2C7E00]">
                View External Doctors
              </PrimaryButton>
            </div>
          )}
        </div>

        {isLoading && (
          <p className="text-center text-gray-500">Loading doctors...</p>
        )}

        {isError && (
          <p className="text-center text-red-500">
            Failed to load doctors.
          </p>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {doctors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 w-full col-span-full">
                <img
                  src=".././images/nodata.png"
                  alt="No data"
                  className="w-52 mb-4 opacity-80"
                />
                <p className="text-lg font-semibold text-black">
                  "No doctors found"
                </p>
              </div>
             
            ) : (
              doctors.map((item) => (
                <ProfileCard
                  key={item._id}
                  type="doctor"
                  idLabel="Doctor ID"
                  idValue={item.UID}
                  image={item.image || "/images/doctor.png"}
                  name={item.name}
                  subtitle={item.specialization}
                  leftLabel="Experience"
                  leftValue={item.experience}
                  rightLabel="Patients"
                  rightValue={item.assignedPatientsCount}
                  profileId={item._id}
                  //profileLink={`${basePath}/doctor-details/${item._id}`}
                  email={item.email}
                  phone={item.contact}
                />
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Doctors;
