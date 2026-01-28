"use client";

import Image from "next/image";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { useEffect, useState } from "react";
import { DailyActivity, deleteDailyActivity, getAllDailyActivities } from "@/lib/daily-activities";

export default function DailyActivityReportPage() {
    const [dailyActivity, setDailyActivity] = useState<DailyActivity[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const res = await getAllDailyActivities(page, search);

        if (res.success) {
            setDailyActivity(res.data);
            setLastPage(res.meta.last_page);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchData();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this daily activity ?")) return;

        const res = await deleteDailyActivity(id);

        if (!res.success) {
            alert("Failed to delete: " + res.message);
            return;
        }

        alert(`Daily activity (${id}) deleted successfully!`);
        fetchData();
    };

    // Helper untuk format tanggal
    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };


    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <h1 className="text-3xl font-normal">Daily Activity</h1>
            </div>

            {/* list quotations */}
            <div className="bg-white mt-12">
                <div className="py-3 px-4 flex justify-between border rounded-t-sm">
                    {/* create quotations button */}
                    <Link href={"/admin/daily-activity-report/create"} className="bg-[#17A2B8] text-white px-2 h-10 flex justify-center items-center rounded-sm">Add Data <FiPlus className="w-5 h-5 ml-1" /> </Link>
                    {/* search bar */}
                    <form onSubmit={handleSearch} className="flex flex-row">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            id="search-input"
                            type="text"
                            className="w-[200px] rounded-l-sm h-8 border my-auto px-2 placeholder:text-sm"
                            placeholder="Search Daily Activity.." />
                        <button className="border-r border-t border-b h-8 w-8 my-auto flex rounded-r-sm" type="submit"><IoIosSearch className="w-5 m-auto" /></button>
                    </form>
                </div>
                <div className="py-5 px-4 flex justify-between border-b border-x rounded-b-sm">
                    <Table className="bg-[#f2f2f2]">
                        <TableHeader>
                            <TableRow className="bg-[#dadada] hover:bg-[#dadada]">
                                <TableHead className="text-[#212529] font-bold"><input type="checkbox" /></TableHead>
                                <TableHead className="text-[#212529] font-bold">Ref. AWP W.O. No.</TableHead>
                                <TableHead className="text-[#212529] font-bold">Service Contract No./ PO No.</TableHead>
                                <TableHead className="text-[#212529] font-bold">Customer</TableHead>
                                <TableHead className="text-[#212529] font-bold">Work Location</TableHead>
                                <TableHead className="text-[#212529] font-bold">Date</TableHead>
                                <TableHead className="text-[#212529] font-bold">Prepared By</TableHead>
                                <TableHead className="text-[#212529] font-bold text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : dailyActivity.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10">
                                        No data found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                dailyActivity.map((da) => (
                                    <TableRow key={da.id}>
                                        <TableCell className="font-medium"><input type="checkbox" /></TableCell>
                                        <TableCell className="py-4"><p className="text-sm">{da.ref_no}/PO/AWP-INS/{da.po_year}</p></TableCell>
                                        <TableCell className="font-medium">{da.po_no}</TableCell>
                                        <TableCell>{da.customer}</TableCell>
                                        <TableCell>{da.location}</TableCell>
                                        <TableCell className="">{formatDate(da.date)}</TableCell>
                                        <TableCell className="">
                                            {da.prepared_name}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="bg-white w-fit flex space-x-3 items-center mx-auto">
                                                <Link href={`/admin/daily-activity-report/edit/${da.id}`}><MdEdit className="w-7 h-7" /></Link>
                                                <div><FaTrash className="w-5 h-5 text-red-500" onClick={() => handleDelete(da.id)} /></div>
                                                <Link href={`/admin//daily-activity-report/print/${da.id}`}><IoMdEye className="w-7 h-7 text-[#31C6D4]" /></Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                {/* Pagination */}
                <div className="flex justify-center items-center py-4 space-x-4">
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                        Prev
                    </button>

                    <span>Page {page} of {lastPage}</span>

                    <button
                        disabled={page >= lastPage}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div >
    )
}