import { useState, useMemo } from "react";
import Layout from "../../components/layout/Layout";
import Table from "../../components/tables/Table";
import {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from "../../store/Api/employeeApi";
import { toast } from "react-toastify";

const Employees = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ API Hooks
  const hotelId = localStorage.getItem("hotelId");
  const { data, isLoading, error } = useGetEmployeesQuery(hotelId);
  const [createEmployee] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const employees = useMemo(() => {
    if (!Array.isArray(data?.data)) return [];
    return data.data;
  }, [data]);

  // ✅ Search
  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (emp) =>
        emp.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        emp.email?.toLowerCase().includes(search.toLowerCase()) ||
        emp.role?.toLowerCase().includes(search.toLowerCase())
    );
  }, [employees, search]);

  const totalPages = Math.ceil(filteredEmployees.length / limit);

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  // ✅ Add
  const handleAdd = () => {
    setEditEmployee(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      role: "",
      password: "",
      confirmPassword: "",
    });
    setIsModalOpen(true);
  };

  // ✅ Edit
  const handleEdit = (employee) => {
    setEditEmployee(employee);
    setFormData({
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      password: "",
      confirmPassword: "",
    });
    setIsModalOpen(true);
  };

  // ✅ Delete
  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this employee`
    );

    if (!confirmDelete) return;

    try {
      await deleteEmployee(id).unwrap();
      toast.success("Employee deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Delete failed");
    }
  };

  // ✅ Submit (Add + Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.role) {
      return toast.error("All fields are required");
    }

    try {
      if (!editEmployee) {
        if (!formData.password || !formData.confirmPassword) {
          return toast.error("Password required");
        }

        if (formData.password !== formData.confirmPassword) {
          return toast.error("Passwords do not match");
        }

        await createEmployee(formData).unwrap();
        toast.success("Employee added successfully");
      } else {
        await updateEmployee({
          id: editEmployee._id,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
        }).unwrap();

        toast.success("Employee updated successfully");
      }

      setIsModalOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const columns = [
    { label: "Full Name", key: "fullName" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Role", key: "role" },
    {
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(row._id, row.fullName)}
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
      <div className="mb-6 mt-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Employees</h1>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
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

      <Table columns={columns} data={paginatedEmployees} loading={isLoading} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 border rounded"
          >
            Prev
          </button>

          <span>
            {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 border rounded"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal (same as your UI — no design change) */}
      {/* Keep your existing modal JSX exactly same */}
    </Layout>
  );
};

export default Employees;