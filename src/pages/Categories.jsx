import { useState, useMemo } from "react";
import Layout from "../components/layout/Layout";
import Table from "../components/tables/Table";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../store/Api/categoryApi";

const Categories = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const limit = 10;

  const { data, isLoading, isError } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const allCategories = useMemo(() => {
    if (!Array.isArray(data?.data)) return [];
    return [...data.data].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [data]);

  const filteredCategories = useMemo(() => {
    return allCategories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [allCategories, search]);

  const totalPages = Math.ceil(filteredCategories.length / limit);

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  // 🔹 Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const payload = {
      name: formData.get("name"),
    };

    if (selectedCategory) {
      await updateCategory({ id: selectedCategory.id, ...payload });
    } else {
      await createCategory(payload);
    }

    setOpenModal(false);
    setSelectedCategory(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      await deleteCategory(id);
    }
  };

  const columns = [
    { label: "Name", key: "name" },

    {
      label: "Created At",
      render: (row) =>
        new Date(row.createdAt).toLocaleDateString(),
    },

    {
      label: "Actions",
      render: (row) => (
        <div className="flex gap-3">
          <button
            onClick={() => {
              setSelectedCategory(row);
              setOpenModal(true);
            }}
            className="text-blue-600"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600"
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
        <p className="text-red-500">Failed to load categories</p>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex justify-between items-center mt-6 mb-6">
        <h1 className="text-xl font-semibold">All Categories</h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search category..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-4 py-2 rounded"
          />

          <button
            onClick={() => {
              setSelectedCategory(null);
              setOpenModal(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            + Add Category
          </button>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedCategories}
        loading={isLoading}
      />

      {/* Pagination */}
      {!isLoading && (
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="px-4 py-2">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, totalPages)
              )
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {openModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setOpenModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-xl w-full max-w-md"
          >
            <h2 className="text-lg font-semibold mb-4">
              {selectedCategory ? "Edit Category" : "Add Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                defaultValue={selectedCategory?.name}
                placeholder="Category Name"
                required
                className="border border-gray-200 w-full px-3 py-2 rounded"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  {selectedCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Categories;