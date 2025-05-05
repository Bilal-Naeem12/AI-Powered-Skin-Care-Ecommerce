// src/pages/admin/users/ManageUsers.tsx
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
import useFetchData from "@/hooks/useFetchData";
import { useDeleteData } from "@/hooks/useDeleteData";
import DeleteUserModal from "./Modals/DeleteUserModal";
import ChangeRoleModal from "./Modals/ChangeRoleModal";
import { toast } from "react-toastify";
import useFetchAuthData from "@/hooks/useFetchAuthData";
import { useDeleteAuthData } from "@/hooks/useDeleteAuthData";
import { Trash, User } from "lucide-react";

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "user" | "admin";
  isVerified: boolean;
  isDeleted: boolean;
  createdAt: string;
  profileImage?: string;
}

export default function ManageUsers() {
  // ─── Local state ────────────────────────────────────────────────
  const [searchTerm, setSearchTerm]         = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage]                     = useState(1);
  const limit                               = 15;
  const [reload, setReload]                 = useState(false);

  const [selectedUser, setSelectedUser]     = useState<User | null>(null);
  const [deleteOpen, setDeleteOpen]         = useState(false);

  const [roleUser, setRoleUser]             = useState<User | null>(null);
  const [roleOpen, setRoleOpen]             = useState(false);

  // ─── Debounce search ────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // ─── Fetch users ────────────────────────────────────────────────
  const url =
    `${import.meta.env.VITE_API_BACKEND_URL}/users/admin/all-users?` +
    `page=${page}&limit=${limit}` +
    (debouncedSearch ? `&name=${debouncedSearch}` : "");

  const { data, loading, error } = useFetchAuthData<{
    users: User[];
    page: number;
    limit: number;
    totalCount: number;
  }>(url, reload);

  // ─── Delete handler ─────────────────────────────────────────────
  const { onDelete, loading:deleteLoading } = useDeleteAuthData();

  const confirmDelete = async () => {
    if (!selectedUser) return;
    await onDelete(
      `${import.meta.env.VITE_API_BACKEND_URL}/users/admin/soft-delete`,
      selectedUser._id
    );
    setReload(r => !r);
    setDeleteOpen(false);
  };

  // ─── Role change handler ────────────────────────────────────────
  const changeRole = async (userId: string, newRole: "user" | "admin") => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BACKEND_URL}/users/admin/change-role`,
        { userId, newRole }
      );
      toast.success("Role updated");
      setReload(r => !r);
      setRoleOpen(false);
    } catch (e) {
      toast.error("Role update failed");
    }
  };

  // ─── Pagination helper ──────────────────────────────────────────
  const onPage = (n: number) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─── UI ─────────────────────────────────────────────────────────
  return (
    <div className="overflow-hidden rounded-2xl border bg-white p-6 dark:bg-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Manage Users
        </h2>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-64"
        />
      </header>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center py-6">Loading...</p>
        ) : error ? (
          <p className="text-center py-6 text-red-500">Error loading users.</p>
        ) : (
          <>
            <Table >
              <TableHeader className=" border-b">
                <TableRow className="">
                  <TableCell isHeader className="">User</TableCell>
                  <TableCell isHeader >Email</TableCell>
       <TableCell isHeader >Role</TableCell>
       <TableCell isHeader>Verified</TableCell>
       <TableCell isHeader >Joined</TableCell>
       <TableCell isHeader >Status</TableCell>
       <TableCell isHeader >Actions</TableCell>
                </TableRow>
              </TableHeader>
       
              <TableBody className="space-y-2">
                {data?.users.map(u => (
                  <TableRow key={u._id} >
                    <TableCell>
                      <div className="flex items-center gap-3 p-5">
                        {u.profileImage ? (
                          <img
                            src={u.profileImage}
                            alt={u.first_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
                            {u.first_name[0]}
                          </div>
                        )}
                        <span>{`${u.first_name} ${u.last_name}`}</span>
                      </div>
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell className="capitalize">{u.role}</TableCell>
                    <TableCell>
                      <Badge color={u.isVerified ? "success" : "warning"}>
                        {u.isVerified ? "Verified" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge color={u.isDeleted ? "danger" : "success"}>
                        {u.isDeleted ? "Deleted" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setRoleUser(u);
                            setRoleOpen(true);
                          }}
                          className="text-blue-500 hover:underline"
                        >
                          <User/>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setDeleteOpen(true);
                          }}
                          className="text-red-600 hover:underline"
                        >
                          <Trash/>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
              {Array.from({
                length: Math.ceil((data?.totalCount || 0) / (data?.limit || limit)),
              }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => onPage(i + 1)}
                  className={`px-3 py-1 mx-1 rounded ${
                    page === i + 1 ? "bg-brand-500 text-white" : "bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* --- Modals -------------------------------------------------- */}
      <DeleteUserModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        user={selectedUser}
      />

      <ChangeRoleModal
        open={roleOpen}
        onClose={() => setRoleOpen(false)}
        user={roleUser}
        onSave={changeRole}
      />
    </div>
  );
}
