"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { FiPlus } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { LuEye, LuPrinter } from "react-icons/lu";
import { LiaEdit } from "react-icons/lia";
import { RiDeleteBinLine } from "react-icons/ri";

// Import API & Interfaces
import { GetAllDeliveryNote, GetAllDeliveryNoteResponse, GetAllDeliveryNoteData, deleteDeliveryNote } from "@/lib/delivery-notes";

export default function SuratJalanPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [perPage] = useState(15);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<GetAllDeliveryNoteData[]>([]);
    const [meta, setMeta] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 15,
    });

    // Fetch Data
    const fetchData = useCallback(async (searchQuery: string, currentPage: number) => {
        setLoading(true);
        const response: GetAllDeliveryNoteResponse = await GetAllDeliveryNote(
            currentPage,
            perPage,
            searchQuery
        );

        if (response.success) {
            setData(response.data);
            setMeta(response.meta);
        } else {
            setData([]);
        }
        setLoading(false);
    }, [perPage]);

    useEffect(() => {
        fetchData(search, page);
    }, [page, fetchData]);

    // Handlers
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchData(search, 1);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= meta.last_page) {
            setPage(newPage);
        }
    };

    // Helper Status Style
    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Delivered":
                return "bg-[#DCFCE7] text-[#016630]";
            case "Pending":
                return "bg-[#FEF9C2] text-[#894B00]";
            case "Cancelled":
                return "bg-[#FEE2E2] text-[#991B1B]";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this Delivery Note?")) return;

        const res = await deleteDeliveryNote(id);

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
                <h1 className="text-3xl font-normal text-[#212529]">Daftar Surat Jalan</h1>
                <Link href={"/admin/surat-jalan/create"} className="bg-[#31C6D4] text-white px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75 transition-all shadow-sm">
                    <FiPlus className="w-5 h-5 mr-1" /> Add New Surat Jalan
                </Link>
            </div>

            {/* Search & Export Container */}
            <div className="bg-white rounded-[10px] shadow-sm w-full h-32 mt-6 flex flex-row justify-between items-center p-6 border border-[#E5E7EB]">
                <form className="flex flex-row relative" onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-[400px] rounded-sm h-10 border border-[#D1D5DC] my-auto pl-12 placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-[#31C6D4]"
                        placeholder="Search by No. Surat, Customer, or WO..."
                    />
                    <IoIosSearch className="w-6 h-6 m-auto absolute top-2 left-3 text-[#99A1AF]" />
                </form>

                <div className="grid grid-cols-5 gap-x-2 h-10">
                    {["Copy", "CSV", "Excel", "PDF", "Print"].map((btn) => (
                        <button key={btn} className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors">
                            {btn}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white mt-10 rounded-[10px] overflow-hidden shadow-sm border border-[#E5E7EB]">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB] border-[#E5E7EB]">
                            <TableHead className="text-[#212529] font-bold py-8">No Surat</TableHead>
                            <TableHead className="text-[#212529] font-bold">Tanggal</TableHead>
                            <TableHead className="text-[#212529] font-bold">Kepada</TableHead>
                            <TableHead className="text-[#212529] font-bold">No. WO</TableHead>
                            <TableHead className="text-[#212529] font-bold">Plat Kendaraan</TableHead>
                            <TableHead className="text-[#212529] font-bold">Total Items</TableHead>
                            <TableHead className="text-[#212529] font-bold">Status</TableHead>
                            <TableHead className="text-[#212529] font-bold text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-20 text-gray-500">Loading delivery notes...</TableCell>
                            </TableRow>
                        ) : data.length > 0 ? (
                            data.map((sj) => (
                                <TableRow key={sj.id} className="hover:bg-gray-50 border-[#E5E7EB]">
                                    <TableCell className="py-6 font-medium">{sj.delivery_note_no}</TableCell>
                                    <TableCell>{sj.date}</TableCell>
                                    <TableCell>{sj.customer}</TableCell>
                                    <TableCell>{sj.wo_no}</TableCell>
                                    <TableCell>{sj.vehicle_plate}</TableCell>
                                    <TableCell className="text-center">{sj.total_items}</TableCell>
                                    <TableCell>
                                        <p className={`${getStatusStyle(sj.status)} w-fit px-4 py-1.5 rounded-full text-xs font-bold`}>
                                            {sj.status}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-row items-center justify-center gap-x-6">
                                            <Link href={`/admin/surat-jalan/detail/${sj.id}`}>
                                                <LuEye className="w-5 h-5 text-[#155DFC] hover:opacity-70" />
                                            </Link>
                                            <Link href={`/admin/surat-jalan/edit/${sj.id}`}>
                                                <LiaEdit className="w-6 h-6 text-[#00A63E] hover:opacity-70" />
                                            </Link>
                                            <button>
                                                <LuPrinter className="w-5 h-5 text-[#4A5565] hover:opacity-70" />
                                            </button>
                                            <button onClick={() => handleDelete(sj.id)}>
                                                <RiDeleteBinLine className="w-5 h-5 text-[#E7000B] hover:opacity-70" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-20 text-gray-500">No data found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination Controls */}
                <div className="flex justify-between border-t border-[#E5E7EB] py-4 px-6 items-center">
                    <div className="text-sm font-light text-gray-600">
                        Showing {meta.total > 0 ? `${(meta.current_page - 1) * perPage + 1} to ${Math.min(meta.current_page * perPage, meta.total)}` : "0"} of {meta.total} entries
                    </div>

                    <div className="flex flex-row h-9 items-center rounded-sm overflow-hidden border border-[#D1D5DC]">
                        <button
                            className={`px-4 h-full text-sm font-semibold transition-colors ${meta.current_page === 1 ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-[#31C6D4] text-white hover:bg-[#28aab6]'}`}
                            onClick={() => handlePageChange(meta.current_page - 1)}
                            disabled={meta.current_page === 1}
                        >
                            Previous
                        </button>

                        {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                className={`w-10 h-full text-sm border-l border-[#D1D5DC] flex items-center justify-center transition-colors ${meta.current_page === pageNum ? 'bg-[#31C6D4] text-white font-bold' : 'bg-white text-[#31C6D4] hover:bg-gray-50'}`}
                                onClick={() => handlePageChange(pageNum)}
                            >
                                {pageNum}
                            </button>
                        ))}

                        <button
                            className={`px-4 h-full text-sm font-semibold border-l border-[#D1D5DC] transition-colors ${meta.current_page === meta.last_page || meta.total === 0 ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-[#31C6D4] text-white hover:bg-[#28aab6]'}`}
                            onClick={() => handlePageChange(meta.current_page + 1)}
                            disabled={meta.current_page === meta.last_page || meta.total === 0}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}