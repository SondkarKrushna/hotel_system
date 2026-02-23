import Layout from "../../components/layout/Layout";
import ReceptionistStatCard from "../../components/cards/ReceptionistStatCard";
import ListCard from "../../components/cards/ListCard";
import ReceptionistdashTable from "../../components/table/ReceptionistdashTable";
import { useQuery } from "@tanstack/react-query";
import { getReceptionistDashboard } from "../api/dashboard.api";
import { useState } from "react";
import { FaSort } from "react-icons/fa";


const Dashboard = () => {
  const [period, setPeriod] = useState("day");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["receptionist-dashboard", period, startDate, endDate],
    queryFn: () =>
      getReceptionistDashboard({ period, startDate, endDate }),
    enabled: period !== "custom" || (!!startDate && !!endDate),
    keepPreviousData: true,
  });


  if (isLoading) {
    return <Layout><p className="p-6">Loading dashboard...</p></Layout>;
  }

  if (isError) {
    return <Layout><p className="p-6 text-red-500">Failed to load dashboard</p></Layout>;
  }
  ////console.log("Dashboard Data:", data);
  const overview = data?.overview || {};

  const todayAppointments = data?.data?.appointments || [];
  const recentPatients = data?.data?.patients || [];
  const recentTransactions = data?.data?.transactions || [];

  const appointmentItems = todayAppointments.map((a) => ({
    name: a.patientId?.patientName || "Unknown",
    img: "../../images/1.png",
    date: new Date(a.appointmentDate).toLocaleDateString(),
    time: a.timeSlot,
    status: a.status,
  }));

  const patientReportItems = recentPatients.map((p) => ({
    name: p.patientName,
    img: "../../images/petient.png",
    report: `Age ${p.age} | ${p.gender}`,
    status: "Active",   
  }));

  const doctorItems = [
    ...new Map(
      todayAppointments.map((a) => [
        a.doctorId?._id,
        {
          name: a.doctorId?.name,
          img: "../../images/6.png",
          role: a.doctorId?.specialization,
          status: "Available",
        },
      ])
    ).values(),
  ];


  const type = "";
  return (
    <Layout>
      <div className="bg-[#f4f9ff] min-h-screen p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold">WELCOME , Receptionist</h1>
            <p className="text-sm text-gray-500">Today you have {todayAppointments.length} appointments</p>
          </div>

          <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">

            <div className="flex items-center gap-2 border border-gray-200 rounded px-3 py-1.5 text-sm">
              <FaSort className="text-gray-500 text-xs" />

              <select
                value={period}
                onChange={(e) => {
                  setPeriod(e.target.value);
                  if (e.target.value !== "custom") {
                    setStartDate("");
                    setEndDate("");
                  }
                }}
                className="outline-none bg-transparent"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom</option>
              </select>

              {period === "custom" && (

                <>
                  <div className="w-[30px] h-[30px] bg-[#2D9AD8] flex items-center justify-center">
                    <img
                      src=".././images/dash2.png"
                      alt="calendar"
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="ml-2 border border-gray-200 rounded px-2 py-1 text-xs outline-none"
                  />

                  <span className="text-gray-400 text-xs">to</span>

                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-200 rounded px-2 py-1 text-xs outline-none"
                  />
                </>
              )}
            </div>


          </div>

        </div>

        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ReceptionistStatCard title="Patients" img=".././images/dash1.png" waveimg=".././images/wave1.png" value={overview?.patients?.count ?? 0} percent={overview?.patients?.change ?? "0%"} color="#2D9AD8" />
          <ReceptionistStatCard title="Appointments" img=".././images/dash2.png" waveimg=".././images/wave2.png" value={overview?.appointments?.count ?? 0} percent={overview?.appointments?.change ?? "0%"} color="#E65100" />
          <ReceptionistStatCard title="Doctors" img=".././images/dash3.png" waveimg=".././images/wave3.png" value={overview?.doctors?.total ?? 0} percent={"0%"} color="#6A1B9A" />
          <ReceptionistStatCard title="Transactions" img=".././images/dash4.png" waveimg=".././images/wave4.png" value={overview?.revenue?.amount ?? 0} percent={overview?.revenue?.change ?? "0%"} color="#CC25B0" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ListCard
            title="Appointment Request"
            buttonlable="All Appointments"
            href="/receptionist/appointments"
            items={appointmentItems}
          />

          <ListCard
            title="Patients"
            type="report"
            buttonlable="View All"
            href="/receptionist/mypatient"
            items={patientReportItems}

          />

          <ListCard
            title="Doctors"
            type="doctor"
            buttonlable="View All"
            href="/receptionist/doctors"
            items={doctorItems}

          />
        </div>

        {/* Table */}
        {/* <ReceptionistdashTable /> */}
      </div>

    </Layout>
  );
};

export default Dashboard;
