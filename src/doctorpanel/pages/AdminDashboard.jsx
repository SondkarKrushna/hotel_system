import Layout from "../../components/layout/Layout";
import StatCard from "../../components/cards/StatCard";
import AppointmentsTable from "../../components/table/AppointmentsTable";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import { FaFileInvoice, FaCalendarAlt } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getDoctorDashboard } from "../api/dashboard.api";

const Dashboard = () => {
  // doctorId from redux/localStorage
const user = JSON.parse(localStorage.getItem("user"));
  const doctorId = user?.doctorId;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["doctor-dashboard", doctorId],
    queryFn: () => getDoctorDashboard(doctorId),
    enabled: !!doctorId,
  });

  const dashboardData = data?.data;

  const stats = [
    {
      title: "Today’s Appointments",
      value: dashboardData?.todaysAppointments || 0,
      subtitle: "+3 from yesterday",
      img: ".././images/calendar.png",
      bg: "#EAF0FE",
    },
    {
      title: "Pending Approvals",
      value: dashboardData?.pendingApprovals || 0,
      subtitle: "Requires Attention",
      img: ".././images/time.png",
      bg: "#FEF5E6",
    },
    {
      title: "Patients in Queue",
      value: dashboardData?.patientsInQueue || 0,
      subtitle: "Currently waiting",
      img: ".././images/mdi_users.png",
      bg: "#EDD5FF",
    },
    {
      title: "Completed Consultation",
      value: dashboardData?.completedConsultation || 0,
      subtitle: "This Week",
      img: ".././images/check.png",
      bg: "#E7F8F2",
    },
    {
      title: "Weekly Earnings",
      value: `$${dashboardData?.weeklyEarnings || 0}`,
      subtitle: "+3 from yesterday",
      img: ".././images/dollor.png",
      bg: "#F3EEFE",
    },
  ];

  const appointments =
  dashboardData?.todaysAppointmentList?.map((item) => {
    const patient = item.patientData?.[0]; // first object from array

    return {
      initials: patient?.patientName
        ? patient.patientName
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
        : "NA",

      name: patient?.patientName || "Unknown",
      type: patient?.disease || "N/A",

      time: `${patient?.time || ""} . ${new Date(item.appointmentDate).toLocaleDateString(
        "en-GB"
      )}`,

      status: item.status || "pending",
    };
  }) || [];


  if (isLoading) {
    return (
      <Layout>
        <div className="p-5 text-lg font-semibold">Loading dashboard...</div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="p-5 text-red-500 font-semibold">
          Failed to load dashboard data!
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((item, i) => (
          <StatCard key={i} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments Table */}
        <div className="lg:col-span-2">
          <AppointmentsTable data={appointments} />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 grid grid-cols-1 space-y-3">
          <h2 className="font-semibold mb-2">Quick Actions</h2>
          <h2 className="text-[15px] text-[#1E1E1E80] font-semibold">
            Frequently Used Tools
          </h2>

          <PrimaryButton
            icon={FaFileInvoice}
            bgcolor="bg-gradient-to-l from-[#2D9AD9] via-[#2D9AD9] to-[#10B981] text-white hover:opacity-90"
          >
            Create Prescription
          </PrimaryButton>

          <PrimaryButton
            icon={FaFileInvoice}
            bgcolor="bg-gradient-to-l from-[#8E00B9] via-[#8E00B9] to-[#9C05AF] text-white hover:opacity-90"
          >
            Create Invoice
          </PrimaryButton>

          <PrimaryButton
            icon={FaCalendarAlt}
            bgcolor="bg-gradient-to-l from-[#E65100] via-[#E65100] to-[#FBFF00] text-white hover:opacity-90"
          >
            Update Schedule
          </PrimaryButton>

          {/* Total Patients */}
          <button className="items-center px-4 py-2 rounded-lg transition font-medium shadow-sm bg-white text-black hover:opacity-90">
            <div>
              <div className="flex gap-3 items-left">
                <div className="px-3 py-3 rounded-lg bg-gradient-to-l from-[#2D9AD9] via-[#1EAAAC] to-[#10B981]">
                  <img src=".././images/users.png" alt="" />
                </div>

                <div className="text-left">
                  <h2 className="text-[15px] font-semibold mt-2">
                    Total Patients
                  </h2>
                  <p className="text-gray-600 text-[12px] font-medium">
                    This month
                  </p>
                </div>
              </div>

              <h2 className="text-[20px] font-bold mt-2 text-left">
                {dashboardData?.totalPatientsThisMonth || 0}
              </h2>

              <p className="text-[#0BB63F] text-[13px] font-medium text-right">
                + 20 from last month
              </p>
            </div>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
