"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { MdSupervisorAccount } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { deleteUser, getUsersList } from "@/lib/account";
import { IUser } from "@/lib/auth";
import { toast } from "sonner";
import { LiaEdit } from "react-icons/lia";
import { RiDeleteBinLine } from "react-icons/ri";

export default function AccountsPage() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await getUsersList(page, 10);

            if (res.success) {
                setUsers(res.data.data);
                setLastPage(res.meta.last_page);
            }

            console.log(res)
        };

        fetchUsers();
    }, [page]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        const data = await deleteUser(id);

        if (data.success) {
            // hapus langsung dari state tanpa reload
            setUsers((prev) => prev.filter((u) => u.id !== id));
            toast.success(data.message);
        } else {
            toast.error("Failed: " + data.message);
        }
    };

    const handleNext = () => {
        if (page < lastPage) setPage(page + 1);
    };

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <MdSupervisorAccount className="text-black w-10 h-10" />
                <h1 className="text-3xl font-normal">Accounts</h1>
            </div>

            {/* list accounts */}
            <div className="bg-white mt-12">
                <div className="py-3 px-4 flex justify-between border rounded-t-sm">
                    {/* create user */}
                    <Link href={"/admin/accounts/create"} className="bg-[#31C6D4] text-white px-2 h-10 flex justify-center items-center rounded-sm">
                        Add Data <FiPlus className="w-5 h-5 ml-1" />
                    </Link>
                </div>

                <div className="py-5 px-4 flex flex-col border-b border-x rounded-b-sm">
                    <Table className="">
                        <TableHeader>
                            <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB] border-[#E5E7EB]">
                                <TableHead className="text-center"><input type="checkbox" /></TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-center">Phone</TableHead>
                                <TableHead className="text-center">Role</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} className="hover:bg-gray-50 border-[#E5E7EB]">
                                    <TableCell className="text-center py-6"><input type="checkbox" /></TableCell>

                                    <TableCell className="font-medium text-left">
                                        {user.name}
                                    </TableCell>

                                    <TableCell className="text-center">{user.phone}</TableCell>
                                    <TableCell className="capitalize"><p className={`${user.usertype === "admin" ? "bg-[#DBEAFE] text-[#1E40AF]" : "bg-[#FEF3C7] text-[#92400E]"} rounded-full w-fit py-1 px-3 mx-auto`}>{user.usertype}</p></TableCell>
                                    <TableCell className="text-left">{user.email}</TableCell>

                                    <TableCell className="text-center">
                                        <div className="bg-white w-fit flex space-x-3 items-center mx-auto">
                                            <Link href={`/admin/accounts/edit/${user.id}`}>
                                                {/* <MdEdit className="w-7 h-7" /> */}
                                                <LiaEdit className="w-6 h-6 text-[#00A63E] hover:opacity-70" />
                                            </Link>
                                            {/* <FaTrash className="w-5 h-5 text-red-500 cursor-pointer" onClick={() => handleDelete(user.id)} /> */}
                                            <RiDeleteBinLine className="w-5 h-5 text-[#E7000B] hover:opacity-70" onClick={() => handleDelete(user.id)} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex flex-row space-x-4 mt-4 mx-auto">
                        <button
                            onClick={handlePrev}
                            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                            disabled={page === 1}
                        >
                            Previous
                        </button>

                        <span>Page {page} / {lastPage}</span>

                        <button
                            onClick={handleNext}
                            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                            disabled={page === lastPage}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}
