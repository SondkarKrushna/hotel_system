import { useState, useMemo, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import Table from "../../components/tables/Table";
import {
    useGetDishesQuery,
    useCreateDishMutation,
    useUpdateDishMutation,
    useDeleteDishMutation,
} from "../../store/Api/dishApi";
import { useGetCategoriesQuery } from "../../store/Api/categoryApi";
import { toast } from "react-toastify";

const Dishes = () => {
    const [errors, setErrors] = useState({});
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDish, setSelectedDish] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const limit = 10;
    const user = useMemo(() => {
        return JSON.parse(localStorage.getItem("adminUser"));
    }, []);
    console.log("user==", user)

    const userRole = user?.role;
    const hotelId = user?.hotel;

    const isSuperAdmin = userRole === "SUPER_ADMIN";
    const isHotelAdmin = userRole === "HOTEL_ADMIN";
    const isAdmin = userRole === "HOTEL_ADMIN";


    const { data, isLoading, isError } = useGetDishesQuery({
        role: userRole,
        hotelId,
        page: currentPage,
        limit,
    });

    useEffect(() => {
        console.log("useGetDishesQuery ->", { data, isLoading, isError });
    }, [data, isLoading, isError]);
    const [createDish] = useCreateDishMutation();
    const [updateDish] = useUpdateDishMutation();
    const [deleteDish] = useDeleteDishMutation();


    const { data: categoryData, isLoading: catLoading } = useGetCategoriesQuery({
        role: userRole,
        hotelId,
        page: currentPage,
        limit,
    });
    const categories = useMemo(() => {
        if (!Array.isArray(categoryData?.data)) return [];
        return categoryData.data;
    }, [categoryData]);

    const allDishes = useMemo(() => {
        if (Array.isArray(data?.data)) return data.data;
        if (Array.isArray(data)) return data;
        return [];
    }, [data]);

    const filteredDishes = useMemo(() => {
        return allDishes.filter((dish) =>
            dish.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [allDishes, search]);

    // Get totalPages from API response pagination object
    const totalPages = data?.pagination?.totalPages || Math.ceil(filteredDishes.length / limit);

    // Use server-provided page data when not searching; when searching, paginate client-side
    const paginatedDishes = search
        ? filteredDishes.slice((currentPage - 1) * limit, currentPage * limit)
        : allDishes;

    // ✅ Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    // 🔹 Handle Save (Add + Edit)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const name = formData.get("name")?.trim();
        const price = formData.get("price");
        const type = formData.get("type");
        const isAvailable = formData.get("isAvailable");
        const category = formData.get("category");
        console.log("form data-===", category)

        let newErrors = {};

        if (!name) newErrors.name = "Dish name is required";

        if (!price) {
            newErrors.price = "Price is required";
        } else if (Number(price) <= 0) {
            newErrors.price = "Price must be greater than 0";
        }

        if (!category) newErrors.category = "Category is required";

        setErrors(newErrors);

        if (Object.keys(newErrors).length !== 0) return;

        const payload = {
            name,
            price: Number(price),
            type,
            isAvailable: isAvailable === "true",
            category: category,
        };

        try {
            if (selectedDish) {
                await updateDish({ id: selectedDish._id || selectedDish.id, ...payload }).unwrap();
                toast.success("Dish updated successfully ✅");
            } else {
                await createDish(payload).unwrap();
                toast.success("Dish added successfully ✅");
            }

            setOpenModal(false);
            setSelectedDish(null);
            setErrors({});
        } catch (error) {
            toast.error(error?.data?.message || "Something went wrong ❌");
            setErrors({
                apiError: error?.data?.message || "Something went wrong",
            });
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this dish?"
        );

        if (!confirmDelete) return;

        try {
            await deleteDish(id).unwrap();
            toast.success("Dish deleted successfully 🗑️");
        } catch (error) {
            toast.error(error?.data?.message || "Delete failed ❌");
        }
    };

    const columns = [
        { label: "Name", key: "name" },
        {
            label: "Category",
            render: (row) => row.category?.name || "N/A",
        },
        {
            label: "Price",
            render: (row) => `₹${row.price}`,
        },
        { label: "Type", key: "type" },
        {
            label: "Available",
            render: (row) => (
                <span
                    className={
                        row.isAvailable ? "text-green-600" : "text-red-600"
                    }
                >
                    {row.isAvailable ? "Yes" : "No"}
                </span>
            ),
        },

        // ✅ Conditionally add Actions column
        ...(isAdmin
            ? [
                {
                    label: "Actions",
                    render: (row) => (
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setSelectedDish(row);
                                    setOpenModal(true);
                                }}
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
            ]
            : []),
    ];

    return (
        <Layout>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 mb-6 gap-4">
                <h1 className="text-xl md:text-2xl font-semibold">All Dishes</h1>

                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Search dish..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-4 py-2 rounded text-sm md:text-base"
                    />
                    {isAdmin && (
                        <button
                            onClick={() => {
                                setSelectedDish(null);
                                setOpenModal(true);
                            }}
                            className="bg-indigo-600 text-white px-4 py-2 rounded text-sm md:text-base whitespace-nowrap"
                        >
                            + Add Dish
                        </button>
                    )}
                </div>
            </div>

            <Table
                columns={columns}
                data={paginatedDishes}
                loading={isLoading}
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-wrap justify-center md:justify-end gap-2 md:gap-3 mt-6">
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 md:px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-sm md:text-base"
                    >
                        Previous
                    </button>

                    <span className="px-3 md:px-4 py-2 text-sm md:text-base">
                        Page {currentPage} of {totalPages || 1}
                    </span>

                    <button
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                            )
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 md:px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-sm md:text-base"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* ✅ Modal */}
            {openModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setOpenModal(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                    >
                        <h2 className="text-lg font-semibold mb-4">
                            {selectedDish ? "Edit Dish" : "Add Dish"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            {errors.apiError && (
                                <p className="text-red-500 text-sm text-center">
                                    {errors.apiError}
                                </p>
                            )}

                            <input
                                name="name"
                                defaultValue={selectedDish?.name}
                                placeholder="Dish Name"
                                className={`border w-full px-3 py-2 rounded ${errors.name
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm">
                                    {errors.name}
                                </p>
                            )}

                            <input
                                name="price"
                                type="number"
                                defaultValue={selectedDish?.price}
                                placeholder="Price"
                                className={`border w-full px-3 py-2 rounded ${errors.price
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                            />
                            {errors.price && (
                                <p className="text-red-500 text-sm">
                                    {errors.price}
                                </p>
                            )}

                            <select
                                name="type"
                                defaultValue={selectedDish?.type || "veg"}
                                className="border w-full px-3 py-2 rounded text-sm"
                            >
                                <option value="veg">Veg</option>
                                <option value="non-veg">Non Veg</option>
                            </select>

                            <select
                                name="isAvailable"
                                defaultValue={
                                    selectedDish?.isAvailable?.toString() ||
                                    "true"
                                }
                                className="border w-full px-3 py-2 rounded text-sm"
                            >
                                <option value="true">Available</option>
                                <option value="false">Not Available</option>
                            </select>

                            <select
                                name="category"
                                disabled={catLoading}
                                defaultValue={
                                    selectedDish?.category?._id || ""
                                }
                                className={`border w-full px-3 py-2 rounded text-sm ${errors.category
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                            >
                                <option value="">
                                    {catLoading
                                        ? "Loading..."
                                        : "Select Category"}
                                </option>

                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            {errors.category && (
                                <p className="text-red-500 text-sm">
                                    {errors.category}
                                </p>
                            )}

                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setOpenModal(false)}
                                    className="px-4 py-2 bg-gray-200 rounded text-sm"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded text-sm"
                                >
                                    {selectedDish ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Dishes;