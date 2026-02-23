import { useState, useMemo } from "react";
import Layout from "../../components/layout/Layout";
import Table from "../../components/tables/Table";
import Skeleton from "../../components/ui/Skeleton";
import { useUpdateHotelStatusMutation } from "../../store/Api/hotelApi"
import {
  useGetHotelsQuery,
  useAddHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
} from "../../store/Api/hotelApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Hotels = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editHotel, setEditHotel] = useState(null);
  const [updateHotelStatus] = useUpdateHotelStatusMutation();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    phone: "",
    email: "",
    adminUsername: "",
    adminName: "",
    adminPassword: "",
    confirmPassword: "",
  });

  // ✅ Fetch Hotels

  const { data, isLoading, isError } = useGetHotelsQuery();

  const [addHotel, { isLoading: addLoading }] = useAddHotelMutation();
  const [updateHotel, { isLoading: updateLoading }] = useUpdateHotelMutation();
  const [deleteHotel] = useDeleteHotelMutation();

  // ✅ Sort latest first
  const allHotels = useMemo(() => {
    if (!Array.isArray(data?.data)) return [];
    return [...data.data].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [data]);

  // ✅ Search
  const filteredHotels = useMemo(() => {
    return allHotels.filter((hotel) =>
      hotel.name?.toLowerCase().includes(search.toLowerCase()) ||
      hotel.email?.toLowerCase().includes(search.toLowerCase()) ||
      hotel.phone?.toLowerCase().includes(search.toLowerCase()) ||
      hotel.city?.toLowerCase().includes(search.toLowerCase())
    );
  }, [allHotels, search]);

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
      name: "",
      address: "",
      city: "",
      country: "",
      phone: "",
      email: "",
      adminUsername: "",
      adminName: "",
      adminPassword: "",
      confirmPassword: "",
    });
    setIsModalOpen(true);
  };

  // ✅ Open Edit Modal
  const handleEdit = (hotel) => {
    setEditHotel(hotel);
    setFormData({
      name: hotel.name || "",
      address: hotel.address || "",
      city: hotel.city || "",
      country: hotel.country || "",
      phone: hotel.phone || "",
      email: hotel.email || "",
      password: "",
      confirmPassword: "",
    });
    setIsModalOpen(true);
  };
  const handleView = (id) => {
    navigate(`/hotelDetails/${id}`);
  };
  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "approved" : "pending";

    if (!window.confirm(`Are you sure you want to ${newStatus} this hotel?`)) return;

    try {
      await updateHotelStatus({ id, status: newStatus }).unwrap();
      alert("Status updated successfully!");
    } catch (error) {
      alert(error?.data?.message || "Failed to update status");
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    try {
      await deleteHotel(id).unwrap();
      alert("Hotel deleted successfully!");
    } catch (error) {
      alert(error?.data?.message || "Failed to delete hotel");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Hotel name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^[0-9]{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 7–15 digits";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (!editHotel) {
      if (!formData.adminName.trim()) {
        newErrors.adminName = "Admin name is required";
      }

      if (!formData.adminUsername.trim()) {
        newErrors.adminUsername = "Admin username is required";
      }

      if (!formData.adminPassword) {
        newErrors.adminPassword = "Password is required";
      } else if (formData.adminPassword.length < 6) {
        newErrors.adminPassword = "Password must be at least 6 characters";
      }

      if (formData.adminPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FORM SUBMITTED");

    if (!validateForm()) return;

    try {
      if (!editHotel) {
        const resp = await addHotel({
          name: formData.name,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          phone: formData.phone,
          email: formData.email,
          adminUsername: formData.adminUsername,
          adminPassword: formData.adminPassword,
          adminName: formData.adminName,
        }).unwrap();

        console.log("Add Response:", resp);
        toast.success("Hotel added successfully");
      } else {
        const resp = await updateHotel({
          id: editHotel._id,
          body: {
            name: formData.name,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            phone: formData.phone,
            email: formData.email,
          },
        }).unwrap();

        console.log("Update Response:", resp);
        toast.success("Hotel updated successfully");
      }

      setIsModalOpen(false);
      setEditHotel(null);
    } catch (error) {
      console.error("API ERROR:", error);
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  // ✅ Table Columns
  const columns = [
    {
      label: "Hotel Name",
      render: (row) => row.name || "N/A",
    },
    {
      label: "Admin",
      render: (row) => row.admin?.profile?.name || "N/A",
    },
    {
      label: "City",
      render: (row) => row.city || "N/A",
    },
    {
      label: "Phone",
      render: (row) => row.phone || "N/A",
    },
    {
      label: "Email",
      render: (row) => row.email || "N/A",
    },

    {
      label: "Status",
      render: (row) => {
        const status =
          row.status === "active"
            ? "approved"
            : row.status;

        return (
          <button
            onClick={() =>
              status === "pending" &&
              handleStatusUpdate(row._id, status)
            }
            disabled={status !== "pending"}
            className={`px-3 py-1 rounded text-xs text-white ${status === "approved"
              ? "bg-green-600 cursor-not-allowed"
              : status === "rejected"
                ? "bg-red-600 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        );
      },
    },

    // ✅ ACTION COLUMN
    {
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(row._id)}
            className="px-3 py-1 bg-[#048314] text-white rounded text-xs"
          >
            View
          </button>

          <button
            onClick={() => handleEdit(row)}
            disabled={row.status === "approved"}
            className={`px-3 py-1 rounded text-xs ${row.status === "approved"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white"
              }`}
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

  if (isError) {
    return (
      <Layout>
        <p className="text-red-500">Failed to load hotels</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mt-6 mb-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          Hotels ({filteredHotels.length})
        </h1>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded"
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
        <div className="sm:text-base text-xs">
          {isLoading ? (
            <div className="bg-white p-4 rounded-xl shadow-sm">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center mb-4">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <Table columns={columns} data={paginatedHotels} loading={isLoading} />
          )}
        </div>
      </div>

      {/* Modal remains same as yours */}
      {/* Pagination */}
      {!isLoading && (
        <div className="flex justify-end gap-2 mt-6">
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
      )}

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
            {/* Close Button */}
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
              <div>
                <input
                  type="text"
                  placeholder="Hotel Name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setErrors({ ...errors, name: "" });
                  }}
                  className={`w-full border px-4 py-2 rounded ${errors.name ? "border-red-500" : "border-gray-200"
                    }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors({ ...errors, email: "" });
                  }}
                  className={`w-full border px-4 py-2 rounded ${errors.email ? "border-red-500" : "border-gray-200"
                    }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    setErrors({ ...errors, phone: "" });
                  }}
                  className={`w-full border px-4 py-2 rounded ${errors.phone ? "border-red-500" : "border-gray-200"
                    }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full border border-gray-200 px-4 py-2 rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => {
                      setFormData({ ...formData, city: e.target.value });
                      setErrors({ ...errors, city: "" });
                    }}
                    className={`w-full border px-4 py-2 rounded ${errors.city ? "border-red-500" : "border-gray-200"
                      }`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Country"
                    value={formData.country}
                    onChange={(e) => {
                      setFormData({ ...formData, country: e.target.value });
                      setErrors({ ...errors, country: "" });
                    }}
                    className={`w-full border px-4 py-2 rounded ${errors.country ? "border-red-500" : "border-gray-200"
                      }`}
                  />
                  {errors.country && (
                    <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                  )}
                </div>
              </div>
              {/* Admin Fields only when Adding */}
              {!editHotel && (
                <>
                  <div>
                    <input
                      type="text"
                      placeholder="Admin Name"
                      value={formData.adminName}
                      onChange={(e) => {
                        setFormData({ ...formData, adminName: e.target.value });
                        setErrors({ ...errors, adminName: "" });
                      }}
                      className={`w-full border px-4 py-2 rounded ${errors.adminName ? "border-red-500" : "border-gray-200"
                        }`}
                    />
                    {errors.adminName && (
                      <p className="text-red-500 text-xs mt-1">{errors.adminName}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Admin Username"
                      value={formData.adminUsername}
                      onChange={(e) => {
                        setFormData({ ...formData, adminUsername: e.target.value });
                        setErrors({ ...errors, adminUsername: "" });
                      }}
                      className={`w-full border px-4 py-2 rounded ${errors.adminUsername ? "border-red-500" : "border-gray-200"
                        }`}
                    />
                    {errors.adminUsername && (
                      <p className="text-red-500 text-xs mt-1">{errors.adminUsername}</p>
                    )}
                  </div>
                </>
              )}

              {/* Passwords only when adding a hotel */}
              {!editHotel && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="password"
                        placeholder="Password"
                        value={formData.adminPassword}
                        onChange={(e) => {
                          setFormData({ ...formData, adminPassword: e.target.value });
                          setErrors({ ...errors, adminPassword: "" });
                        }}
                        className={`w-full border px-4 py-2 rounded ${errors.adminPassword ? "border-red-500" : "border-gray-200"
                          }`}
                      />
                      {errors.adminPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.adminPassword}</p>
                      )}
                    </div>

                    <div>
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={(e) => {
                          setFormData({ ...formData, confirmPassword: e.target.value });
                          setErrors({ ...errors, confirmPassword: "" });
                        }}
                        className={`w-full border px-4 py-2 rounded ${errors.confirmPassword ? "border-red-500" : "border-gray-200"
                          }`}
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={addLoading || updateLoading}
                className="w-full py-2 bg-indigo-600 text-white rounded font-medium disabled:opacity-50"
              >
                {editHotel
                  ? updateLoading
                    ? "Updating..."
                    : "Update Hotel"
                  : addLoading
                    ? "Adding..."
                    : "Add Hotel"}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Hotels;
