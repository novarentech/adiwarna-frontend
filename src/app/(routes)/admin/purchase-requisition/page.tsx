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
} from "@/components/ui/table"
import { LuEye, LuPrinter } from "react-icons/lu";
import { LiaEdit } from "react-icons/lia";
import { RiDeleteBinLine } from "react-icons/ri";

// Import API and Interfaces
import { GetAllPurchaseRequisition, GetAllPurchaseRequisitionResponse, GetAllPurchaseRequisitionData, deletePurchaseRequisition } from "@/lib/purchase-requisitions";

export default function PurchaseRequisitionPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [perPage] = useState(15);
    const [data, setData] = useState<GetAllPurchaseRequisitionData[]>([]);
    const [meta, setMeta] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 15,
    });
    const [loading, setLoading] = useState(true);

    // Fetch data function
    const fetchData = useCallback(async (searchQuery: string, currentPage: number) => {
        setLoading(true);
        const response: GetAllPurchaseRequisitionResponse = await GetAllPurchaseRequisition(
            currentPage,
            perPage,
            searchQuery
        );

        if (response.success) {
            setData(response.data);
            setMeta(response.meta);
        } else {
            console.error("Fetch error:", response);
            setData([]);
        }
        setLoading(false);
    }, [perPage]);

    // Initial load and page change
    useEffect(() => {
        fetchData(search, page);
    }, [page, fetchData]);

    // Search handler
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

    // Status Styling Helper
    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Approved":
                return "bg-[#DCFCE7] text-[#016630]";
            case "Pending":
                return "bg-[#FEF9C2] text-[#894B00]";
            case "Draft":
                return "bg-gray-100 text-gray-600";
            default:
                return "bg-blue-100 text-blue-700";
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this Purchase Requisition?")) return;

        const res = await deletePurchaseRequisition(id);

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
                <h1 className="text-3xl font-normal">Daftar Purchase Requisition</h1>
                <Link href={"/admin/purchase-requisition/create"} className="bg-[#31C6D4] text-white px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75">
                    <FiPlus className="w-5 h-5 mr-1" /> Add New PR
                </Link>
            </div>

            {/* Search and Export */}
            <div className="bg-white rounded-[10px] shadow w-full h-32 mt-6 flex flex-row justify-between items-center p-6">
                <form className="flex flex-row relative" onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-[400px] rounded-sm h-10 border my-auto pl-[10%] placeholder:text-sm"
                        placeholder="Search by P.R. No., Supplier, or Location..."
                    />
                    <IoIosSearch className="w-8 h-8 m-auto absolute top-[10%] left-1 text-[#99A1AF]" />
                    <button type="submit" className="hidden">Search</button>
                </form>

                <div className="grid grid-cols-5 gap-x-2 h-10 text-black font-medium text-sm">
                    {["Copy", "CSV", "Excel", "PDF", "Print"].map((item) => (
                        <button key={item} className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px] hover:bg-gray-50">
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white mt-10 rounded-[10px] overflow-hidden shadow">
                <Table className="bg-[#FFFFFF] rounded-t-[10px]">
                    <TableHeader>
                        <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB] border-[#E5E7EB]">
                            <TableHead className="text-[#212529] font-bold py-8">P.R. No.</TableHead>
                            <TableHead className="text-[#212529] font-bold">Rev. No.</TableHead>
                            <TableHead className="text-[#212529] font-bold">Required Delivery</TableHead>
                            <TableHead className="text-[#212529] font-bold">Supplier</TableHead>
                            <TableHead className="text-[#212529] font-bold">Place of Delivery</TableHead>
                            <TableHead className="text-[#212529] font-bold">Total Amount</TableHead>
                            <TableHead className="text-[#212529] font-bold">Status</TableHead>
                            <TableHead className="text-[#212529] font-bold text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-20">Loading data...</TableCell>
                            </TableRow>
                        ) : data.length > 0 ? (
                            data.map((pr) => (
                                <TableRow key={pr.id}>
                                    <TableCell className="py-6 font-medium">{pr.pr_no}</TableCell>
                                    <TableCell>{pr.rev_no || "-"}</TableCell>
                                    <TableCell>{pr.required_delivery}</TableCell>
                                    <TableCell>{pr.supplier}</TableCell>
                                    <TableCell>{pr.place_of_delivery}</TableCell>
                                    <TableCell className="font-semibold">{pr.total_amount}</TableCell>
                                    <TableCell>
                                        <p className={`${getStatusStyle(pr.status)} w-fit px-4 py-1 rounded-full text-sm font-medium`}>
                                            {pr.status}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-row items-center justify-center gap-x-5">
                                            <Link href={`/admin/purchase-requisition/detail/${pr.id}`} title="View">
                                                <LuEye className="w-5 h-5 text-[#155DFC] hover:opacity-70" />
                                            </Link>
                                            <Link href={`/admin/purchase-requisition/edit/${pr.id}`} title="Edit">
                                                <LiaEdit className="w-6 h-6 text-[#00A63E] hover:opacity-70" />
                                            </Link>
                                            <button title="Print">
                                                <LuPrinter className="w-5 h-5 text-[#4A5565] hover:opacity-70" />
                                            </button>
                                            <button title="Delete" onClick={() => handleDelete(pr.id)}>
                                                <RiDeleteBinLine className="w-5 h-5 text-[#E7000B] hover:opacity-70" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-20 text-gray-500">No records found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex justify-between border-t border-[#E5E7EB] py-4 px-6 items-center bg-white">
                    <div className="text-sm font-light text-gray-600">
                        Showing {meta.total > 0 ? `${(meta.current_page - 1) * perPage + 1} to ${Math.min(meta.current_page * perPage, meta.total)}` : "0"} of {meta.total} entries
                    </div>

                    <div className="flex flex-row h-9 items-center rounded-sm overflow-hidden border">
                        <button
                            className={`px-4 h-full text-sm font-medium transition-colors ${meta.current_page === 1 ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-[#31C6D4] text-white hover:bg-[#28aab6]'}`}
                            onClick={() => handlePageChange(meta.current_page - 1)}
                            disabled={meta.current_page === 1 || loading}
                        >
                            Previous
                        </button>

                        {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                className={`w-10 h-full text-sm border-l flex items-center justify-center transition-colors ${meta.current_page === pageNum ? 'bg-[#31C6D4] text-white font-bold' : 'bg-white text-[#31C6D4] hover:bg-gray-50'}`}
                                onClick={() => handlePageChange(pageNum)}
                            >
                                {pageNum}
                            </button>
                        ))}

                        <button
                            className={`px-4 h-full text-sm font-medium border-l transition-colors ${meta.current_page === meta.last_page || meta.total === 0 ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-[#31C6D4] text-white hover:bg-[#28aab6]'}`}
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