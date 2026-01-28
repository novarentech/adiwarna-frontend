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

// import { MdEdit } from "react-icons/md";
// import { FaTrash } from "react-icons/fa";
import { deleteWorkOrders, getAll999WorkOrders, GetAllWorkOrder, getAllWorkOrders, GetAllWorkOrdersResponse } from "@/lib/work-order";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { toast } from "sonner";
import { LiaEdit } from "react-icons/lia";
import { RiDeleteBinLine } from "react-icons/ri";
// import { IoMdEye } from "react-icons/io";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export default function WorkOrderPage() {

    const [workOrder, setWorkOrder] = useState<GetAllWorkOrder[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);



    const fetchData = async () => {
        setLoading(true);
        const res: GetAllWorkOrdersResponse = await getAllWorkOrders(page, search);
        console.log(res);

        if (res.success) {
            setWorkOrder(res.data);
            setLastPage(res.meta.last_page);
        }
        console.log(workOrder);
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
        if (!confirm("Are you sure you want to delete this work Order?")) return;

        const res = await deleteWorkOrders(id);

        if (!res.success) {
            // alert("Failed to delete: " + res.message);
            toast.error("Failed to delete: " + res.message);
            return;
        }

        // alert(`Purchase Order (${id}) deleted successfully!`);
        toast.success(`Work Order deleted successfully!`);

        fetchData();
    };

    // 
    // 
    // 
    // 
    // 
    // 
    // ===== EXPORT STATE =====
    const [isCopying, setIsCopying] = useState(false);
    const [isExportingCsv, setIsExportingCsv] = useState(false);
    const [isExportingExcel, setIsExportingExcel] = useState(false);
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    const [exportCount, setExportCount] = useState(0);

    // --- SELECTION STATE ---
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    // Toggle Select All (Current Page)
    const toggleSelectAll = () => {
        const allIdsOnPage = workOrder.map(wo => wo.id);
        const allSelected = allIdsOnPage.every(id => selectedIds.has(id));

        const newSelected = new Set(selectedIds);
        if (allSelected) {
            allIdsOnPage.forEach(id => newSelected.delete(id));
        } else {
            allIdsOnPage.forEach(id => newSelected.add(id));
        }
        setSelectedIds(newSelected);
    };

    // Toggle Select Individual Row
    const toggleSelectRow = (id: number) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    // ===== HELPER EXPORT DATA (FULL DATA) =====
    const getExportData = async (onlySelected: boolean = false) => {
        try {
            let dataToExport = [];

            if (onlySelected && selectedIds.size > 0) {
                 // Filter from current page data
                 dataToExport = workOrder.filter(wo => selectedIds.has(wo.id));
            } else {
                // Default: Fetch ALL data
                const res = await getAll999WorkOrders(1, search);
                if (!res.success || !res.data) {
                    toast.error("Gagal mengambil data");
                    return null;
                }
                dataToExport = res.data;
            }

            if (dataToExport.length === 0) {
                toast.warning("Tidak ada data untuk diekspor");
                return null;
            }

            const formatted = dataToExport.map((wo: GetAllWorkOrder) => ({
                "No. Work Order": `${wo.work_order_no}/AWP-INS/JKT/${wo.work_order_year}`,
                "Date Started": wo.date,
                "Worker's Name": wo.employees.join(", "),
                "Scope of Work": wo.scope_of_work.join(", "),
                "Customer": wo.customer,
                "Work Location": wo.work_location,
            }));

            setExportCount(formatted.length);
            return formatted;
        } catch {
            toast.error("Terjadi kesalahan saat export");
            return null;
        }
    };

    // ===== COPY =====
    const handleCopy = async () => {
        setIsCopying(true);
        try {
            // Determine mode
            const isSelectedMode = selectedIds.size > 0;
            const data = await getExportData(isSelectedMode);
            
            if (!data) return;

            const headers = Object.keys(data[0]);
            const rows = data.map((r: any) =>
                headers.map(h => r[h]).join("\t")
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

    // ===== CSV =====
    const handleExportCsv = async () => {
        setIsExportingCsv(true);
        try {
            const data = await getExportData();
            if (!data) return;

            const headers = Object.keys(data[0]);
            const rows = data.map((r: any) =>
                headers.map(h => `"${r[h]}"`).join(",")
            );

            const csv = [headers.join(","), ...rows].join("\n");
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `work_order_${Date.now()}.csv`;
            link.click();
        } finally {
            setIsExportingCsv(false);
        }
    };

    // ===== EXCEL =====
    const handleExportExcel = async () => {
        setIsExportingExcel(true);
        try {
            const data = await getExportData();
            if (!data) return;

            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Work Orders");

            XLSX.writeFile(wb, `work_order_${Date.now()}.xlsx`);
        } finally {
            setIsExportingExcel(false);
        }
    };

    // ===== PDF =====
    const handleExportPdf = async () => {
        setIsExportingPdf(true);
        try {
            const data = await getExportData();
            if (!data) return;

            const doc = new jsPDF("l", "mm", "a4");
            doc.setFontSize(16);
            doc.text("Work Order Report", 14, 15);
            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleString("id-ID")}`, 14, 22);

            autoTable(doc, {
                startY: 30,
                head: [Object.keys(data[0])],
                body: data.map((d: any) => Object.values(d)),
                styles: { fontSize: 8 },
                headStyles: { fillColor: [52, 58, 64] },
            });

            doc.save(`work_order_${Date.now()}.pdf`);
        } finally {
            setIsExportingPdf(false);
        }
    };

    // ===== PRINT =====
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
                <h2>Work Order Report</h2>
                <table>
                    <thead>
                        <tr>
                            ${Object.keys(data[0]).map(h => `<th>${h}</th>`).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((r: GetAllWorkOrder) => `
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
                    <MdWorkHistory className="text-black w-10 h-10" />
                    <h1 className="text-3xl font-normal">Work Order  </h1>
                </div>
                {/* create quotations button */}
                <Link href={"/admin/work-order/create"} className="bg-[#31C6D4] text-white px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75 transition-all shadow-sm"><FiPlus className="w-5 h-5 mr-1" /> Add Work Order</Link>
            </div>

            {/* Search & Export Container */}
            <div className="bg-white rounded-[10px] shadow-sm w-full h-32 mt-6 flex flex-row justify-between items-center p-6 border border-[#E5E7EB]">
                <form className="flex flex-row relative" onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-[400px] rounded-sm h-10 border border-[#D1D5DC] my-auto pl-12 placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-[#31C6D4]"
                        placeholder="Search Work Order..."
                    />
                    <IoIosSearch className="w-6 h-6 m-auto absolute top-2 left-3 text-[#99A1AF]" />
                </form>

                <div className="grid grid-cols-5 gap-x-2 h-10">
                    <button
                        onClick={handleCopy}
                        disabled={isCopying}
                        className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {selectedIds.size > 0 ? `Copy Selected (${selectedIds.size})` : "Copy All"}
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

            {/* list quotations */}
            <div className="bg-white mt-10 rounded-[10px] overflow-hidden shadow-sm border border-[#E5E7EB]">
                {/* <div className="py-5 px-4 flex justify-between border-b border-x rounded-b-sm"> */}
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB] border-[#E5E7EB]">
                            <TableHead className="text-[#212529] font-bold py-8 pl-8">
                                <input 
                                    type="checkbox" 
                                    onChange={toggleSelectAll}
                                    checked={workOrder.length > 0 && workOrder.every(wo => selectedIds.has(wo.id))}
                                />
                            </TableHead>
                            <TableHead className="text-[#212529] font-bold text-center w-20">No. Work <br /> Order</TableHead>
                            <TableHead className="text-[#212529] font-bold text-center w-20">Date <br /> Started</TableHead>
                            <TableHead className="text-[#212529] font-bold text-center w-20">Worker's Name</TableHead>
                            <TableHead className="text-[#212529] font-bold text-center max-w-[100px]">Scope of Work</TableHead>
                            <TableHead className="text-[#212529] font-bold text-center">Customer</TableHead>
                            <TableHead className="text-[#212529] font-bold text-center">Work Location</TableHead>
                            <TableHead className="text-[#212529] font-bold text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    {/* list work order */}
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : workOrder.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">
                                    No data found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            workOrder.map((wo) => (
                                <TableRow key={wo.id}>
                                    <TableCell className="font-medium pl-8">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedIds.has(wo.id)}
                                            onChange={() => toggleSelectRow(wo.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="py-4"><p className="text-sm">{wo.work_order_no}/AWP-INS/JKT/{wo.work_order_year}</p></TableCell>
                                    <TableCell className="text-center">{wo.date}</TableCell>
                                    {/* ini worker name */}
                                    <TableCell className="text-center whitespace-normal wrap-break-words overflow-hidden">
                                        {wo.employees.map((w, index) => (
                                            <span key={index}>
                                                {w}
                                                {index !== wo.employees.length - 1 && ", "}
                                            </span>
                                        ))}
                                    </TableCell>
                                    <TableCell className="text-left max-w-[400px] whitespace-normal wrap-break-words overflow-hidden">
                                        {wo.scope_of_work.map((w, index) => (
                                            <span key={index}>
                                                {w}
                                                {index !== wo.scope_of_work.length - 1 && ", "}
                                            </span>
                                        ))}
                                    </TableCell>
                                    <TableCell className="text-center w-14">{wo.customer}</TableCell>
                                    <TableCell className="text-center wrap-break-words max-w-[250px] whitespace-normal">{wo.work_location}	</TableCell>
                                    <TableCell className="text-center">
                                        <div className="bg-white w-fit flex space-x-3 items-center mx-auto">
                                            <Link href={`/admin/work-order/edit/${wo.id}`}>
                                                {/* <MdEdit className="w-7 h-7" /> */}
                                                <LiaEdit className="w-6 h-6 text-[#00A63E] hover:opacity-70" />
                                            </Link>
                                            <div onClick={() => handleDelete(wo.id)}>
                                                {/* <FaTrash className="w-5 h-5 text-red-500" onClick={() => handleDelete(wo.id)} /> */}
                                                <RiDeleteBinLine className="w-5 h-5 text-[#E7000B] hover:opacity-70" />
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                {/* </div> */}
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