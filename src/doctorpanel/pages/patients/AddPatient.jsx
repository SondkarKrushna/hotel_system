import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Layout from "../../../components/layout/Layout";
import {
  Input,
  Select,
  DateInput,
  UploadInput,
} from "../../../components/FormInputs";
import { createPatient, patientData, patientById } from "../../api/patient.api";
import { doctorData } from "../../api/doctor.api";
import { postAppointment } from "../../api/appointment.api";
import { toast } from "react-toastify";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;

const AddPatient = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("new");
  const [errors, setErrors] = useState({});

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const hospitalId = user?.hospital || "";

  // Fetch patients
  const { data: patients = [], isLoading: patientsLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: patientData,
  });

  // Fetch doctors
  const {
    data: doctors = [],
    isLoading: doctorsLoading,
    isError: doctorsError,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: doctorData,
  });

  // Read tab from location state or query param to set active tab
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search || "");
      const tabFromQuery = params.get("tab");
      const tabFromState = location.state?.activeTab;
      const tab = tabFromState || tabFromQuery;
      if (tab === "existing" || tab === "new") {
        setActiveTab(tab);
      }
    } catch (err) {
      // ignore
    }
  }, [location]);

  const [formData, setFormData] = useState({
    patientName: "",
    contact: "",
    email: "",
    gender: "",
    bloodGroup: "",
    age: "",
    visitDate: "",
    timeSlot: "",
    disease: "",
    subDisease: "",
    address: "",
    weight: "",
    height: "",
    bloodPressure: "",
    assignedDoctor: "",
    amount: "",
    paymentMethod: "",
    notes: "",
    reportFile: null,
  });

  const [existingPatientForm, setExistingPatientForm] = useState({
    patientId: "",
    patientName: "",
    contact: "",
    email: "",
    gender: "",
    age: "",
    visitDate: "",
    timeSlot: "",
    disease: "",
    subDisease: "",
    address: "",
    weight: "",
    height: "",
    bloodPressure: "",
    assignedDoctor: "",
    amount: "",
    bloodGroup: "",
    paymentMethod: "",
    notes: "",
    reportFile: null,
  });

  // ------------------ CREATE PATIENT MUTATION ------------------
  const createMutation = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      toast.success("Patient added successfully!");

      setFormData({
        patientName: "",
        contact: "",
        email: "",
        gender: "",
        bloodGroup: "",
        age: "",
        visitDate: "",
        timeSlot: "",
        disease: "",
        subDisease: "",
        address: "",
        weight: "",
        height: "",
        bloodPressure: "",
        assignedDoctor: "",
        amount: "",
        paymentMethod: "",
        notes: "",
        reportFile: null,
      });

      navigate("/receptionist/mypatient");
    },
  });

  // ------------------ CREATE APPOINTMENT MUTATION ------------------
  const appointmentMutation = useMutation({
    mutationFn: postAppointment,
    onSuccess: () => {
      toast.success("Appointment added successfully");

      setExistingPatientForm({
        patientId: "",
        patientName: "",
        contact: "",
        email: "",
        gender: "",
        age: "",
        visitDate: "",
        timeSlot: "",
        disease: "",
        subDisease: "",
        address: "",
        weight: "",
        height: "",
        bloodPressure: "",
        assignedDoctor: "",
        amount: "",
        bloodGroup: "",
        paymentMethod: "",
        notes: "",
        reportFile: null
      });

      navigate("/receptionist/appointments");
    },
  });

  // ------------------ VALIDATIONS ------------------
  const validatePatientForm = (data) => {
    const errors = {};

    if (!data.patientName.trim()) errors.patientName = "Patient name is required";

    if (!data.contact) errors.contact = "Contact number is required";
    else if (!phoneRegex.test(data.contact))
      errors.contact = "Enter valid 10 digit phone number";

    if (!data.email) errors.email = "Email is required";
    else if (!emailRegex.test(data.email)) errors.email = "Invalid email address";

    if (!data.gender) errors.gender = "Gender is required";

    if (!data.age) errors.age = "Age is required";
    else if (Number(data.age) <= 0) errors.age = "Age must be greater than 0";

    if (!data.visitDate) errors.visitDate = "Visit date is required";
    if (!data.timeSlot) errors.timeSlot = "Time slot is required";

    if (!data.disease) errors.disease = "Disease is required";
    if (!data.weight) errors.weight = "Weight is required";
    if (!data.height) errors.height = "Height is required";
    if (!data.bloodPressure) errors.bloodPressure = "Blood pressure is required";
    if (!data.assignedDoctor) errors.assignedDoctor = "Doctor is required";

    return errors;
  };

  const validateAppointmentForm = (data) => {
    const errors = {};

    if (!data.patientId) errors.patientId = "Patient is required";
    if (!data.visitDate) errors.visitDate = "Appointment date is required";
    if (!data.timeSlot) errors.timeSlot = "Time slot is required";
    if (!data.assignedDoctor) errors.assignedDoctor = "Doctor is required";

    return errors;
  };

  // ------------------ HANDLE INPUT CHANGE ------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    // split id|||name
    if (
      (name === "assignedDoctor" || name === "patientId") &&
      value.includes("|||")
    ) {
      finalValue = value.split("|||")[0];
    }

    // NEW PATIENT
    if (activeTab === "new") {
      setFormData((prev) => ({
        ...prev,
        [name]: finalValue,
      }));
      return;
    }

    // EXISTING PATIENT
    if (activeTab === "existing") {
      if (name === "patientId") {
        setExistingPatientForm((prev) => ({
          ...prev,
          patientId: finalValue,
        }));

        handlePatientSelect(finalValue);
        return;
      }

      setExistingPatientForm((prev) => ({
        ...prev,
        [name]: finalValue,
      }));
    }
  };

  // ------------------ PATIENT SELECT ------------------
  const handlePatientSelect = async (patientId) => {
    try {
      const response = await patientById(patientId);
      const patient = response?.patient;

      if (!patient) return;

      setExistingPatientForm((prev) => ({
        ...prev,
        patientId: patient._id,
        patientName: patient.patientName || "",
        contact: patient.contact || "",
        email: patient.email || "",
        gender: patient.gender || "",
        age: patient.age?.toString() || "",
        bloodGroup: patient.bloodGroup || "",
        address: patient.address || "",
        disease: patient.disease || "",
        subDisease: patient.subDisease || "",
        weight: patient.weight?.toString() || "",
        height: patient.height?.toString() || "",
        bloodPressure: patient.bloodPressure || "",
        notes: patient.notes || "",
        paymentMethod: patient.paymentMethod || "",
        amount: patient.amount?.toString() || "",

        // ✅ FIXED: AUTO SET VISIT DATE, TIME SLOT, ASSIGNED DOCTOR
        visitDate: patient.visitDate ? patient.visitDate.split("T")[0] : "",
        timeSlot: patient.timeSlot || "",
        assignedDoctor: patient.assignedDoctor || "",
      }));
    } catch (error) {
      console.error("Error fetching patient details:", error);
      toast.error("Failed to load patient details");
    }
  };

  // ------------------ FILE CHANGE ------------------
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (activeTab === "new") {
      setFormData((prev) => ({ ...prev, reportFile: file }));
    } else {
      setExistingPatientForm((prev) => ({ ...prev, reportFile: file }));
    }
  };

  // ------------------ SUBMIT NEW PATIENT ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validatePatientForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const payload = {
        hospital: hospitalId,
        patientName: formData.patientName,
        contact: formData.contact,
        email: formData.email,
        gender: formData.gender,
        age: parseInt(formData.age) || 0,
        bloodGroup: formData.bloodGroup,
        address: formData.address,
        visitDate: formData.visitDate || null,
        timeSlot: formData.timeSlot || null,
        disease: formData.disease,
        subDisease: formData.subDisease,
        weight: formData.weight ? parseInt(formData.weight) : null,
        height: formData.height ? parseInt(formData.height) : null,
        bloodPressure: formData.bloodPressure,
        assignedDoctor: formData.assignedDoctor,
        amount: formData.amount ? parseFloat(formData.amount) : 0,
        paymentMethod: formData.paymentMethod,
        reports: formData.reportFile
          ? [
              {
                fileName: formData.reportFile.name,
                url: "",
                mimeType: formData.reportFile.type,
              },
            ]
          : [],
      };

      //console.log("Submitting payload:", payload);
      createMutation.mutate(payload);
    }
  };

  // ------------------ SUBMIT APPOINTMENT EXISTING PATIENT ------------------
  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateAppointmentForm(existingPatientForm);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const payload = {
        patientId: existingPatientForm.patientId,
        doctorId: existingPatientForm.assignedDoctor,
        appointmentDate: existingPatientForm.visitDate || null,
        timeSlot: existingPatientForm.timeSlot || null,
        paymentAmount: existingPatientForm.amount
          ? parseFloat(existingPatientForm.amount)
          : 0,
        paymentMode: existingPatientForm.paymentMethod || "cash",
        status: "pending",
      };

      //console.log("Booking appointment with payload:", payload);
      appointmentMutation.mutate(payload);
    }
  };

  return (
    <Layout>
      <div className="bg-[#f5fbff] min-h-screen p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-lg font-semibold">Add Patient</h1>
          <p className="text-sm text-gray-500">Healthcare → Appointments</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab("new")}
            className={`px-4 py-2 rounded-md font-semibold text-sm w-full sm:w-auto ${
              activeTab === "new"
                ? "bg-[#2D9AD8] text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            New Patient
          </button>

          <button
            onClick={() => setActiveTab("existing")}
            className={`px-4 py-2 rounded-md font-semibold text-sm w-full sm:w-auto ${
              activeTab === "existing"
                ? "bg-[#2D9AD8] text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Existing Patient
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-md font-semibold">Patient Information</h2>
          </div>

          {/* ========== NEW PATIENT FORM ========== */}
          {activeTab === "new" && (
            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            >
              <Input
                label="Patient Name"
                placeholder="Enter Patient Name"
                error={errors.patientName}
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
              />

              <Input
                label="Contact No"
                placeholder="Enter"
                error={errors.contact}
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
              />

              <Input
                label="Email"
                placeholder="Enter"
                error={errors.email}
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />

              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                error={errors.gender}
                options={["male", "female", "other"]}
              />

              <Select
                label="Blood Group"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
              />

              <Input
                label="Age"
                placeholder="Enter"
                error={errors.age}
                name="age"
                value={formData.age}
                onChange={handleInputChange}
              />

              <DateInput
                label="Visit Date"
                name="visitDate"
                value={formData.visitDate}
                onChange={handleInputChange}
                error={errors.visitDate}
              />

              <Input
                type="time"
                label="Time Slot"
                name="timeSlot"
                placeholder="00 : 00"
                value={formData.timeSlot}
                onChange={handleInputChange}
                error={errors.timeSlot}
              />

              <Input
                label="Disease"
                name="disease"
                value={formData.disease}
                onChange={handleInputChange}
                error={errors.disease}
              />

              <Input
                label="Sub Disease"
                placeholder="Enter"
                name="subDisease"
                value={formData.subDisease}
                onChange={handleInputChange}
              />

              <Input
                label="Address"
                placeholder="Enter"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />

              <Input
                label="Weight"
                placeholder="Enter"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                error={errors.weight}
              />

              <Input
                label="Height"
                placeholder="Enter"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                error={errors.height}
              />

              <Input
                label="Blood Pressure"
                placeholder="Enter"
                name="bloodPressure"
                value={formData.bloodPressure}
                onChange={handleInputChange}
                error={errors.bloodPressure}
              />

              <Select
                label="Assign Doctor"
                name="assignedDoctor"
                value={formData.assignedDoctor}
                onChange={handleInputChange}
                error={errors.assignedDoctor}
                options={doctors.map(
                  (d) => `${d._id}|||${d.name || d.doctorName}`
                )}
              />

              <Input
                label="Amount"
                placeholder="Enter"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
              />

              <Select
                label="Payment Method"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                options={[
                  "cash",
                  "card",
                  "upi",
                  "bank_transfer",
                  "insurance",
                  "other",
                ]}
              />

              <UploadInput label="Upload Reports" onChange={handleFileChange} />

              {/* Submit */}
              <div className="md:col-span-4 flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={createMutation.isLoading}
                  className="flex items-center gap-2 bg-[#2D9AD8] text-white px-6 py-2 rounded-md hover:opacity-90 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createMutation.isLoading ? "Adding..." : "+ Add Patient"}
                </button>
              </div>
            </form>
          )}

          {/* ========== EXISTING PATIENT FORM ========== */}
          {activeTab === "existing" && (
            <form
              onSubmit={handleAppointmentSubmit}
              className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            >
              <Select
                label="Select Patient by ID or Contact"
                name="patientId"
                value={existingPatientForm.patientId}
                onChange={handleInputChange}
                options={
                  patients.length > 0
                    ? patients.map(
                        (p) => `${p._id}|||${p.patientName} (${p.contact})`
                      )
                    : []
                }
                error={errors.patientId}
              />

              <Input
                label="Patient Name"
                name="patientName"
                value={existingPatientForm.patientName}
                disabled
              />

              <Input
                label="Contact No"
                name="contact"
                value={existingPatientForm.contact}
                disabled
              />

              <Input
                label="Email"
                name="email"
                value={existingPatientForm.email}
                disabled
              />

              <Select
                label="Gender"
                name="gender"
                value={existingPatientForm.gender}
                options={["male", "female", "other"]}
                disabled
              />

              <Input
                label="Age"
                name="age"
                value={existingPatientForm.age}
                disabled
              />

              {/* ✅ NOW AUTO FILLS */}
              <DateInput
                label="Visit Date"
                name="visitDate"
                value={existingPatientForm.visitDate}
                onChange={handleInputChange}
                error={errors.visitDate}
              />

              <Input
                type="time"
                label="Time Slot"
                name="timeSlot"
                value={existingPatientForm.timeSlot}
                onChange={handleInputChange}
                error={errors.timeSlot}
              />

              <Input
                label="Disease"
                name="disease"
                value={existingPatientForm.disease}
                disabled
              />

              <Input
                label="Sub Disease"
                name="subDisease"
                value={existingPatientForm.subDisease}
                disabled
              />

              <Input
                label="Address"
                name="address"
                value={existingPatientForm.address}
                disabled
              />

              <Input
                label="Weight"
                name="weight"
                value={existingPatientForm.weight}
                disabled
              />

              <Input
                label="Height"
                name="height"
                value={existingPatientForm.height}
                disabled
              />

              <Input
                label="Blood Pressure"
                name="bloodPressure"
                value={existingPatientForm.bloodPressure}
                disabled
              />

              {/* ✅ NOW AUTO SELECTS */}
              <Select
                label="Assign Doctor"
                name="assignedDoctor"
                value={existingPatientForm.assignedDoctor}
                onChange={handleInputChange}
                options={doctors.map(
                  (d) => `${d._id}|||${d.name || d.doctorName}`
                )}
                error={errors.assignedDoctor}
              />

              <Input
                label="Amount"
                placeholder="Enter"
                name="amount"
                value={existingPatientForm.amount}
                onChange={handleInputChange}
              />

              <Select
                label="Blood Group"
                name="bloodGroup"
                value={existingPatientForm.bloodGroup}
                options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                disabled
              />

              <Select
                label="Payment Method"
                name="paymentMethod"
                value={existingPatientForm.paymentMethod}
                options={["cash", "card", "upi", "insurance", "free", "other"]}
                disabled
              />

              <UploadInput label="Upload Reports" onChange={handleFileChange} />

              {/* Submit */}
              <div className="md:col-span-4 flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={appointmentMutation.isLoading}
                  className="flex items-center gap-2 bg-[#2D9AD8] text-white px-6 py-2 rounded-md hover:opacity-90 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {appointmentMutation.isLoading
                    ? "Booking..."
                    : "+ Add Appointment"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AddPatient;
