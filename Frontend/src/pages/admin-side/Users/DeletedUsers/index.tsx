// src/pages/admin/users/DeletedUsers.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableHeader, TableRow,
} from "@/component/admin/ui/table";
import Badge from "@/component/admin/ui/badge/Badge";
import useFetchAuthData from "@/hooks/useFetchAuthData";
import { toast } from "react-toastify";

interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "user" | "admin";
  isVerified: boolean;
  createdAt: string;
  profileImage?: string;
}

export default function DeletedUsers() {
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(false);
  const limit = 15;

  const url =
    `${import.meta.env.VITE_API_BACKEND_URL}/users/admin/all-users?deleted=true` +
    `&page=${page}&limit=${limit}`;

  const { data, loading, error } = useFetchAuthData<{
    users: User[];
    page: number;
    limit: number;
    totalCount: number;
  }>(url, reload);

  const restore = async (id: string) => {
    await axios.put(
      `${import.meta.env.VITE_API_BACKEND_URL}/users/admin/restore/${id}`,
      {},
      { withCredentials: true }
    );
    toast.success("User restored");
    setReload(r => !r);
  };

  return (
    <div className="overflow-hidden rounded-2xl border bg-white p-6 dark:bg-gray-900">
      <h2 className="text-xl font-semibold mb-4">Deleted Users</h2>

      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center py-6">Loading…</p>
        ) : error ? (
          <p className="text-center py-6 text-red-500">Error loading users.</p>
        ) : (
          <>
            <Table className="w-full table-fixed">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableCell isHeader className="w-[25%]">User</TableCell>
                  <TableCell isHeader className="w-[25%]">Email</TableCell>
                  <TableCell isHeader className="w-[10%]">Role</TableCell>
                  <TableCell isHeader className="w-[15%]">Verified</TableCell>
                  <TableCell isHeader className="w-[15%]">Deleted At</TableCell>
                  <TableCell isHeader className="w-[10%]">Actions</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="space-y-2">
                {data?.users.map(u => (
                  <TableRow key={u._id} className="bg-white shadow-sm rounded-lg ">
                    <TableCell className="p-2">
                      <div className="flex items-center gap-3">
                        {u.profileImage ? (
                          <img src={u.profileImage} alt={u.first_name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
                            {u.first_name[0]}
                          </div>
                        )}
                        <span>{u.first_name} {u.last_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell className="capitalize">{u.role}</TableCell>
                    <TableCell>
                      <Badge color={u.isVerified ? "success" : "warning"}>
                        {u.isVerified ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => restore(u._id)}
                        className="text-blue-600 hover:underline"
                      >
                        Restore
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-center mt-4">
              {Array.from({ length: Math.ceil((data?.totalCount || 0) / (data?.limit || limit)) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setPage(i + 1); window.scrollTo({ top: 0 }); }}
                  className={`px-3 py-1 mx-1 rounded ${page === i + 1 ? "bg-brand-500 text-white" : "bg-gray-100"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
