import React, { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import AddSlot from "./AddSlot";
import Layout from "../../../components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { getScheduleData, deleteDoctorSlot } from "../../api/schedule.api"; // ✅ correct api function
import { toast } from "react-toastify";

const ScheduleSlot = ({ time, title, color = "blue", onEdit, onDelete }) => {
    const colors = {
        blue: "bg-[#2D9AD8]  hover:bg-blue-700",
        yellow: "bg-yellow-500 hover:bg-yellow-600",
    };

    return (
        <div
            className={`
        w-[95%] mx-auto h-full
        rounded-md p-2 text-white shadow-md 
        z-10 text-sm transition-all
        ${colors[color]}
      `}
        >
            <div className="font-semibold">{time}</div>
            <div className="text-xs">{title}</div>

            <div className="mt-1 flex space-x-2 text-white/75">
                <FiEdit2
                    onClick={onEdit}
                    className="cursor-pointer hover:text-white w-4 h-4"
                />

                <FiTrash2
                    onClick={onDelete}
                    className="cursor-pointer hover:text-white w-4 h-4"
                />
            </div>
        </div>
    );
};



// ✅ convert backend schedule to UI scheduleData
const convertToScheduleData = (availabilitySchedule) => {
    const dayMap = {
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
        sunday: 7,
    };

    const toMinutes = (time) => {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    };

    return availabilitySchedule.flatMap((d) => {
        const dayNumber = dayMap[d.day];

        const morningSlots = (d.morning || []).map((s) => {
            const startMin = toMinutes(s.start);
            const endMin = toMinutes(s.end);

            return {
                day: dayNumber,
                start: startMin,
                duration: endMin - startMin,
                time: `${s.start} - ${s.end}`,
                title: "Morning Clinic",
                color: "blue",
                slotId: s._id,
                type: "morning",
                dayName: d.day,
            };
        });

        const eveningSlots = (d.evening || []).map((s) => {
            const startMin = toMinutes(s.start);
            const endMin = toMinutes(s.end);

            return {
                day: dayNumber,
                start: startMin,
                duration: endMin - startMin,
                time: `${s.start} - ${s.end}`,
                title: "Evening Clinic",
                color: "blue",
                slotId: s._id,
                type: "evening",
                dayName: d.day,
            };
        });

        return [...morningSlots, ...eveningSlots];
    });
};

export default function WeeklySchedule() {
    const [openModal, setOpenModal] = useState(false);
    const [editSlot, setEditSlot] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const doctorId = user?.doctorId;

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["doctorSlots", doctorId],
        queryFn: () => getScheduleData(doctorId),
        enabled: !!doctorId,
    });
    const deleteMutation = useMutation({
        mutationFn: deleteDoctorSlot,
        onSuccess: () => {
            toast("Slot deleted successfully");
            refetch();
        },
        onError: (error) => {
            alert(error?.response?.data?.message || "Delete failed");
        },
    });

    // ✅ backend schedule
    const availabilitySchedule = data?.availabilitySchedule || [];

    // ✅ converted schedule for UI grid
    const scheduleData = convertToScheduleData(availabilitySchedule);

    const days = [
        "Time",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];

    const startHour = 8;
    const endHour = 19;

    const ROW_PX = 64;
    const MIN_TO_PX = ROW_PX / 60;

    if (isLoading) {
        return (
            <Layout>
                <p className="p-6 text-gray-500">Loading schedule...</p>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-medium text-black">Weekly Schedule</h2>
                    <p className="font-medium text-[#1E1E1E80] text-sm">
                        Manage your availability and working hours
                    </p>
                </div>

                <button
                    onClick={() => {
                        setEditSlot(null);
                        setOpenModal(true);
                    }}
                    className="bg-[#2D9AD8] text-white px-4 py-2 rounded-lg text-sm flex items-center shadow hover:bg-[#2D9AD8]  transition"
                >
                    <span className="text-xl mr-1">+</span> Add Slot
                </button>
            </div>
            <div className="p-4 bg-white border border-gray-200 rounded-md my-3 max-w-6xl mx-auto shadow-xl">
                <div className="flex gap-3">
                    <Legend label="Available" color="bg-[#2D9AD8]"/>
                    <Legend label="Break" color="bg-yellow-500" />
                    <Legend label="Day off" color="bg-gray-500" />
                </div>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-lg max-w-6xl mx-auto shadow-xl">
                <div className="grid grid-cols-[5rem_repeat(7,1fr)] border-t border-l border-gray-200">
                    {days.map((day, i) => (
                        <div
                            key={i}
                            className={`font-semibold text-gray-700 text-center py-2 text-sm border-r border-b bg-gray-200
                ${day === "Time" ? "sticky left-0 bg-gray-100 z-20" : ""}
              `}
                        >
                            {day}
                        </div>
                    ))}

                    {Array.from({ length: endHour - startHour + 1 }).map((_, i) => {
                        const hour = startHour + i;
                        const rowStart = hour * 60;

                        return (
                            <React.Fragment key={hour}>
                                <div
                                    className="text-gray-500 text-sm text-right pr-2 sticky left-0 bg-white border-b border-r border-gray-200 flex items-start justify-end pt-1 z-10"
                                    style={{ height: ROW_PX }}
                                >
                                    {hour}:00
                                </div>

                                {Array.from({ length: 7 }).map((_, dayIndex) => {
                                    const day = dayIndex + 1;

                                    return (

                                        <div
                                            key={day}
                                            className="relative border-r border-b border-gray-200"
                                            style={{ height: ROW_PX }}
                                        >
                                            {scheduleData
                                                .filter((s) => s.day === day && Math.floor(s.start / 60) * 60 === rowStart)
                                                .map((slot, j) => (
                                                    <div
                                                        key={j}
                                                        style={{
                                                            position: "absolute",
                                                            top: (slot.start - rowStart) * MIN_TO_PX,
                                                            left: 0,
                                                            right: 0,
                                                            height: slot.duration * MIN_TO_PX,
                                                        }}
                                                    >
                                                        <ScheduleSlot
                                                            {...slot}
                                                            onEdit={() => {
                                                                setEditSlot(slot);
                                                                setOpenModal(true);
                                                            }}
                                                            onDelete={() => {
                                                                if (!window.confirm("Are you sure you want to delete this slot?"))
                                                                    return;

                                                                deleteMutation.mutate({
                                                                    doctorId,
                                                                    slotId: slot.slotId,
                                                                    payload: {
                                                                        day: slot.dayName, // monday, tuesday...
                                                                        type: slot.type,   // morning/evening
                                                                    },
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                ))}



                                        </div>
                                    );


                                })}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            <AddSlot
                open={openModal}
                onClose={() => setOpenModal(false)}
                editSlot={editSlot}
                refetch={refetch}
            />

        </Layout>
    );
}

function Legend({ label, color }) {
    return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white">
            <span className={`w-4 h-4 ${color} rounded-sm`} />
            <span className="text-sm text-gray-700">{label}</span>
        </div>
    );
}
