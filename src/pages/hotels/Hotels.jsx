import { useState, useMemo } from "react";
import Layout from "../../components/layout/Layout";
import Table from "../../components/tables/Table";

const Hotels = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editHotel, setEditHotel] = useState(null);

  // ✅ STATIC DATA
  const [hotels, setHotels] = useState([
    {
      _id: "1",
      fullName: "Rahul Sharma",
      email: "rahul@gmail.com",
      hotelName: "Taj Hotel",
      phone: "9876543210",
      createdAt: "2025-01-10",
    },
    {
      _id: "2",
      fullName: "Monika Nikam",
      email: "monika@gmail.com",
      hotelName: "Parksyde Nest",
      phone: "9876500000",
      createdAt: "2025-01-15",
    },
    {
      _id: "3",
      fullName: "Amit Patil",
      email: "amit@gmail.com",
      hotelName: "Oberoi",
      phone: "9998887776",
      createdAt: "2025-01-18",
    },
    {
      _id: "4",
      fullName: "Neha Deshmukh",
      email: "neha@gmail.com",
      hotelName: "Radisson Blue",
      phone: "9123456789",
      createdAt: "2025-01-20",
    },
  ]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    hotelName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ Search hotels
  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) =>
      hotel.hotelName?.toLowerCase().includes(search.toLowerCase()) ||
      hotel.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      hotel.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [hotels, search]);

  // ✅ Pagination
  const totalPages = Math.ceil(filteredHotels.length / limit);

  const paginatedHotels = filteredHotels.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  // ✅ Open Add Modal
  const handleAdd = () => {
    setEditHotel(null);
    setFormData({
      fullName: "",
      email: "",
      hotelName: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setIsModalOpen(true);
  };

  // ✅ Open Edit Modal
  const handleEdit = (hotel) => {
    setEditHotel(hotel);
    setFormData({
      fullName: hotel.fullName,
      email: hotel.email,
      hotelName: hotel.hotelName,
      phone: hotel.phone,
      password: "",
      confirmPassword: "",
    });
    setIsModalOpen(true);
  };

  // ✅ Delete Hotel
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;

    setHotels((prev) => prev.filter((hotel) => hotel._id !== id));
    alert("Hotel deleted successfully!");
  };

  // ✅ Handle Submit (Add / Update)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.hotelName || !formData.phone) {
      return alert("All fields are required!");
    }

    if (!editHotel) {
      if (!formData.password || !formData.confirmPassword) {
        return alert("Password and Confirm Password required!");
      }

      if (formData.password !== formData.confirmPassword) {
        return alert("Passwords do not match!");
      }

      const newHotel = {
        _id: Date.now().toString(),
        fullName: formData.fullName,
        email: formData.email,
        hotelName: formData.hotelName,
        phone: formData.phone,
        createdAt: new Date().toISOString(),
      };

      setHotels((prev) => [newHotel, ...prev]);
      alert("Hotel added successfully!");
    } else {
      setHotels((prev) =>
        prev.map((hotel) =>
          hotel._id === editHotel._id
            ? {
                ...hotel,
                fullName: formData.fullName,
                email: formData.email,
                hotelName: formData.hotelName,
                phone: formData.phone,
              }
            : hotel
        )
      );

      alert("Hotel updated successfully!");
    }

    setIsModalOpen(false);
  };

  const columns = [
    {
      label: "Full Name",
      key: "fullName",
      render: (row) => row.fullName || "N/A",
    },
    {
      label: "Email",
      key: "email",
      render: (row) => row.email || "N/A",
    },
    {
      label: "Hotel Name",
      key: "hotelName",
      render: (row) => row.hotelName || "N/A",
    },
    {
      label: "Phone",
      key: "phone",
      render: (row) => row.phone || "N/A",
    },
    {
      label: "Actions",
      key: "actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(row._id)}
            className="px-3 py-1 bg-red-500 text-white rounded text-xs"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      {/* Header + Search + Add Button */}
      <div className="mb-6 mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold">Hotels</h1>
          <p className="text-sm text-gray-500">
            Showing {filteredHotels.length} hotels
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search hotel..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-200 px-4 py-2 rounded w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <Table columns={columns} data={paginatedHotels} />
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-4 py-2">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {editHotel ? "Edit Hotel" : "Add Hotel"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full border border-gray-200 px-4 py-2 rounded"
              />

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-200 px-4 py-2 rounded"
              />

              <input
                type="text"
                placeholder="Hotel Name"
                value={formData.hotelName}
                onChange={(e) =>
                  setFormData({ ...formData, hotelName: e.target.value })
                }
                className="w-full border border-gray-200 px-4 py-2 rounded"
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-gray-200 px-4 py-2 rounded"
              />

              {!editHotel && (
                <>
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full border border-gray-200 px-4 py-2 rounded"
                  />

                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className="w-full border border-gray-200 px-4 py-2 rounded"
                  />
                </>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white rounded font-medium"
              >
                {editHotel ? "Update Hotel" : "Add Hotel"}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Hotels;
