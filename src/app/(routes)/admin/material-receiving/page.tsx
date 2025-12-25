"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react"; // Tambah useEffect & useCallback
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
import { LuEye, LuPrinter } from "react-icons/lu";
import { LiaEdit } from "react-icons/lia";
import { RiDeleteBinLine } from "react-icons/ri";
import { deleteMaterialReceiving, GetAllMaterialReceiving, GetAllMaterialReceivingReportResponse } from "@/lib/material-receiving";

// Import service API dan Interface


export default function MaterialReceivingPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [perPage] = useState(15);
    const [data, setData] = useState<any[]>([]); // State untuk menampung list data
    const [meta, setMeta] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 15,
    });
    const [loading, setLoading] = useState(true);

    // 1. Fungsi untuk mengambil data dari API
    const fetchData = useCallback(async (searchQuery: string, currentPage: number) => {
        setLoading(true);
        const response: GetAllMaterialReceivingReportResponse = await GetAllMaterialReceiving(
            currentPage,
            perPage,
            searchQuery
        );

        if (response.success) {
            setData(response.data);
            setMeta(response.meta);
        } else {
            console.error("Fetch error:", response);
            setData([]); // Reset data jika gagal
        }
        setLoading(false);
    }, [perPage]);

    // 2. Efek untuk fetch data otomatis saat page berubah atau pertama kali load
    useEffect(() => {
        fetchData(search, page);
    }, [page, fetchData]);

    // 3. Handle Search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1); // Reset ke halaman pertama saat mencari
        fetchData(search, 1);
    };

    // 4. Handle Pagination
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= meta.last_page) {
            setPage(newPage);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this material receiving reports?")) return;

        const res = await deleteMaterialReceiving(id);

        if (!res.success) {
            alert("Failed to delete: " + res.message);
            return;
        }

        alert("Equipment deleted successfully!");
        fetchData(search, page);
    };

    return (
        <div className="w-full h-full px-8 py-4 bg-[#f4f6f9]">
            <div className="flex flex-row justify-between items-center space-x-2 mt-14">
                <h1 className="text-3xl font-normal">Daftar Material Receiving</h1>
                <Link href={"/admin/material-receiving/create"} className="bg-[#31C6D4] text-white px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75">
                    <FiPlus className="w-5 h-5 mr-1" /> Add New Record
                </Link>
            </div>

            <div className="bg-white rounded-[10px] shadow w-full h-32 mt-6 flex flex-row justify-between items-center p-6">
                <form className="flex flex-row relative" onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-[400px] rounded-sm h-10 border my-auto pl-[10%] placeholder:text-sm"
                        placeholder="Search by P.O. No., Supplier, or Received By..."
                    />
                    <IoIosSearch className="w-8 h-8 m-auto absolute top-[10%] left-1 text-[#99A1AF]" />
                    <button type="submit" className="hidden">Search</button>
                </form>

                {/* Tombol Export (Statis) */}
                <div className="grid grid-cols-5 gap-x-2 h-10 text-black">
                    {["Copy", "CSV", "Excel", "PDF", "Print"].map((btn) => (
                        <button key={btn} className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px] hover:bg-gray-50">
                            {btn}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white mt-10 rounded-[10px] overflow-hidden shadow">
                <Table className="bg-[#FFFFFF] rounded-t-[10px]">
                    <TableHeader>
                        <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB] border-[#E5E7EB]">
                            <TableHead className="text-[#212529] font-bold py-8">P.O./INV./PR No.</TableHead>
                            <TableHead className="text-[#212529] font-bold">Supplier</TableHead>
                            <TableHead className="text-[#212529] font-bold">Receiving Date</TableHead>
                            <TableHead className="text-[#212529] font-bold">Order By</TableHead>
                            <TableHead className="text-[#212529] font-bold">Total Items</TableHead>
                            <TableHead className="text-[#212529] font-bold">Received By</TableHead>
                            <TableHead className="text-[#212529] font-bold">Status</TableHead>
                            <TableHead className="w-1/5 text-[#212529] font-bold text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10">Loading data...</TableCell>
                            </TableRow>
                        ) : data.length > 0 ? (
                            data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="py-6">{item.po_inv_pr_no}</TableCell>
                                    <TableCell>{item.supplier}</TableCell>
                                    <TableCell>{item.receiving_date}</TableCell>
                                    <TableCell>
                                        <p className={`${item.order_by?.toLowerCase() === 'online' ? 'bg-[#DBEAFE] text-[#193CB8]' : 'bg-[#F3E8FF] text-[#6E11B0]'} w-fit px-4 py-1 rounded-md text-sm font-medium`}>
                                            {item.order_by}
                                        </p>
                                    </TableCell>
                                    <TableCell>{item.total_items}</TableCell>
                                    <TableCell>{item.received_by}</TableCell>
                                    <TableCell>
                                        <p className={`${item.status?.toLowerCase() === 'complete' ? 'bg-[#DCFCE7] text-[#016630]' : 'bg-[#FEF9C2] text-[#894B00]'} w-fit px-4 py-1 rounded-full text-sm font-medium`}>
                                            {item.status}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-row items-center justify-center gap-x-5">
                                            <Link href={`/admin/material-receiving/detail/${item.id}`} className="cursor-pointer hover:opacity-70"><LuEye className="w-5 h-5 text-[#155DFC]" /></Link>
                                            <Link href={`/admin/material-receiving/edit/${item.id}`} className="cursor-pointer hover:opacity-70"><LiaEdit className="w-6 h-6 text-[#00A63E]" /></Link>
                                            <Link href={`/admin/material-receiving/print/${item.id}`} className="cursor-pointer hover:opacity-70"><LuPrinter className="w-5 h-5 text-[#4A5565]" /></Link>
                                            <button onClick={() => handleDelete(item.id)} className="cursor-pointer hover:opacity-70 text-[#E7000B]"><RiDeleteBinLine className="w-5 h-5" /></button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10">No data found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination UI */}
                <div className="flex justify-between border-b border-x rounded-b-sm py-3 px-4 border-t border-[#E5E7EB]">
                    <div className="font-light text-sm">
                        Showing {meta.total > 0 ? `${(meta.current_page - 1) * perPage + 1} to ${Math.min(meta.current_page * perPage, meta.total)}` : "0"} of {meta.total} entries
                    </div>

                    <div className="flex flex-row h-9 items-center rounded-sm overflow-hidden text-sm">
                        <button
                            className={`px-3 h-full border ${meta.current_page === 1 ? 'text-gray-400 cursor-not-allowed' : 'bg-[#31C6D4] text-white hover:bg-[#28aab6]'}`}
                            onClick={() => handlePageChange(meta.current_page - 1)}
                            disabled={meta.current_page === 1 || loading}
                        >
                            Previous
                        </button>

                        {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                className={`w-10 h-full border-y border-r flex items-center justify-center ${meta.current_page === pageNum ? 'bg-[#31C6D4] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                onClick={() => handlePageChange(pageNum)}
                            >
                                {pageNum}
                            </button>
                        ))}

                        <button
                            className={`px-3 h-full border-y border-r rounded-r-sm ${meta.current_page === meta.last_page || meta.total === 0 ? 'text-gray-400 cursor-not-allowed' : 'bg-[#31C6D4] text-white hover:bg-[#28aab6]'}`}
                            onClick={() => handlePageChange(meta.current_page + 1)}
                            disabled={meta.current_page === meta.last_page || meta.total === 0 || loading}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}