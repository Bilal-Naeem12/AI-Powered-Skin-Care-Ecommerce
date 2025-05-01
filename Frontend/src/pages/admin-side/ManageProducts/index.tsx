import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/component/admin/ui/table";
import Badge from "@/component/admin/ui/badge/Badge";
import { Product } from "@/types/Product";
import useFetchData from "@/hooks/useFetchData";
import { useDeleteData } from "@/hooks/useDeleteData";
import DeleteProductModal from "./Modals/DeleteProductModal";
import EditProductModal from "./Modals/EditProductModal";
import { toast } from "react-toastify";
import { ProductFormValues } from "./Modals/EditProductModal";
export default function ManageProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 15;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const { onDelete } = useDeleteData();
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const url = `${import.meta.env.VITE_API_BACKEND_URL}/products?page=${page}&limit=${limit}` +
    (debouncedSearch ? `&name=${debouncedSearch}` : "");

  const { data, loading, error } = useFetchData<{
    products: Product[];
    page: number;
    limit: number;
    totalCount: number;
  }>(url, reload);

  const handlePageChange = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    await onDelete(
      `${import.meta.env.VITE_API_BACKEND_URL}/products`,
      selectedProduct._id
    );
    setReload(r => !r);
    setModalOpen(false);
  };

  const handleEditClick = (prod: Product) => {
    setEditProduct(prod);
    setEditOpen(true);
  };

  const handleSave = async (
    values: ProductFormValues,
    newFiles: File[],
    removedUrls: string[]
  ) => {
    // 1️⃣ Build multipart payload
    const form = new FormData();
    form.append("data", JSON.stringify(values));
    form.append("removedUrls", JSON.stringify(removedUrls));
    newFiles.forEach((file) => form.append("images", file));
  
    // 2️⃣ DEBUG: log every form key/value
    console.group("🛠️ handleSave FormData");
    form.forEach((val, key) => {
      console.log(key, val);
      if (key === "removedUrls") {
        try {
          console.log("→ parsed removedUrls:", JSON.parse(val as string));
        } catch {
          console.warn("→ removedUrls parse failed:", val);
        }
      }
    });
    console.groupEnd();
  
    // 3️⃣ Submit
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BACKEND_URL}/products/${editProduct?._id}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      // console.log("🚀 update response:", res.data);
      toast.success("Product updated");
      setReload((r) => !r);
      setEditOpen(false);
    } catch (e) {
      console.error("❌ handleSave error:", e);
      toast.error("Update failed");
    }
  };
  return (
    <div className="overflow-hidden rounded-2xl border bg-white p-6 dark:bg-gray-900">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Manage Products</h2>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-64"
        />
      </header>

      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center py-6">Loading...</p>
        ) : error ? (
          <p className="text-center py-6 text-red-500">Error loading products.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell isHeader>Product</TableCell>
                  <TableCell isHeader>Category</TableCell>
                  <TableCell isHeader>Brand</TableCell>
                  <TableCell isHeader>Price</TableCell>
                  <TableCell isHeader>Status</TableCell>
                  <TableCell isHeader>Stock</TableCell>
                  <TableCell isHeader>Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.products.map(prod => (
                  <TableRow key={prod._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={prod.images[0]} alt={prod.name} className="w-12 h-12 object-cover rounded"/>
                        <span>{prod.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{prod.category}</TableCell>
                    <TableCell>{prod.brand}</TableCell>
                    <TableCell>${prod.discount?.discountedPrice ?? prod.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge size="sm" color={prod.isAvailable ? "success" : "warning"}>
                        {prod.isAvailable ? "Available" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell>{prod.stock}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(prod)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => { setSelectedProduct(prod); setModalOpen(true); }}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
              {Array.from({ length: Math.ceil((data?.totalCount||0)/(data?.limit||limit)) }).map((_,i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i+1)}
                  className={`px-3 py-1 mx-1 rounded ${page===i+1? 'bg-brand-500 text-white':'bg-gray-100'}`}
                >{i+1}</button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <DeleteProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
        product={selectedProduct}
      />

      <EditProductModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={editProduct}
        onSave={handleSave}
      />
    </div>
  );
}
