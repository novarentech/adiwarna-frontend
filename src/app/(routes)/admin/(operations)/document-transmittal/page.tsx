"use client";
import { MdDocumentScanner } from "react-icons/md";

import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { IoIosSearch, IoMdCart } from "react-icons/io";
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
import { deleteDocTrans, getAll999DocTrans, getAllDocTrans, GetAllDocTransmittalData } from "@/lib/document-transmittals";
import { toast } from "sonner";
import { RiDeleteBinLine } from "react-icons/ri";
import { LuEye } from "react-icons/lu";
import { LiaEdit } from "react-icons/lia";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export default function DocumentTransmittalPage() {
    const [docTrans, setDocTrans] = useState<GetAllDocTransmittalData[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const res = await getAllDocTrans(page, search);

        if (res.success) {
            setDocTrans(res.data);
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

        const res = await deleteDocTrans(id);

        if (!res.success) {
            // alert("Failed to delete: " + res.message);
            toast.error("Failed to delete: " + res.message);
            return;
        }

        // alert("Quotations deleted successfully!");
        toast.success("Document Transmittal deleted successfully!");
        fetchData();
    };

    // 
    // 
    // 

    const [isCopying, setIsCopying] = useState(false);
    const [isExportingCsv, setIsExportingCsv] = useState(false);
    const [isExportingExcel, setIsExportingExcel] = useState(false);
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [exportCount, setExportCount] = useState(0);

    const getExportData = async () => {
        try {
            // page besar supaya ambil semua
            const res = await getAll999DocTrans(1, search);

            if (!res.success || !res.data) {
                toast.error("Gagal mengambil data untuk ekspor");
                return null;
            }

            const formatted = res.data.map((item: GetAllDocTransmittalData) => ({
                "TA No": item.ta_no,
                "Date": item.date,
                "Customer": item.customer,
                "PIC": item.pic,
            }));

            setExportCount(formatted.length);
            return formatted;
        } catch (error) {
            console.error(error);
            toast.error("Terjadi kesalahan saat mengambil data");
            return null;
        }
    };

    const handleCopy = async () => {
        setIsCopying(true);
        try {
            const data = await getExportData();
            if (!data) return;

            const headers = Object.keys(data[0]);
            const rows = data.map((row: any) =>
                headers.map(h => row[h]).join("\t")
            );

            const content = [headers.join("\t"), ...rows].join("\n");
            await navigator.clipboard.writeText(content);

            toast.success(`Copied Successfully`);
        } catch (err) {
            toast.error("Gagal copy data");
        } finally {
            setIsCopying(false);
        }
    };

    const handleExportCsv = async () => {
        setIsExportingCsv(true);
        try {
            const data = await getExportData();
            if (!data) return;

            const headers = Object.keys(data[0]);
            const rows = data.map((row: any) =>
                headers.map(h => `"${row[h]}"`).join(",")
            );

            const csv = [headers.join(","), ...rows].join("\n");
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `document_transmittal_${Date.now()}.csv`;
            link.click();
        } catch {
            toast.error("Export CSV gagal");
        } finally {
            setIsExportingCsv(false);
        }
    };

    const handleExportExcel = async () => {
        setIsExportingExcel(true);
        try {
            const data = await getExportData();
            if (!data) return;

            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Document Transmittal");

            XLSX.writeFile(wb, `document_transmittal_${Date.now()}.xlsx`);
        } catch {
            toast.error("Export Excel gagal");
        } finally {
            setIsExportingExcel(false);
        }
    };

    const handleExportPdf = async () => {
        setIsExportingPdf(true);
        try {
            const data = await getExportData();
            if (!data) return;

            const doc = new jsPDF("l", "mm", "a4");

            doc.setFontSize(16);
            doc.text("Document Transmittal Report", 14, 15);

            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleString("id-ID")}`, 14, 22);

            autoTable(doc, {
                startY: 30,
                head: [Object.keys(data[0])],
                body: data.map((d: any) => Object.values(d)),
                styles: { fontSize: 9 },
            });

            doc.save(`document_transmittal_${Date.now()}.pdf`);
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
            <title>Print Document Transmittal</title>
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
            <h2>Document Transmittal</h2>
            <table>
                <thead>
                    <tr>
                        ${Object.keys(data[0]).map(h => `<th>${h}</th>`).join("")}
                    </tr>
                </thead>
                <tbody>
                    ${data.map((r: GetAllDocTransmittalData) => `
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
                    <MdDocumentScanner className="text-black w-10 h-10" />
                    <h1 className="text-3xl font-normal">Document Transmittal  </h1>
                </div>
                {/* create quotations button */}
                <Link href={"/admin/document-transmittal/create"} className="bg-[#31C6D4] text-white px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75 transition-all shadow-sm"><FiPlus className="w-5 h-5 mr-1" /> Add Document Transmittal</Link>
            </div>


            {/* Search & Export Container */}
            <div className="bg-white rounded-[10px] shadow-sm w-full h-32 mt-6 flex flex-row justify-between items-center p-6 border border-[#E5E7EB]">
                <form className="flex flex-row relative" onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-[400px] rounded-sm h-10 border border-[#D1D5DC] my-auto pl-12 placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-[#31C6D4]"
                        placeholder="Search Document transmittal..."
                    />
                    <IoIosSearch className="w-6 h-6 m-auto absolute top-2 left-3 text-[#99A1AF]" />
                </form>

                <div className="grid grid-cols-5 gap-x-2 h-10">
                    <button
                        onClick={handleCopy}
                        disabled={isCopying}
                        className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Copy
                    </button>
                    <button
                        onClick={handleExportCsv}
                        disabled={isExportingCsv}
                        className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        CSV
                    </button>
                    <button
                        onClick={handleExportExcel}
                        disabled={isExportingExcel}
                        className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Excel
                    </button>
                    <button onClick={handleExportPdf} disabled={isExportingPdf} className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors">
                        PDF
                    </button>
                    <button onClick={handlePrint} className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors">
                        Print
                    </button>
                </div>
            </div>


            {/* list quotations */}
            <div className="bg-white mt-10 rounded-[10px] overflow-hidden shadow-sm border border-[#E5E7EB]">
                {/* <div className="py-5 px-4 flex justify-between border-b border-x rounded-b-sm"> */}
                <Table className="">
                    <TableHeader>
                        <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB] border-[#E5E7EB]">
                            <TableHead className="text-[#212529] font-bold pl-8 py-8"><input type="checkbox" /></TableHead>
                            <TableHead className="text-[#212529] font-bold">TA No.</TableHead>
                            <TableHead className="text-[#212529] font-bold">Date</TableHead>
                            <TableHead className="text-[#212529] font-bold">Customer</TableHead>
                            <TableHead className="text-[#212529] font-bold text-center">PIC</TableHead>
                            <TableHead className="text-[#212529] font-bold text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* list documenet transmittal */}
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : docTrans.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">
                                    No data found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            docTrans.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell className="font-medium pl-8"><input type="checkbox" /></TableCell>
                                    <TableCell className="py-4"><p className="text-sm">	{doc.ta_no}</p></TableCell>
                                    <TableCell>{doc.date}</TableCell>
                                    <TableCell>{doc.customer}</TableCell>
                                    <TableCell className="text-center">{doc.pic}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="bg-white w-fit flex space-x-3 items-center mx-auto">
                                            <Link href={`/admin/document-transmittal/edit/${doc.id}`}>
                                                {/* <MdEdit className="w-7 h-7" /> */}
                                                <LiaEdit className="w-6 h-6 text-[#00A63E] hover:opacity-70" />
                                            </Link>
                                            <div onClick={() => handleDelete(doc.id)}>
                                                {/* <FaTrash className="w-5 h-5 text-red-500" onClick={() => handleDelete(doc.id)} /> */}
                                                <RiDeleteBinLine className="w-5 h-5 text-[#E7000B] hover:opacity-70" />

                                            </div>
                                            <Link href={`/admin/document-transmittal/print/${doc.id}`}>
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