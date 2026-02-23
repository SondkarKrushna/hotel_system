import { X } from "lucide-react";
import { useState, useMemo } from "react";
import { createInvoice } from "../../api/invoice.api";

const CreateInvoice = ({ open, onClose, prescriptionId, patientData, doctorData }) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        consultationFee: "",
        medicinesTotal: "",
        otherCharges: "",
        discount: "",
        tax: "",
        paymentMethod: "cash",
        paymentStatus: "pending",
        notes: "",
        issueDate: new Date().toISOString().slice(0, 10),
        dueDate: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    /* ✅ Auto total calculation */
    const totalAmount = useMemo(() => {
        const consultation = Number(form.consultationFee || 0);
        const other = Number(form.otherCharges || 0);
        const discount = Number(form.discount || 0);

        return consultation + other - discount;
    }, [form]);

    const handleSubmit = async () => {
        if (!prescriptionId) {
            alert("Prescription ID missing");
            return;
        }

        const payload = {
            consultationFee: Number(form.consultationFee),
            otherCharges: Number(form.otherCharges),
            discount: Number(form.discount),
            tax: Number(form.tax || 0),
            totalAmount,
            paymentMethod: form.paymentMethod,
            paymentStatus: "Paid",
            notes: form.notes,
        };

        try {
            setLoading(true);

            //console.log("Invoice Payload:", payload);

            const response = await createInvoice(prescriptionId, payload);

            //console.log("Invoice Created:", response);

            alert("Invoice created successfully ✅");

            onClose(); // close drawer after success
        } catch (error) {
            console.error("Create invoice error:", error);
            alert(error?.response?.data?.message || "Failed to create invoice");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/30 z-40 ${open ? "block" : "hidden"}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full lg:w-[520px] bg-white z-50
        transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Create Invoice</h2>
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-64px)]">

                    {/* Patient */}
                    <div>
                        <label className="text-sm font-medium">Patient</label>
                        <input
                            value={patientData?.patientName || ""}
                            disabled
                            className="w-full bg-gray-100 rounded px-3 py-2"
                        />
                    </div>

                    {/* Doctor */}
                    <div>
                        <label className="text-sm font-medium">Doctor</label>
                        <input
                            value={doctorData?.name || ""}
                            disabled
                            className="w-full bg-gray-100 rounded px-3 py-2"
                        />
                    </div>



                    {/* Charges */}
                    {[
                        ["consultationFee", "Consultation Fee"],
                        ["otherCharges", "Other Charges"],
                        ["discount", "Discount"],
                        ["tax", "Tax"],
                    ].map(([name, label]) => (
                        <div key={name}>
                            <label className="text-sm">{label}</label>
                            <input
                                type="number"
                                name={name}
                                value={form[name]}
                                onChange={handleChange}
                                className="w-full bg-gray-100 rounded px-3 py-2"
                            />
                        </div>
                    ))}

                    {/* Total */}
                    <div>
                        <label className="text-sm font-semibold">Total Amount</label>
                        <input
                            value={`₹ ${totalAmount}`}
                            disabled
                            className="w-full bg-green-50 border border-green-300 rounded px-3 py-2 font-semibold"
                        />
                    </div>

                    {/* Payment */}
                    <div className="grid grid-cols-2 gap-3">
                        <select
                            name="paymentMethod"
                            value={form.paymentMethod}
                            onChange={handleChange}
                            className="bg-gray-100 rounded px-3 py-2"
                        >
                            <option value="cash">Cash</option>
                            <option value="upi">UPI</option>
                            <option value="card">Card</option>
                        </select>

                    </div>

                    {/* Notes */}
                    <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        placeholder="Notes"
                        className="w-full bg-gray-100 rounded px-3 py-2"
                    />

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-medium text-white
    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#2D9AD9]"}`}
                    >
                        {loading ? "Creating Invoice..." : "Create Invoice"}
                    </button>

                </div>
            </div>
        </>
    );
};

export default CreateInvoice;
