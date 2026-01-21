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

import * as XLSX from "xlsx";


// import { MdEdit } from "react-icons/md";
// import { FaTrash } from "react-icons/fa";
// import { IoMdEye } from "react-icons/io";
import { useEffect, useState } from "react";
import { deleteQuotations, getAll999Quotations, GetAllQuotation, getAllQuotations } from "@/lib/quotations";
import { toast } from "sonner";
import { LuEye } from "react-icons/lu";
import { LiaEdit } from "react-icons/lia";
import { RiDeleteBinLine } from "react-icons/ri";



export default function QuotationsPage() {
    const [quotations, setQuotations] = useState<GetAllQuotation[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const res = await getAllQuotations(page, search);

        if (res.success) {
            setQuotations(res.data);
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
        if (!confirm("Are you sure you want to delete this Quotation?")) return;

        const res = await deleteQuotations(id);

        if (!res.success) {
            // alert("Failed to delete: " + res.message);
            toast.error("Failed to delete: " + res.message);
            return;
        }

        // alert("Quotations deleted successfully!");
        toast.success("Quotation deleted successfully!");
        fetchData();
    };

    // 
    // 
    // 
    const [isExporting, setIsExporting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [exportCount, setExportCount] = useState(0);

    const getExportData = async () => {
        setIsExporting(true);

        // contoh: page 1, search, tapi limit besar
        const res = await getAll999Quotations(page, search); // sesuaikan API-mu

        if (!res.success || !res.data) {
            toast.error("Gagal mengambil data untuk export");
            setIsExporting(false);
            return null;
        }

        const formatted = res.data.map((q: any) => ({
            "Ref No": `${q.ref_no}/AWP-INS/${q.ref_year}`,
            "Date": new Date(q.date).toLocaleDateString(),
            "Customer": q.customer,
            "PIC": q.pic_name,
            "Subject": q.subject,
        }));

        setExportCount(formatted.length);
        return formatted;
    };


    const handleCopy = async () => {
        const data = await getExportData();
        if (!data) return;

        const headers = Object.keys(data[0]);
        const rows = data.map((obj: any) =>
            headers.map((h) => obj[h]).join("\t")
        );

        const content = [headers.join("\t"), ...rows].join("\n");
        await navigator.clipboard.writeText(content);

        toast.success(`Copied ${data.length} rows`);
        setIsExporting(false);
    };

    const handleCSV = async () => {
        const data = await getExportData();
        if (!data) return;

        const headers = Object.keys(data[0]);
        const rows = data.map((obj: any) =>
            headers.map((h) => `"${obj[h]}"`).join(",")
        );

        const content = [headers.join(","), ...rows].join("\n");
        const blob = new Blob(["\uFEFF" + content], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `quotations_${Date.now()}.csv`;
        link.click();

        setIsExporting(false);
    };

    const handleExcel = async () => {
        const data = await getExportData();
        if (!data) return;

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Quotations");

        XLSX.writeFile(workbook, `quotations_${Date.now()}.xlsx`);
        setIsExporting(false);
    };




    return (

        <div className="w-full h-full px-8 py-4 bg-[#f4f6f9]">
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs">
                    <div className="bg-white rounded-md shadow-2xl p-6 w-80 transform transition-all scale-110 animate-in fade-in zoom-in duration-100">
                        <div className="flex flex-col items-center text-center">
                            {/* Icon Centang */}
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900">Successfully copied!</h3>
                            <p className="text-sm text-gray-600 mt-2">
                                Copied to clipboard
                            </p>

                            <button
                                onClick={() => setShowModal(false)}
                                className="mt-6 w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* title container */}
            <div className="flex flex-row justify-between items-center space-x-2 mt-14">

                <div className="flex flex-row items-center space-x-2 mt-2">
                    <Image src={"/icons/icon-quotations-black.svg"} className="text-black" alt="icon quotations" width={40} height={40} />
                    <h1 className="text-3xl font-normal">Quotations  </h1>
                </div>
                {/* create quotations button */}
                <Link href={"/admin/quotations/create"} className="bg-[#31C6D4] text-white px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75 transition-all shadow-sm"><FiPlus className="w-5 h-5 mr-1" /> Add Quotation Data </Link>
            </div>
            {/* Search & Export Container */}
            <div className="bg-white rounded-[10px] shadow-sm w-full h-32 mt-6 flex flex-row justify-between items-center p-6 border border-[#E5E7EB]">
                <form className="flex flex-row relative" onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-[400px] rounded-sm h-10 border border-[#D1D5DC] my-auto pl-12 placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-[#31C6D4]"
                        placeholder="Search Quotations..."
                    />
                    <IoIosSearch className="w-6 h-6 m-auto absolute top-2 left-3 text-[#99A1AF]" />
                </form>

                <div className="grid grid-cols-3 gap-x-2 h-10">
                    <button
                        onClick={handleCopy}
                        disabled={isExporting}
                        className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Copy
                    </button>
                    <button
                        onClick={handleCSV}
                        disabled={isExporting}
                        className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        CSV
                    </button>
                    <button
                        onClick={handleExcel}
                        disabled={isExporting}
                        className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Excel
                    </button>
                    {/* <button className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors">
                        PDF
                    </button>
                    <button className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors">
                        Print
                    </button> */}
                </div>
            </div>

            {/* list quotations */}
            <div className="bg-white mt-10 rounded-[10px] overflow-hidden shadow-sm border border-[#E5E7EB]">
                {/* <div className="py-3 px-4 flex justify-between border rounded-t-sm"> */}
                {/* search bar */}
                {/* <form onSubmit={handleSearch} className="flex flex-row">
                        <input value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            id="search-input"
                            type="text"
                            className="w-[200px] rounded-l-sm h-8 border my-auto px-2 placeholder:text-sm"
                            placeholder="Search Quotations..." />
                        <button className="border-r border-t border-b h-8 w-8 my-auto flex rounded-r-sm cursor-pointer" type="submit"><IoIosSearch className="w-5 m-auto" /></button>
                    </form> */}
                {/* </div> */}
                {/* <div className="py-5 px-4 flex justify-between border-b border-x rounded-b-sm"> */}
                <Table className="">
                    <TableHeader>
                        <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB] border-[#E5E7EB]">
                            <TableHead className="text-[#212529] font-bold py-8 pl-8"><input type="checkbox" /></TableHead>
                            <TableHead className="text-[#212529] font-bold">Ref</TableHead>
                            <TableHead className="text-[#212529] font-bold">Date</TableHead>
                            <TableHead className="text-[#212529] font-bold">Customer</TableHead>
                            <TableHead className="text-[#212529] font-bold">PIC</TableHead>
                            <TableHead className="text-[#212529] font-bold">Subject</TableHead>
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
                        ) : quotations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">
                                    No data found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            quotations.map((q) => (
                                <TableRow key={q.id} className="hover:bg-gray-50 border-[#E5E7EB]">
                                    <TableCell className="pl-8"><input type="checkbox" /></TableCell>
                                    <TableCell className="py-6">{q.ref_no}/AWP-INS/{q.ref_year}</TableCell>
                                    <TableCell>{new Date(q.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{q.customer}</TableCell>
                                    <TableCell>{q.pic_name}</TableCell>
                                    <TableCell>{q.subject}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="bg-white w-fit flex space-x-3 items-center justify-center mx-auto">
                                            <Link href={`/admin/quotations/edit/${q.id}`}>
                                                {/* <MdEdit className="w-7 h-7 cursor-pointer" /> */}
                                                <LiaEdit className="w-6 h-6 text-[#00A63E] hover:opacity-70" />
                                            </Link>
                                            <button>
                                                {/* <FaTrash className="w-5 h-5 text-red-500 cursor-pointer" onClick={() => handleDelete(q.id)} /> */}
                                                <RiDeleteBinLine className="w-5 h-5 text-[#E7000B] hover:opacity-70" onClick={() => handleDelete(q.id)} />
                                            </button>
                                            <Link href={`/admin/quotations/print/${q.id}`}>
                                                {/* <IoMdEye className="w-7 h-7 text-[#31C6D4] cursor-pointer" /> */}
                                                <LuEye className="w-5 h-5 text-[#155DFC] hover:opacity-70" />
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
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

            {/* </div> */}
        </div >
    )
}