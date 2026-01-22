"use client";

// import Image from "next/image";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { MdAssignment } from "react-icons/md";


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

// import { MdEdit } from "react-icons/md";
// import { FaTrash } from "react-icons/fa";
// import { IoMdEye } from "react-icons/io";
import { useEffect, useState } from "react";
import { deleteWorkAssignment, getAll999WorkAssignment, getAllWorkAssignment, GetAllWorkAssignment } from "@/lib/work-assignment";
import { toast } from "sonner";
import { LuEye } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import { LiaEdit } from "react-icons/lia";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export default function WorkAssignmentPage() {
    const [workAssignment, setWorkAssignment] = useState<GetAllWorkAssignment[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);


    const fetchData = async () => {
        setLoading(true);
        const res = await getAllWorkAssignment(page, search);

        if (res.success) {
            setWorkAssignment(res.data);
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
        if (!confirm("Are you sure you want to delete this Work Assignment?")) return;

        const res = await deleteWorkAssignment(id);

        if (!res.success) {
            // alert("Failed to delete: " + res.message);
            toast.error("Failed to delete: " + res.message);
            return;
        }

        // alert("work assignment deleted successfully!");
        toast.success("work assignment deleted successfully!");
        fetchData();
    };


    const [isExporting, setIsExporting] = useState(false);
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    const [exportCount, setExportCount] = useState(0);

    const getExportData = async () => {
        setIsExporting(true);

        // ambil semua data (sesuaikan kalau backend kamu beda)
        const res = await getAll999WorkAssignment(1, search);

        if (!res.success || !res.data) {
            toast.error("Gagal mengambil data Work Assignment");
            setIsExporting(false);
            return null;
        }

        const formatted = res.data.map((wa: any) => ({
            "Assignment No": `${wa.assignment_no}/AWP-INS/${wa.assignment_year}`,
            "Ref WO No": `${wa.ref_no}/AWP-INS/JKT/${wa.ref_year}`,
            "Date": wa.date,
            "Customer": wa.customer,
            "Work Location": wa.work_location,
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
        link.download = `work_assignment_${Date.now()}.csv`;
        link.click();

        setIsExporting(false);
    };


    const handleExcel = async () => {
        const data = await getExportData();
        if (!data) return;

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Work Assignment");

        XLSX.writeFile(workbook, `work_assignment_${Date.now()}.xlsx`);
        setIsExporting(false);
    };

    const handleExportPdf = async () => {
        setIsExportingPdf(true);
        try {
            const data = await getExportData();
            if (!data) return;

            const doc = new jsPDF("l", "mm", "a4");

            doc.setFontSize(16);
            doc.text("Work Assignment", 14, 15);

            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleString("id-ID")}`, 14, 22);

            autoTable(doc, {
                startY: 30,
                head: [Object.keys(data[0])],
                body: data.map((d: any) => Object.values(d)),
                styles: { fontSize: 9 },
            });

            doc.save(`work_assignment_${Date.now()}.pdf`);
        } catch {
            toast.error("Export PDF gagal");
        } finally {
            setIsExportingPdf(false);
        }
    };


    const handlePrint = async () => {
        // 1. Ambil data lengkap (bukan hanya yang ada di halaman saat ini)
        const data = await getExportData();
        if (!data) return;

        // 2. Buat elemen temporary untuk menampung tabel cetak
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const tableHtml = `
                            <html>
                            <head>
                                <title>Print Work Assignment</title>
                                <style>
                                    body { font-family: sans-serif; padding: 20px; }
                                            h1 { text-align: center; margin-bottom: 20px; }
                                            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
                                            th { bg-color: #f2f2f2; font-bold: true; }
                                            @page { size: landscape; }
                                </style>
                            </head>
                            <body>
                                <h2>Work Assignment</h2>
                                <table>
                                    <thead>
                                        <tr>
                                            ${Object.keys(data[0]).map(h => `<th>${h}</th>`).join("")}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${data.map((r: GetAllWorkAssignment) => `
                                            <tr>
                                                ${Object.values(r).map(v => `<td>${v}</td>`).join("")}
                                            </tr>
                                        `).join("")}
                                    </tbody>
                                </table>
                            </body>
                            </html>
                        `;

        printWindow.document.write(tableHtml);
        printWindow.document.close();
        printWindow.focus();

        // Beri sedikit jeda agar browser sempat merender tabel sebelum dialog print muncul
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };



    return (
        <div className="w-full h-full px-8 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row justify-between items-center space-x-2 mt-14">

                <div className="flex flex-row items-center space-x-2 mt-2">
                    <MdAssignment className="text-black w-10 h-10" />
                    <h1 className="text-3xl font-normal">Work Assignment  </h1>
                </div>

                <Link href={"/admin/work-assignment/create"} className="bg-[#31C6D4] text-white px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75 transition-all shadow-sm"><FiPlus className="w-5 h-5 mr-1" /> Add Work Assignment Data </Link>
            </div>

            {/* Search & Export Container */}
            <div className="bg-white rounded-[10px] shadow-sm w-full h-32 mt-6 flex flex-row justify-between items-center p-6 border border-[#E5E7EB]">
                <form className="flex flex-row relative" onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-[400px] rounded-sm h-10 border border-[#D1D5DC] my-auto pl-12 placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-[#31C6D4]"
                        placeholder="Search Work Assigment..."
                    />
                    <IoIosSearch className="w-6 h-6 m-auto absolute top-2 left-3 text-[#99A1AF]" />
                </form>

                <div className="grid grid-cols-5 gap-x-2 h-10">
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
                    <button
                        onClick={handleExportPdf}
                        disabled={isExportingPdf}
                        className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors">
                        PDF
                    </button>
                    <button
                        onClick={handlePrint}
                        className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors">
                        Print
                    </button>
                </div>
            </div>

            {/* list quotations */}
            <div className="bg-white mt-10 rounded-[10px] overflow-hidden shadow-sm border border-[#E5E7EB]">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB] border-[#E5E7EB]">
                            <TableHead className="text-[#212529] font-bold py-8 pl-8"><input type="checkbox" /></TableHead>
                            <TableHead className="text-[#212529] font-bold">No.</TableHead>
                            <TableHead className="text-[#212529] font-bold">Ref. AWP WO No.</TableHead>
                            <TableHead className="text-[#212529] font-bold">Date</TableHead>
                            <TableHead className="text-[#212529] font-bold">Customer</TableHead>
                            <TableHead className="text-[#212529] font-bold">Work Location </TableHead>
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
                        ) : workAssignment.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">
                                    No data found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            workAssignment.map((wa) => (
                                <TableRow key={wa.id} className="hover:bg-gray-50 border-[#E5E7EB]">
                                    <TableCell className="font-medium pl-8"><input type="checkbox" /></TableCell>
                                    <TableCell className="py-4"><p className="text-sm">{wa.assignment_no}/AWP-INS/{wa.assignment_year}</p></TableCell>
                                    <TableCell className="font-medium">	{wa.ref_no}/AWP-INS/JKT/{wa.ref_year}</TableCell>
                                    <TableCell>	{wa.date}</TableCell>
                                    <TableCell>{wa.customer}</TableCell>
                                    <TableCell className="">{wa.work_location}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="bg-white w-fit flex space-x-3 items-center mx-auto">
                                            <Link href={`/admin/work-assignment/edit/${wa.id}`}>
                                                {/* <MdEdit className="w-7 h-7" /> */}
                                                <LiaEdit className="w-6 h-6 text-[#00A63E] hover:opacity-70" />
                                            </Link>
                                            <div>
                                                {/* <FaTrash className="w-5 h-5 text-red-500" onClick={() => handleDelete(wa.id)} /> */}
                                                <RiDeleteBinLine className="w-5 h-5 text-[#E7000B] hover:opacity-70" />
                                            </div>
                                            <Link href={`/admin/work-assignment/print/${wa.id}`}>
                                                {/* <IoMdEye className="w-7 h-7 text-[#31C6D4]" /> */}
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