import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { addScheduleSlot, updateScheduleSlot } from "../../api/schedule.api";
import { toast } from "react-toastify";

export default function AddSlot({ open, onClose, editSlot, refetch }) {
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [type, setType] = useState("morning");
  const [label, setLabel] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const doctorId = user?.doctorId;

  const dayNumberToName = {
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
    7: "sunday",
  };

  useEffect(() => {
    if (editSlot) {
      setDay(editSlot.day);
      setLabel(editSlot.title || "");
      setType(editSlot.type || "morning");

      const startH = String(Math.floor(editSlot.start / 60)).padStart(2, "0");
      const startM = String(editSlot.start % 60).padStart(2, "0");
      setStartTime(`${startH}:${startM}`);

      const endMinutes = editSlot.start + editSlot.duration;
      const endH = String(Math.floor(endMinutes / 60)).padStart(2, "0");
      const endM = String(endMinutes % 60).padStart(2, "0");
      setEndTime(`${endH}:${endM}`);
    } else {
      setDay("");
      setStartTime("");
      setEndTime("");
      setType("morning");
      setLabel("");
    }
  }, [editSlot, open]);

  // ✅ ADD MUTATION
  const addSlotMutation = useMutation({
    mutationFn: addScheduleSlot,
    onSuccess: () => {
      toast.success("Slot added successfully");
      refetch();
      onClose();
    },
    onError: (error) => {
      toast.success(error?.response?.data?.message || "Something went wrong");
    },
  });

  // ✅ UPDATE MUTATION
  const updateSlotMutation = useMutation({
    mutationFn: updateScheduleSlot,
    onSuccess: () => {
      toast.success("Slot updated successfully");
      refetch();
      onClose();
    },
    onError: (error) => {
      toast.success(error?.response?.data?.message || "Something went wrong");
    },
  });

  const handleSave = () => {
    if (!day || !startTime || !endTime || !type) {
      toast.success("All fields are required");
      return;
    }

    const payload = {
      day: dayNumberToName[day],
      type,
      start: startTime,
      end: endTime,
      label,
    };

    if (editSlot) {
      updateSlotMutation.mutate({
        doctorId,
        slotId: editSlot.slotId,
        payload,
      });
    } else {
      addSlotMutation.mutate({
        doctorId,
        payload,
      });
    }
  };

  const loading = addSlotMutation.isPending || updateSlotMutation.isPending;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity z-40 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed top-1/2 left-1/2 w-full max-w-md bg-white shadow-xl z-50 
        transform -translate-x-1/2 -translate-y-1/2
        transition-all duration-300
        ${
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="p-5 flex border-b border-gray-100 justify-between items-center">
          <h2 className="text-lg font-semibold">
            {editSlot ? "Edit Availability Slot" : "Add Availability Slot"}
          </h2>

          <button
            onClick={onClose}
            className="text-2xl leading-none bg-gray-100 border-2 border-gray-200 text-black pb-2 px-2 hover:bg-gray-300"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Day */}
          <div>
            <label className="block text-sm font-medium mb-1">Day</label>
            <select
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="w-full bg-gray-100 p-2 focus:outline-none"
            >
              <option value="">Select Day</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
              <option value="7">Sunday</option>
            </select>
          </div>

          {/* Start + End */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-gray-100 p-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-gray-100 p-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-gray-100 p-2 focus:outline-none"
            >
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
          </div>

          {/* Label */}
          <div>
            <label className="block text-sm font-medium mb-1">Label</label>
            <textarea
              rows={3}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full bg-gray-100 p-2 focus:outline-none"
            />
          </div>

          {/* Save */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-32 bg-blue-500 text-white py-2 rounded-lg shadow hover:bg-blue-600 transition disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : editSlot
                ? "Update Slot"
                : "+ Save Slot"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
