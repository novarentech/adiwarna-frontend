"use client";

import Link from "next/link";
import { useState } from "react";
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

export default function SuratJalanPage() {

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        // setPage(1);       // reset ke page 1 saat search
        // fetchData(search, 1);
    };

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15); // Default 15 (diubah dari 10 di JSX)
    const [meta, setMeta] = useState({
        current_page: 1,
        last_page: 1,
        // from: 0,
        // to: 0,
        total: 0,
        per_page: 15,
    });
    const [loading, setLoading] = useState(true);

    return (
        <div className="w-full h-full px-8 py-4 bg-[#f4f6f9]">
            {/* // <div className="w-full h-full px-8 py-4 bg-gray-600"> */}

            <div className="flex flex-row justify-between items-center space-x-2 mt-14">
                {/* title  */}
                <h1 className="text-3xl font-normal">Daftar Purchase Requisition</h1>
                {/* create surat jalan */}
                <Link href={"/admin/purchase-requisition/create"} className="bg-[#31C6D4] text-white px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75">
                    <FiPlus className="w-5 h-5 mr-1" /> Add New PR
                </Link>
            </div>

            {/* start of search and export container */}
            <div className="bg-white rounded-[10px] shadow w-full h-32 mt-6 flex flex-row justify-between items-center p-6">
                {/* search bar */}
                <form className="flex flex-row relative" onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-[400px] rounded-sm h-10 border my-auto pl-[10%] placeholder:text-sm"
                        placeholder="Search by P.R. No., Supplier, or Location..."
                    />
                    <IoIosSearch className="w-8 h-8 m-auto absolute top-[10%] left-1 text-[#99A1AF]" />
                    {/* <button
                        className="border-r border-t border-b h-10 w-8 my-auto flex rounded-r-sm"
                        type="submit"
                    >
                    </button> */}
                </form>

                {/* Five Buttons for export */}
                <div className="grid grid-cols-5 gap-x-2 h-10 text-black">
                    <button className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px]">
                        Copy
                    </button>
                    <button className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px]">
                        CSV
                    </button>
                    <button className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px]">
                        Excel
                    </button>
                    <button className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px]">
                        PDF
                    </button>
                    <button className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px]">
                        Print
                    </button>
                </div>
            </div>
            {/* end of search and export container */}


            {/* list surat jalan container */}
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
                            <TableHead className="w-1/5 text-[#212529] font-bold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="py-8">037/PU/AWP/01/2024</TableCell>
                            <TableCell>01/02.01.2024</TableCell>
                            <TableCell>25/12/2024</TableCell>
                            <TableCell>PT. Mitra Sejati</TableCell>
                            <TableCell>AWP HO</TableCell>
                            <TableCell>Rp 15.500.000</TableCell>
                            {/* ini kalau approved */}
                            <TableCell><p className="bg-[#DCFCE7] text-[#016630] w-fit px-4 py-2 rounded-full">Approved</p></TableCell>
                            <TableCell>
                                <div className="flex flex-row items-center gap-x-7">
                                    <button className="cursor-pointer hover:contrast-75"><LuEye className="w-6 h-6 text-[#155DFC]" /></button>
                                    <button className="cursor-pointer hover:contrast-75"><LiaEdit className="w-7 h-7 text-[#00A63E]" /></button>
                                    <button className="cursor-pointer hover:contrast-75"><LuPrinter className="w-6 h-6 text-[#4A5565]" /></button>
                                    <button className="cursor-pointer hover:contrast-75"><RiDeleteBinLine className="w-6 h-6 text-[#E7000B]" /></button>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="py-8">037/PU/AWP/01/2024</TableCell>
                            <TableCell>01/02.01.2024</TableCell>
                            <TableCell>25/12/2024</TableCell>
                            <TableCell>PT. Mitra Sejati</TableCell>
                            <TableCell>AWP HO</TableCell>
                            <TableCell>Rp 15.500.000</TableCell>
                            {/* ini kalau pending */}
                            <TableCell><p className="bg-[#FEF9C2] text-[#894B00] w-fit px-4 py-2 rounded-full">Pending</p></TableCell>
                            <TableCell>
                                <div className="flex flex-row items-center gap-x-7">
                                    <button className="cursor-pointer hover:contrast-75"><LuEye className="w-6 h-6 text-[#155DFC]" /></button>
                                    <button className="cursor-pointer hover:contrast-75"><LiaEdit className="w-7 h-7 text-[#00A63E]" /></button>
                                    <button className="cursor-pointer hover:contrast-75"><LuPrinter className="w-6 h-6 text-[#4A5565]" /></button>
                                    <button className="cursor-pointer hover:contrast-75"><RiDeleteBinLine className="w-6 h-6 text-[#E7000B]" /></button>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <div className="flex justify-between border-b border-x rounded-b-sm py-3 px-4 border-t border-[#E5E7EB]">
                    {/* Display total entries */}
                    <div className="font-light">
                        Showing {meta.total > 0 ? `${(meta.current_page - 1) * perPage + 1} to ${Math.min(meta.current_page * perPage, meta.total)}` : "0"} of {meta.total} entries
                    </div>

                    {/* Pagination Controls */}
                    <div className="border flex flex-row h-9 items-center rounded-sm overflow-hidden text-white font-semibold text-sm">

                        {/* Previous Button */}
                        <button
                            className={`h-full flex justify-center items-center px-3 transition-colors ${meta.current_page === 1 ? 'border text-[#0A0A0A] font-normal cursor-not-allowed' : 'bg-[#31C6D4] hover:bg-blue-600'}`}
                            // onClick={() => handlePageChange(meta.current_page - 1)}
                            disabled={meta.current_page === 1}
                        >
                            Previous
                        </button>

                        {/* Page Number Buttons */}
                        {Array.from({ length: meta.last_page }, (_, index) => index + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                className={`w-10 flex justify-center items-center h-full ${meta.current_page === pageNum ? 'bg-[#31C6D4] text-white' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
                            // onClick={() => handlePageChange(pageNum)}
                            >
                                {pageNum}
                            </button>
                        ))}

                        {/* Next Button */}
                        <button
                            className={`h-full flex justify-center items-center px-3 transition-colors ${meta.current_page === meta.last_page || meta.total === 0 ? 'border text-[#0A0A0A] font-normal cursor-not-allowed' : 'bg-[#31C6D4] hover:bg-blue-600'}`}
                            // onClick={() => handlePageChange(meta.current_page + 1)}
                            disabled={meta.current_page === meta.last_page || meta.total === 0}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}