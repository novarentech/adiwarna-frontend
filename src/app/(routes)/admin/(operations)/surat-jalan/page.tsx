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
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Import API & Interfaces
import { GetAllDeliveryNote, GetAllDeliveryNoteResponse, GetAllDeliveryNoteData, deleteDeliveryNote, GetAll999DeliveryNote } from "@/lib/delivery-notes";
import { toast } from "sonner";
import Image from "next/image";

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
            toast.error("Failed to delete: " + res.message);
            return;
        }

        toast.success("Equipment deleted successfully!");
        fetchData(search, page);
    };


    // 
    // 
    // 
    const [isExporting, setIsExporting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [exportCount, setExportCount] = useState(0);
    const [isExportingPdf, setIsExportingPdf] = useState(false);

    // --- HELPER: FORMAT DATA UNTUK EKSPOR ---
    const getExportData = async () => {
        setIsExporting(true);
        const res = await GetAll999DeliveryNote();

        if (!res.success || !res.data) {
            toast.error("Gagal mengambil data untuk ekspor");
            setIsExporting(false);
            return null;
        }

        const formatted = res.data.map((sj: any) => ({
            "No. Surat Jalan": `${sj.dn_no}/AWP/${sj.dn_date}`,
            "Tanggal": formatDate(sj.date),
            "Customer (Kepada)": sj.customer,
            "No. Work Order": sj.wo_no,
            "Plat Kendaraan": sj.vehicle_plate,
            "Total Items": sj.total_items,
            "Status": sj.status,
        }));

        setExportCount(formatted.length);
        return formatted;
    };

    // --- HANDLER: COPY ---
    const handleCopy = async () => {
        const data = await getExportData();
        if (!data) return;

        const headers = Object.keys(data[0]);
        const rows = data.map((obj: any) =>
            headers.map(header => obj[header]).join("\t")
        );

        const content = [headers.join("\t"), ...rows].join("\n");
        await navigator.clipboard.writeText(content);
        triggerSuccess();
    };

    // --- HANDLER: CSV ---
    const handleCSV = async () => {
        const data = await getExportData();
        if (!data) return;

        const headers = Object.keys(data[0]);
        const rows = data.map((obj: any) =>
            headers.map(header => `"${obj[header]}"`).join(",")
        );

        const content = [headers.join(","), ...rows].join("\n");
        const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `surat_jalan_${new Date().getTime()}.csv`;
        link.click();

        setIsExporting(false);
    };

    // --- HANDLER: EXCEL ---
    const handleExcel = async () => {
        const data = await getExportData();
        if (!data) return;

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Surat Jalan");
        XLSX.writeFile(workbook, `surat_jalan_${new Date().getTime()}.xlsx`);
        setIsExporting(false);
    };

    const triggerSuccess = () => {
        setShowModal(true);
        setIsExporting(false);
        setTimeout(() => setShowModal(false), 3000);
    };

    const handleExportPdf = async () => {
        setIsExportingPdf(true);
        try {
            const data = await getExportData();
            if (!data) return;

            const doc = new jsPDF("l", "mm", "a4");

            doc.setFontSize(16);
            doc.text("Delivery Note", 14, 15);

            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleString("id-ID")}`, 14, 22);

            autoTable(doc, {
                startY: 30,
                head: [Object.keys(data[0])],
                body: data.map((d: any) => Object.values(d)),
                styles: { fontSize: 9 },
            });

            doc.save(`delivery_note_${Date.now()}.pdf`);
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
                    <title>Print Delivery Note</title>
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
                    <h2>Delivery Note</h2>
                    <table>
                        <thead>
                            <tr>
                                ${Object.keys(data[0]).map(h => `<th>${h}</th>`).join("")}
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map((r: GetAllDeliveryNoteData) => `
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
            {/* Modal Notifikasi */}
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

            <div className="flex flex-row justify-between items-center space-x-2 mt-14">
                <div className="flex flex-row items-center space-x-4 mt-2">
                    <Image src={"/icons/icon-surat-jalan-black.svg"} className="text-black contrast-200" alt="icon quotations" width={40} height={40} />
                    <h1 className="text-3xl font-normal">Surat Jalan  </h1>
                </div>
                {/* <h1 className="text-3xl font-normal text-[#212529]">Daftar Surat Jalan</h1> */}
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

            {/* Table Container */}
            <div className="bg-white mt-10 rounded-[10px] overflow-hidden shadow-sm border border-[#E5E7EB]">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB] border-[#E5E7EB]">
                            <TableHead className="text-[#212529] font-bold py-8 pl-8">No Surat</TableHead>
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
                                    <TableCell className="py-6 font-medium pl-6">{sj.dn_no}/AWP/{sj.dn_date}</TableCell>
                                    <TableCell>{formatDate(sj.date)}</TableCell>
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
                                            {/* <Link href={`/admin/surat-jalan/detail/${sj.id}`}>
                                                <LuEye className="w-5 h-5 text-[#155DFC] hover:opacity-70" />
                                            </Link> */}
                                            <Link href={`/admin/surat-jalan/edit/${sj.id}`}>
                                                <LiaEdit className="w-6 h-6 text-[#00A63E] hover:opacity-70" />
                                            </Link>
                                            <Link href={`/admin/surat-jalan/print/${sj.id}`}>
                                                <LuPrinter className="w-5 h-5 text-[#4A5565] hover:opacity-70" />
                                            </Link>
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