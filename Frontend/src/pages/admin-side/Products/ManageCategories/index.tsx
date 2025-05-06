import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/component/admin/ui/table";
import Badge from "@/component/admin/ui/badge/Badge";
import useFetchAuthData from "@/hooks/useFetchAuthData";
import { useDeleteData } from "@/hooks/useDeleteData";
import DeleteCategoryModal from "./Modals/DeleteCategoryModal";
import CategoryModal from "./Modals/CategoryModal";
import { Category } from "@/types/Category";
import { toast } from "react-toastify";
import { useDeleteAuthData } from "@/hooks/useDeleteAuthData";

const LIMIT = 15;

export default function ManageCategories() {
  /* local state -------------------------------------------------- */
  const [search, setSearch]       = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage]           = useState(1);
  const [reload, setReload]       = useState(false);

  /* add / edit / delete state */
  const [selected, setSelected]   = useState<Category | null>(null); // for delete
  const [modalOpen, setModalOpen] = useState(false);

  const [editCat, setEditCat]     = useState<Category | null>(null); // for add + edit
  const [editOpen, setEditOpen]   = useState(false);

  /* debounce search --------------------------------------------- */
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  /* build API url ----------------------------------------------- */
  const url =
    `${import.meta.env.VITE_API_BACKEND_URL}/categories?page=${page}&limit=${LIMIT}` +
    (debounced ? `&name=${debounced}` : "");

  const { data, loading, error } = useFetchAuthData<{
    categories: Category[];
    totalCount: number;
    limit: number;
    page: number;
  }>(url, reload);

  /* deletion ----------------------------------------------------- */
  const { onDelete } = useDeleteAuthData();
  const confirmDelete = async () => {
    if (!selected) return;
    await onDelete(
      `${import.meta.env.VITE_API_BACKEND_URL}/categories`,
      selected._id
    );
    setReload((r) => !r);
    setModalOpen(false);
  };

  /* save (add or update) ---------------------------------------- */
  const handleSave = async (payload: Partial<Category>) => {
    try {
      if (editCat) {
        // update
        await axios.put(
          `${import.meta.env.VITE_API_BACKEND_URL}/categories/${editCat._id}`,
          payload,
          { withCredentials: true }
        );
        toast.success("Category updated");
      } else {
        // create
        await axios.post(
          `${import.meta.env.VITE_API_BACKEND_URL}/categories`,
          payload,
          { withCredentials: true }
        );
        toast.success("Category created");
      }
      setReload((r) => !r);
      setEditOpen(false);
    } catch (e) {
      toast.error("Save failed");
      console.error(e);
    }
  };

  /* pagination helper ------------------------------------------- */
  const pages = Math.ceil((data?.totalCount || 0) / LIMIT);

  return (
    <div className="overflow-hidden rounded-2xl border bg-white p-6 dark:bg-gray-900">
      {/* header --------------------------------------------------- */}
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Manage Categories
        </h2>

        <div className="flex gap-3">
          <input
            className="border rounded px-3 py-2 text-sm w-64"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={() => {
              setEditCat(null);     // null → add‑mode
              setEditOpen(true);
            }}
            className="rounded bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            + Add
          </button>
        </div>
      </header>

      {/* table ---------------------------------------------------- */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="py-6 text-center">Loading…</p>
        ) : error ? (
          <p className="py-6 text-center text-red-500">Error fetching data</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell isHeader>Name</TableCell>
                  <TableCell isHeader>Description</TableCell>
                  <TableCell isHeader>Image</TableCell>
                  <TableCell isHeader>Status</TableCell>
                  <TableCell isHeader>Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.categories?.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.description ?? "—"}</TableCell>
                    <TableCell>
                      {c.imageUrl ? (
                        <img
                          src={c.imageUrl}
                          alt={c.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge color={c.isDeleted ? "danger" : "success"}>
                        {c.isDeleted ? "Deleted" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => {
                            setEditCat(c);
                            setEditOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => {
                            setSelected(c);
                            setModalOpen(true);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* pagination */}
            <div className="mt-4 flex justify-center gap-1">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    page === i + 1
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* modals --------------------------------------------------- */}
      <DeleteCategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        category={selected}
      />

      <CategoryModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={editCat}
        onSave={handleSave}
      />
    </div>
  );
}
