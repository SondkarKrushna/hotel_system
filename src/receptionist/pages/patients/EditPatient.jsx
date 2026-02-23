import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Layout from "../../../components/layout/Layout";
import { Input, Select, DateInput, UploadInput } from "../../../components/FormInputs";
import { updatePatient, patientById } from "../../api/patient.api";
import { useQuery } from "@tanstack/react-query";
import { doctorData } from "../../api/doctor.api";
import { toast } from "react-toastify";

const EditPatient = () => {
  const navigate = useNavigate();
  const { id: patientId } = useParams();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    patientName: "",
    contact: "",
    email: "",
    gender: "",
    bloodGroup: "",
    age: "",
    visitDate: "",
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
const {
    data: doctors = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: doctorData,
  });
  // Fetch patient data on mount
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const patientData = await patientById(patientId);
        ////console.log("Fetched patient data:", patientData);
        if (patientData) {
          setFormData({
            patientName: patientData.patientName || "",
            contact: patientData.contact || "",
            email: patientData.email || "",
            gender: patientData.gender || "",
            bloodGroup: patientData.bloodGroup || "",
            age: patientData.age?.toString() || "",
            visitDate: patientData.visitDate ? patientData.visitDate.split("T")[0] : "",
            disease: patientData.disease || "",
            subDisease: patientData.subDisease || "",
            address: patientData.address || "",
            weight: patientData.weight?.toString() || "",
            height: patientData.height?.toString() || "",
            bloodPressure: patientData.bloodPressure || "",
            assignedDoctor:
              typeof patientData.assignedDoctor === "object"
                ? patientData.assignedDoctor._id
                : patientData.assignedDoctor || "",

            amount: patientData.amount?.toString() || "",
            paymentMethod: patientData.paymentMethod || "",
            notes: patientData.notes || "",
            reportFile: null,
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patient:", error);
        toast.error("Failed to load patient data");
        navigate("/receptionist/mypatient");
      }
    };

    fetchPatientData();
  }, [patientId, navigate]);

  // Update patient mutation
  const updateMutation = useMutation({
    mutationFn: (payload) => updatePatient(patientId, payload),
    onSuccess: () => {
      toast.success("Patient updated successfully!");
      navigate("/receptionist/mypatient");
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("Error updating patient: " + (error.response?.data?.message || error.message));
    },
  });

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.patientName?.trim()) {
      newErrors.patientName = "Patient name is required";
    }
    if (!data.contact?.trim()) {
      newErrors.contact = "Contact number is required";
    }
    if (!data.email?.trim()) {
      newErrors.email = "Email is required";
    }
    if (!data.age?.trim()) {
      newErrors.age = "Age is required";
    }

    // Validate visitDate format and prevent past dates
    if (data.visitDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(data.visitDate)) {
        newErrors.visitDate = "visitDate must be in YYYY-MM-DD format";
      } else {
        const selected = new Date(data.visitDate);
        selected.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) {
          newErrors.visitDate = "Visit date cannot be in the past";
        }
      }
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFormData((prev) => ({ ...prev, reportFile: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Prepare payload for API call
      const payload = {
        patientName: formData.patientName,
        contact: formData.contact,
        email: formData.email,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        age: parseInt(formData.age),
        address: formData.address,
        visitDate: formData.visitDate || null,
        disease: formData.disease,
        subDisease: formData.subDisease,
        weight: formData.weight ? parseInt(formData.weight) : null,
        height: formData.height ? parseInt(formData.height) : null,
        bloodPressure: formData.bloodPressure,
        assignedDoctor: formData.assignedDoctor,
        amount: formData.amount ? parseFloat(formData.amount) : 0,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
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

      //console.log("Updating patient with payload:", payload);
      updateMutation.mutate(payload);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-gray-600">Loading patient data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-[#f5fbff] min-h-screen p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-lg font-semibold">Edit Patient</h1>
          <p className="text-sm text-gray-500">Healthcare → Edit Patient</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-md font-semibold">Patient Information</h2>
          </div>

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
              label="Disease"
              placeholder="Enter"
              name="disease"
              value={formData.disease}
              onChange={handleInputChange}
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
            />

            <Input
              label="Height"
              placeholder="Enter"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
            />

            <Input
              label="Blood Pressure"
              placeholder="Enter"
              name="bloodPressure"
              value={formData.bloodPressure}
              onChange={handleInputChange}
            />

            <Select
              label="Assign Doctor"
              name="assignedDoctor"
              value={formData.assignedDoctor}
              onChange={handleInputChange}
              options={doctors.map((d) => ({
                value: d._id,
                display: d.doctorName || d.name || "Unknown Doctor"
              }))}
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
              options={["cash", "card", "upi", "bank_transfer", "insurance", "other"]}
            />

            <Input
              label="Notes"
              placeholder="Enter notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
            />

            <UploadInput label="Upload Reports" onChange={handleFileChange} />

            {/* Buttons */}
            <div className="md:col-span-4 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => navigate("/receptionist/mypatient")}
                className="flex items-center gap-2 bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 bg-[#2D9AD8] text-white px-6 py-2 rounded-md hover:opacity-90 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateMutation.isPending ? "Updating..." : "Update Patient"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditPatient;
