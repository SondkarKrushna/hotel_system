import { Mail, Phone, MapPin, Printer, Download, Share2 } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";

const InvoiceTemplate = ({ open, onClose, data }) => {
  const invoiceRef = useRef();
  //console.log("invoice data", data);

  const medicines = data?.prescriptionId?.medicines || [];
  const prescription = data?.prescriptionId;

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice-${data?.invoiceNumber || "invoice"}`,
  });
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    const hideEls = invoiceRef.current.querySelectorAll(".screen-only");
    hideEls.forEach(el => (el.style.display = "none"));

    try {
      const dataUrl = await toPng(invoiceRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(dataUrl, "PNG", 0, 0, 210, 297);
      pdf.save("Invoice.pdf");
      await pdf.html(invoiceRef.current, {
        callback: function (doc) {
          doc.save("Invoice.pdf");
        },
        x: 0,
        y: 0,
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
        autoPaging: "text",
      });
    } finally {
      hideEls.forEach(el => (el.style.display = ""));
    }
  };

  const handleShare = async () => {
    const dataUrl = await toPng(invoiceRef.current, { pixelRatio: 2 });
    const pdf = new jsPDF("p", "mm", "a4");

    pdf.addImage(dataUrl, "PNG", 0, 0, 210, 297);
    const blob = pdf.output("blob");

    const file = new File([blob], "invoice.pdf", { type: "application/pdf" });

    if (navigator.share) {
      await navigator.share({ files: [file], title: "Invoice" });
    } else {
      alert("Sharing not supported");
    }
  };

  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center overflow-y-auto py-10 w-full">

      <div className="relative flex flex-col bg-white md:w-[750px] lg:w-[650px] xl:w-[750px]">

        {/* ================= PRINTABLE AREA ================= */}
        <div ref={invoiceRef} className="bg-white shadow">

          {/* ================= A4 PAGE ================= */}

          <div className="page bg-white shadow-xl relative overflow-hidden">

            {/* ===== TOP DECOR ===== */}
            <div className="absolute pdf-header top-0 left-0 w-full h-[180px] overflow-hidden pointer-events-none z-0">
              <img
                src=".././images/invoice1.png"
                alt=""
                className="absolute top-0 left-0 w-64"
              />
              <img src=".././images/invoice2.png" alt="" className="absolute top-10 left-2/3 -translate-x-1/2 w-12 ml-8" />

              <img
                src=".././images/invoice3.png"
                alt=""
                className="absolute top-0 right-0 w-32"
              />
            </div>

            {/* ===== CLOSE BUTTON (SCREEN ONLY) ===== */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-gray-100 border px-3 py-1 screen-only z-50"
            >
              ✕
            </button>


            {/* ===== CONTENT ===== */}
            <div className="px-10 pt-32 pb-10">

              {/* HEADER */}
              <div className="flex justify-between border-b pb-4 mb-6">
                <div>
                  <img src=".././images/techsuryalogo.png" className="w-28 mb-2" />
                  <h1 className="text-xl font-semibold">Invoice</h1>

                  <div className="text-sm mt-2">
                    <p>Number: <b>{data.invoiceNumber}</b></p>
                    <p>Date: <b>{new Date(data.issueDate).toLocaleDateString()}</b></p>
                  </div>
                </div>

                <div className="text-right text-sm pr-2">
                  <p className="font-semibold text-green-600">To,</p>
                  <p>{data.patientId?.UID}</p>
                  <p className="mt-2 font-semibold">{data.patientId?.patientName}</p>
                  <p>{data.patientId?.contact}</p>
                </div>
              </div>

              {/* DIAGNOSIS */}
              <div className="mb-6 no-break">
                <p className="font-semibold mb-1">Diagnosis</p>
                {prescription?.diagnosis?.length ? (
                  <ul className="list-disc list-inside text-sm">
                    {prescription.diagnosis.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">No diagnosis</p>
                )}
              </div>

              {/* MEDICINES */}
              <div className="bg-[#EEF7FF] rounded-2xl p-4 mb-6">
                {/* Header */}
                <div className="grid grid-cols-4 bg-[#D8ECFB] text-[#2D9AD9] px-2 sm:px-4 py-2 rounded-xl mb-2 text-[11px] sm:text-sm font-semibold">
                  <p className="text-center border-r border-[#5FA9E6]">Medicine</p>
                  <p className="text-center border-r border-[#5FA9E6]">Qty</p>
                  <p className="text-center border-r border-[#5FA9E6]">Dosage</p>
                  <p className="text-center">Duration</p>
                </div>

                {/* Rows */}
                {medicines.map((m, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-4 px-2 sm:px-4 py-2 text-[11px] sm:text-sm border-b border-[#CFE6F7]"
                  >
                    <p className="text-center border-r border-[#5FA9E6] break-words">
                      {m.name}
                    </p>
                    <p className="text-center border-r border-[#5FA9E6]">
                      {m.quantity}
                    </p>
                    <p className="text-center border-r border-[#5FA9E6] break-words">
                      {m.dosage} {m.dosageUnit}
                    </p>
                    <p className="text-center break-words">
                      {m.frequency} | {m.durationDays} days
                    </p>
                  </div>
                ))}
              </div>



              {/* TOTALS */}
              <div className="space-y-2 text-sm no-break">
                <div className="flex justify-between font-bold">
                  <span>SUB TOTAL</span>
                  <span>₹{data.consultationFee}</span>
                </div>

                <div className="flex justify-between font-bold">
                  <span>Other TOTAL</span>
                  <span>₹{data.otherCharges}</span>
                </div>

                <div className="flex justify-between font-bold">
                  <span>Discount</span>
                  <span>-₹{data.discount}</span>
                </div>

                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>TOTAL</span>
                  <span>₹{data.totalAmount}</span>
                </div>
              </div>

              {/* SIGNATURE */}
              <div className="flex justify-end mt-12 no-break">
                <div className="text-center">
                  <div className="border-b w-40 mb-1"></div>
                  <p className="text-sm">Doctor's Signature</p>
                </div>
              </div>
              <div className="px-4 py-4 text-center text-sm space-y-2 bg-transparent">
                <div className="flex justify-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Phone className="text-[#2D9AD9] w-4" />
                    <span className="font-semibold">+91 8485 222 333</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="text-[#2D9AD9] w-4" />
                    <span className="font-semibold">john@gmail.com</span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="flex items-start gap-2 max-w-md">
                    <MapPin className="text-white bg-[#2D9AD9] rounded-full p-1 w-5 mt-1" />
                    <span className="font-semibold">
                      golden city center , chhatrapati sambhajinager
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== FOOTER DECOR ===== */}
            <div className="relative pdf-footer">
              <img
                src=".././images/invoice5.png"
                alt=""
                className="absolute left-0 bottom-0 w-[200px]"
              />

              <img
                src=".././images/invoice4.png"
                alt=""
                className="absolute right-0 bottom-0 w-[200px]"
              />
            </div>

          </div>
        </div>

        {/* ================= ACTION BAR ================= */}
        <div className="bg-white px-6 py-4 shadow print:hidden">
          <div className="flex gap-4 max-w-[794px] mx-auto">
            <button onClick={handlePrint} className="flex-1 bg-blue-500 text-white py-3 rounded-xl flex gap-2 justify-center">
              <Printer /> Print
            </button>
            <button onClick={handleDownloadPDF} className="flex-1 bg-orange-500 text-white py-3 rounded-xl flex gap-2 justify-center">
              <Download /> Download
            </button>
            <button onClick={handleShare} className="flex-1 bg-green-500 text-white py-3 rounded-xl flex gap-2 justify-center">
              <Share2 /> Share
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InvoiceTemplate;
