"use client";

import { MdWorkHistory } from "react-icons/md";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { FaCircle } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { IoMdEye } from "react-icons/io"; // Ditambahkan untuk ikon View
// Import interface dan fungsi API yang diperlukan
import { getAll999TrackRecords, getAllTrackRecords, TrackRecordItem, TrackRecordMeta, TrackRecordResponse } from "@/lib/track-records";

import * as XLSX from "xlsx";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";


export default function TrackRecordPage() {

    const columnList = {
        noWorkOrder: "No. Work Order",
        dateStarted: "Date Started",
        workerName: "Worker's Name",
        scopeOfWork: "Scope of Work",
        customer: "Customer",
        workLocation: "Work Location",
        action: "Action", // Ditambahkan untuk Action
    };

    // --- STATE DATA DAN PAGINATION ---
    const [trackRecords, setTrackRecords] = useState<TrackRecordItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter dan Pagination State
    const [search, setSearch] = useState("");
    const [tempSearch, setTempSearch] = useState(""); // Untuk input search yang belum disubmit
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15); // Default 15
    const [meta, setMeta] = useState<TrackRecordMeta>({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
    });

    // Filter Tanggal State
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [tempStartDate, setTempStartDate] = useState(""); // Input
    const [tempEndDate, setTempEndDate] = useState(""); // Input


    // --- FUNGSI FETCH DATA ---
    const fetchData = async () => {
        setLoading(true);
        const res: TrackRecordResponse = await getAllTrackRecords(page, perPage, search, startDate, endDate);

        if (res.success) {
            setTrackRecords(res.data);
            setMeta(res.meta);
        } else {
            setTrackRecords([]);
            // Reset meta jika gagal
            setMeta({ current_page: 1, last_page: 1, per_page: perPage, total: 0 });
        }

        setLoading(false);
    };

    // --- USE EFFECT: Trigger fetch data saat filter/pagination berubah ---
    useEffect(() => {
        fetchData();
    }, [page, perPage, search, startDate, endDate]);
    // Data akan di-fetch ulang jika salah satu dependensi ini berubah

    // --- HANDLER: SEARCH SUBMIT ---
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(tempSearch);
        setPage(1); // Reset page ke 1
    };

    // --- HANDLER: PER PAGE (ENTRIES) ---
    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPerPage(Number(e.target.value));
        setPage(1); // Reset page ke 1
    };

    // --- HANDLER: DATE FILTER SUBMIT ---
    const handleDateFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStartDate(tempStartDate);
        setEndDate(tempEndDate);
        setPage(1); // Reset page ke 1
    };

    // --- HANDLER: PAGINATION BUTTONS ---
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= meta.last_page) {
            setPage(newPage);
        }
    };

    // --- UTILITY: FORMAT TANGGAL & NO WORK ORDER ---
    // Fungsi untuk memformat tanggal YYYY-MM-DD menjadi DD MMMM YYYY
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    // Fungsi untuk memformat No. Work Order
    const formatWorkOrder = (no: string, year: number) => {
        // Contoh: 1234/AWP-INS/JKT/2025 (ini harus disesuaikan dengan format API Anda)
        // Jika API hanya memberikan NO dan YEAR, kita perlu asumsikan sisanya
        return `${no}/AWP-INS/JKT/${year}`; // XXX Placeholder, sesuaikan jika ada data lokasi
    };


    const [columns, setColumns] = useState(
        Object.fromEntries(Object.keys(columnList).map((key) => [key, true]))
    );

    const [openDropdown, setOpenDropdown] = useState(false);


    // Utility untuk mendapatkan nomor urut
    const getSequentialNumber = (index: number) => {
        // Perkiraan nomor 'from'
        const from = (meta.current_page - 1) * meta.per_page + 1;
        return from + index;
    };

    const [isCopying, setIsCopying] = useState(false);
    const [isExportingCsv, setIsExportingCsv] = useState(false);
    const [isExportingExcel, setIsExportingExcel] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [exportCount, setExportCount] = useState(0);

    // --- HELPER: FORMAT DATA UNTUK EKSPOR ---
    const getExportData = async () => {
        try {
            // Ambil data berdasarkan filter yang sedang aktif
            const res = await getAll999TrackRecords(1, 999999, search, startDate, endDate);

            if (!res.success || !res.data) {
                toast.error("Gagal mengambil data untuk ekspor");
                return null;
            }

            const formatted = res.data.map((item: any) => ({
                "No. Work Order": formatWorkOrder(item.work_order_no, item.work_order_year),
                "Date Started": item.date_started,
                "Worker's Name": item.workers_name,
                "Scope of Work": item.scope_of_work,
                "Customer": item.customer,
                "Work Location": item.work_location,
            }));

            setExportCount(formatted.length);
            return formatted;
        } catch (error) {
            console.error("Export data error:", error);
            toast.error("Terjadi kesalahan saat mengambil data");
            return null;
        }
    };

    // --- HANDLER: COPY ---
    const handleCopy = async () => {
        setIsCopying(true); // Tanda bahwa proses ekspor sedang berlangsung (untuk efek loading jika diperlukan)
        try {
            const data = await getExportData();
            if (!data) return;

            const headers = Object.keys(data[0]);
            const rows = data.map((obj: any) =>
                headers.map(header => obj[header]).join("\t") // Gunakan tab sebagai pemisah antar kolom
            );

            // Gabungkan header dan data dengan newline (\n)
            const content = [headers.join("\t"), ...rows].join("\n");

            // Salin ke clipboard
            await navigator.clipboard.writeText(content);

            triggerSuccess(); // Tampilkan modal sukses
        } catch (error) {
            console.error("Copy error:", error);
            toast.error("Terjadi kesalahan saat menyalin data");
        } finally {
            setIsCopying(false); // Menyelesaikan proses ekspor
        }
    };


    // --- HANDLER: CSV ---
    const handleExportCsv = async () => {
        setIsExportingCsv(true);
        try {
            const data = await getExportData();
            if (!data) return;

            const headers = Object.keys(data[0]);
            const csvRows = data.map((obj: any) =>
                headers.map(header => `"${obj[header]}"`).join(",")
            );

            const content = [headers.join(","), ...csvRows].join("\n");
            const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.setAttribute("href", url);
            link.setAttribute("download", `track_record_${new Date().getTime()}.csv`);
            link.style.visibility = "hidden";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // triggerSuccess();
        } catch (error) {
            console.error("Export CSV error:", error);
            toast.error("Terjadi kesalahan saat mengekspor CSV");
        } finally {
            setIsExportingCsv(false);
        }
    };

    // --- HANDLER: EXCEL ---
    const handleExportExcel = async () => {
        setIsExportingExcel(true);
        try {
            const data = await getExportData();
            if (!data) return;

            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Track Records");

            const fileName = `track_record_${new Date().getTime()}.xlsx`;
            XLSX.writeFile(workbook, fileName);

            // triggerSuccess();
        } catch (error) {
            console.error("Export Excel error:", error);
            toast.error("Terjadi kesalahan saat membuat file Excel");
        } finally {
            setIsExportingExcel(false);
        }
    };

    // --- TRIGGER SUCCESS MODAL ---
    const triggerSuccess = () => {
        setShowModal(true);
        setTimeout(() => setShowModal(false), 3000);
    };

    const [isExportingPdf, setIsExportingPdf] = useState(false);
    // --- HANDLER: PRINT ---
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
                    <title>Print Track Record</title>
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
                    <h1>Track Record Report</h1>
                    <p>Generated on: ${new Date().toLocaleString('id-ID')}</p>
                    <table>
                        <thead>
                            <tr>
                                ${Object.keys(data[0]).map(key => `<th>${key}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map((row: TrackRecordItem) => `
                                <tr>
                                    ${Object.values(row).map(val => `<td>${val}</td>`).join('')}
                                </tr>
                            `).join('')}
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

    // --- HANDLER: PDF ---
    const handleExportPdf = async () => {
        setIsExportingPdf(true);
        try {
            const data = await getExportData();
            if (!data) return;

            const doc = new jsPDF('l', 'mm', 'a4'); // 'l' untuk landscape

            // Judul
            doc.setFontSize(18);
            doc.text("Track Record Report", 14, 15);

            // Info Tambahan
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleString('id-ID')}`, 14, 22);

            // Buat Tabel
            const headers = [Object.keys(data[0])];
            const body = data.map((item: any) => Object.values(item));

            autoTable(doc, {
                head: headers,
                body: body,
                startY: 30,
                styles: { fontSize: 8, cellPadding: 2 },
                headStyles: { fillColor: [108, 117, 125] }, // Warna abu-abu sesuai tema Anda
                alternateRowStyles: { fillColor: [245, 245, 245] },
            });

            doc.save(`track_record_${new Date().getTime()}.pdf`);
        } catch (error) {
            console.error("PDF Error:", error);
            toast.error("Terjadi kesalahan saat membuat PDF");
        } finally {
            setIsExportingPdf(false);
        }
    };


    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9] border">
            {/* MODAL NOTIFIKASI */}
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
                                Copied <span className="font-semibold text-blue-600">{exportCount} rows </span> to clipboard
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
            <div className="flex flex-row items-center space-x-3 mt-2">
                <FaCircle className="text-black w-7 h-7" />
                <h1 className="text-3xl font-normal">Track Record</h1>
            </div>

            {/* start Filter tanggal */}
            <form onSubmit={handleDateFilterSubmit} className="w-2/3 grid grid-cols-[3fr_3fr_0.1fr] mt-12 space-x-4">
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col space-y-1">
                        {/* Tanggal Awal: */}
                        <label htmlFor="tanggal-awal-filter" className="font-bold">Tanggal Awal:</label>
                        <div className="flex items-center">
                            <input
                                type="date"
                                id="tanggal-awal-filter"
                                className="flex-1 bg-white border rounded-sm h-9 px-2"
                                value={tempStartDate}
                                onChange={(e) => setTempStartDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col space-y-4">
                    {/* Tanggal Akhir: */}
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="tanggal-akhir-filter" className="font-bold">Tanggal Akhir:</label>
                        <div className="flex items-center">
                            <input
                                type="date"
                                id="tanggal-akhir-filter"
                                className="flex-1 bg-white border rounded-sm h-9 px-2"
                                value={tempEndDate}
                                onChange={(e) => setTempEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col space-y-4 mt-auto">
                    <div className="flex items-center">
                        <button
                            type="submit"
                            id="apply-filter-date"
                            className="flex-1 border rounded-sm h-9 px-2 bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
                        >
                            Filter
                        </button>
                    </div>
                </div>
            </form>
            {/* end Filter tanggal */}

            {/* list track record */}
            <div className="bg-white mt-2">
                <div className="py-3 px-4 flex justify-between border rounded-t-sm">
                </div>
                {/* ini untuk nampilin berapa */}
                <div className="flex justify-between py-3 px-4 border-x">
                    {/* ENTRIES */}
                    <div className="flex flex-row space-x-2 items-center">
                        <p>show</p>
                        <select
                            name="perPage"
                            id="perPage"
                            className="w-14 h-8 border rounded-sm"
                            value={perPage}
                            onChange={handlePerPageChange}
                        >
                            <option value="15">15</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <p>entries</p>
                    </div>

                    {/* SEARCH */}
                    <form className="flex flex-row space-x-2 items-center" onSubmit={handleSearchSubmit}>
                        <label htmlFor="search-input">Search :</label>
                        <input
                            type="text"
                            id="search-input"
                            className="flex bg-white border rounded-sm h-9 px-2"
                            value={tempSearch}
                            onChange={(e) => setTempSearch(e.target.value)}
                        />
                        <button type="submit" hidden></button> {/* Tombol submit tersembunyi untuk trigger enter */}
                    </form>
                </div>

                {/* start of copy, csv,, excel, pdf, print, column visibility*/}
                <div className="flex pr-6 border-x">
                    {/* <div className="bg-[#6c757d] w-full h-[38px] rounded-sm flex flex-row items-center text-white">
                        <button onClick={handleCopy} disabled={isCopying} className="flex-1 h-full hover:brightness-125 bg-[#6c757d] rounded-l-sm">{isCopying ? "Loading..." : "Copy"}</button>
                        <button onClick={handleExportCsv} disabled={isExportingCsv} className="flex-1 h-full hover:brightness-125 bg-[#6c757d]">{isExportingCsv ? "Exporting..." : "CSV"}</button>
                        <button onClick={handleExportExcel} disabled={isExportingExcel} className="flex-1 h-full hover:brightness-125 bg-[#6c757d]">{isExportingExcel ? "Exporting..." : "Excel"}</button>
                        <button onClick={handleExportPdf} disabled={isExportingPdf} className="flex-1 h-full hover:brightness-125 bg-[#6c757d]">{isExportingPdf ? "..." : "PDF"}</button>
                        <button onClick={handlePrint} className="flex-1 h-full hover:brightness-125 bg-[#6c757d] rounded-r-sm">Print</button>
                        <div className="relative">
                            <button
                                type="button"
                                className="flex-2 h-full px-3 bg-[#6c757d]  hover:brightness-125 text-white"
                                onClick={() => setOpenDropdown(!openDropdown)}
                            >
                                Column Visibility
                            </button>

                            {openDropdown && (
                                <div className="absolute -right-5 mt-2 bg-white text-black border rounded shadow p-3 z-40 w-48">
                                    {Object.entries(columnList).map(([key, label]) => (
                                        <label key={key} className="flex items-center space-x-0.5 mb-2">
                                            <input
                                                type="checkbox"
                                                checked={columns[key as keyof typeof columns]}
                                                onChange={() =>
                                                    setColumns({ ...columns, [key]: !columns[key as keyof typeof columns] })
                                                }
                                            />
                                            <span>{label}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div> */}
                    <div className="grid grid-cols-5 gap-x-2 h-10 ml-auto">
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

                {/* TABLE DATA */}
                <div className="py-5 px-4 flex justify-between border-x">
                    {loading ? (
                        <p>Loading track records...</p>
                    ) : (
                        <Table className="z-10">
                            <TableHeader>
                                <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB] border-[#E5E7EB]">
                                    <TableHead className="text-[#212529] font-bold py-6"><input type="checkbox" /></TableHead>
                                    {columns.noWorkOrder && (
                                        <TableHead className="text-[#212529] font-bold text-center w-20">No. Work <br /> Order</TableHead>
                                    )}
                                    {columns.dateStarted && (
                                        <TableHead className="text-[#212529] font-bold text-center w-20">Date <br /> Started</TableHead>
                                    )}
                                    {columns.workerName && (
                                        <TableHead className="text-[#212529] font-bold text-center w-20">Worker's Name</TableHead>
                                    )}
                                    {columns.scopeOfWork && (
                                        <TableHead className="text-[#212529] font-bold text-center max-w-[100px]">Scope of Work</TableHead>
                                    )}
                                    {columns.customer && (
                                        <TableHead className="text-[#212529] font-bold text-center">Customer</TableHead>
                                    )}
                                    {columns.workLocation && (
                                        <TableHead className="text-[#212529] font-bold text-center">Work Location</TableHead>
                                    )}
                                    {/* {columns.action && (
                                        <TableHead className="text-[#212529] font-bold text-center">Action</TableHead>
                                    )} */}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {trackRecords.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={Object.keys(columnList).length + 1} className="text-center">
                                            Data Track Record tidak ditemukan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    trackRecords.map((item, index) => (
                                        <TableRow key={index} className="hover:bg-gray-50 border-[#E5E7EB]">
                                            <TableCell className="font-medium"><input type="checkbox" /></TableCell>
                                            {columns.noWorkOrder && (
                                                <TableCell className="py-4 text-sm">
                                                    {formatWorkOrder(item.work_order_no, item.work_order_year)}
                                                </TableCell>
                                            )}
                                            {columns.dateStarted && (
                                                <TableCell className="text-center">
                                                    {formatDate(item.date_started)}
                                                </TableCell>
                                            )}
                                            {columns.workerName && (
                                                <TableCell className="text-center whitespace-normal wrap-break-words overflow-hidden">
                                                    {item.workers_name}
                                                </TableCell>
                                            )}
                                            {columns.scopeOfWork && (
                                                <TableCell className="text-left max-w-[400px] whitespace-normal wrap-break-words overflow-hidden">
                                                    {item.scope_of_work}
                                                </TableCell>
                                            )}
                                            {columns.customer && (
                                                <TableCell className="text-center">
                                                    {item.customer}
                                                </TableCell>
                                            )}
                                            {columns.workLocation && (
                                                <TableCell className="text-center wrap-break-words max-w-[300px] whitespace-normal">
                                                    {item.work_location}
                                                </TableCell>
                                            )}
                                            {/* {columns.action && (
                                                <TableCell className="text-center">
                                                    <Link href={`/admin/track-record/view/${item.work_order_no}`} title="View Detail">
                                                        <IoMdEye className="w-6 h-6 text-blue-500 mx-auto" />
                                                    </Link>
                                                </TableCell>
                                            )} */}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>

                {/* PAGINATION FOOTER */}
                <div className="flex justify-between border-b border-x rounded-b-sm py-3 px-4">
                    {/* Display total entries */}
                    <div>
                        Showing {meta.total > 0 ? `${(meta.current_page - 1) * perPage + 1} to ${Math.min(meta.current_page * perPage, meta.total)}` : "0"} of {meta.total} entries
                    </div>

                    {/* Pagination Controls */}
                    <div className="border flex flex-row h-9 items-center rounded-sm overflow-hidden text-white font-semibold text-sm">

                        {/* Previous Button */}
                        <button
                            className={`h-full flex justify-center items-center px-3 transition-colors ${meta.current_page === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                            onClick={() => handlePageChange(meta.current_page - 1)}
                            disabled={meta.current_page === 1}
                        >
                            Previous
                        </button>

                        {/* Page Number Buttons */}
                        {Array.from({ length: meta.last_page }, (_, index) => index + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                className={`w-10 flex justify-center items-center h-full ${meta.current_page === pageNum ? 'bg-blue-700 text-white' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
                                onClick={() => handlePageChange(pageNum)}
                            >
                                {pageNum}
                            </button>
                        ))}

                        {/* Next Button */}
                        <button
                            className={`h-full flex justify-center items-center px-3 transition-colors ${meta.current_page === meta.last_page || meta.total === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                            onClick={() => handlePageChange(meta.current_page + 1)}
                            disabled={meta.current_page === meta.last_page || meta.total === 0}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}