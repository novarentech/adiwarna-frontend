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

// import { MdEdit } from "react-icons/md";
// import { FaTrash } from "react-icons/fa";
// import { IoMdEye } from "react-icons/io";
import { IoMdCart } from "react-icons/io";
import { useEffect, useState } from "react";
import { deletePurchaseOrders, getAll999PurchaseOrders, getAllPurchaseOrders, PurchaseOrder } from "@/lib/purchase-order";
import { toast } from "sonner";
import { LuEye } from "react-icons/lu";
import { LiaEdit } from "react-icons/lia";
import { RiDeleteBinLine } from "react-icons/ri";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export default function PurchaseOrderPage() {
    const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const res = await getAllPurchaseOrders(page, search);

        if (res.success) {
            setPurchaseOrder(res.data);
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

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this Purchase Order?")) return;

        const res = await deletePurchaseOrders(id);

        if (!res.success) {
            // alert("Failed to delete: " + res.message);
            toast.error("Failed to delete: " + res.message);
            return;
        }

        // alert(`Purchase Order (${id}) deleted successfully!`);
        // toast.success(`Purchase Order (${id}) deleted successfully!`);
        toast.success(`Purchase Order deleted successfully!`);
        fetchData();
    };

    const handleISODateFormat = (date: string) => {
        let d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }

        return [year, month, day].join('-');


    }

    // 
    // 
    // 
    // 
    // 
    // 
    const [isExporting, setIsExporting] = useState(false);
    const [exportCount, setExportCount] = useState(0);
    const [isExportingPdf, setIsExportingPdf] = useState(false);

    // --- SELECTION STATE ---
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    // Toggle Select All (Current Page)
    const toggleSelectAll = () => {
        const allIdsOnPage = purchaseOrder.map(po => po.id);
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

    const getExportData = async (onlySelected: boolean = false) => {
        setIsExporting(true);
        let dataToExport = [];

         if (onlySelected && selectedIds.size > 0) {
             // Filter from current page data
             dataToExport = purchaseOrder.filter(po => selectedIds.has(po.id));
        } else {
             // sesuaikan kalau API kamu beda
            const res = await getAll999PurchaseOrders(1, search);

            if (!res.success || !res.data) {
                toast.error("Gagal mengambil data Purchase Order");
                setIsExporting(false);
                return null;
            }
            dataToExport = res.data;
        }

        if (dataToExport.length === 0) {
             toast.warning("Tidak ada data untuk diekspor");
             setIsExporting(false);
             return null;
        }

        const formatted = dataToExport.map((po: any) => ({
            "PO No": `${po.po_no}/PO/AWP-INS/${po.po_year}`,
            "Date": formatDate(po.date),
            "Customer": po.customer,
            "PIC": po.pic_name,
            "PIC Phone": po.pic_phone,
            "Required Delivery Date": formatDate(po.required_date),
        }));

        setExportCount(formatted.length);
        setIsExporting(false);
        return formatted;
    };

    const handleCopy = async () => {
        // Determine mode
        const isSelectedMode = selectedIds.size > 0;
        const data = await getExportData(isSelectedMode);

        if (!data) return;

        const headers = Object.keys(data[0]);
        const rows = data.map((obj: any) =>
            headers.map((h) => obj[h]).join("\t")
        );

        const content = [headers.join("\t"), ...rows].join("\n");
        await navigator.clipboard.writeText(content);

        toast.success(`Copied ${data.length} rows`);
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
        link.download = `purchase_order_${Date.now()}.csv`;
        link.click();

        setIsExporting(false);
    };

    const handleExcel = async () => {
        const data = await getExportData();
        if (!data) return;

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Purchase Order");

        XLSX.writeFile(workbook, `purchase_order_${Date.now()}.xlsx`);
        setIsExporting(false);
    };

    // ===== PDF =====
    const handleExportPdf = async () => {
        setIsExportingPdf(true);
        try {
            const data = await getExportData();
            if (!data) return;

            const doc = new jsPDF("l", "mm", "a4");
            doc.setFontSize(16);
            doc.text("Purchase Order Report", 14, 15);
            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleString("id-ID")}`, 14, 22);

            autoTable(doc, {
                startY: 30,
                head: [Object.keys(data[0])],
                body: data.map((d: any) => Object.values(d)),
                styles: { fontSize: 8 },
                headStyles: { fillColor: [52, 58, 64] },
            });

            doc.save(`purchase_order_${Date.now()}.pdf`);
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
                    <h2>Purchase order Report</h2>
                    <table>
                        <thead>
                            <tr>
                                ${Object.keys(data[0]).map(h => `<th>${h}</th>`).join("")}
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map((r: PurchaseOrder) => `
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
                    <IoMdCart className="text-black w-10 h-10" />
                    <h1 className="text-3xl font-normal">Purchase Order  </h1>
                </div>

                <Link href={"/admin/purchase-order/create"} className="bg-[#31C6D4] text-white px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75 transition-all shadow-sm"><FiPlus className="w-5 h-5 mr-1" /> Add Purchase Order Data </Link>
            </div>


            {/* Search & Export Container */}
            <div className="bg-white rounded-[10px] shadow-sm w-full h-32 mt-6 flex flex-row justify-between items-center p-6 border border-[#E5E7EB]">
                <form className="flex flex-row relative" onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-[400px] rounded-sm h-10 border border-[#D1D5DC] my-auto pl-12 placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-[#31C6D4]"
                        placeholder="Search PO..."
                    />
                    <IoIosSearch className="w-6 h-6 m-auto absolute top-2 left-3 text-[#99A1AF]" />
                </form>

                <div className="grid grid-cols-5 gap-x-2 h-10">
                    <button
                        onClick={handleCopy}
                        disabled={isExporting}
                        className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                         {selectedIds.size > 0 ? `Copy Selected (${selectedIds.size})` : "Copy All"}
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


            {/* list purchaseOrder */}
            <div className="bg-white mt-10 rounded-[10px] overflow-hidden shadow-sm border border-[#E5E7EB]">

                <Table className="">
                    <TableHeader>
                        <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB] border-[#E5E7EB]">
                            <TableHead className="text-[#212529] font-bold py-8 pl-8">
                                <input 
                                    type="checkbox" 
                                    onChange={toggleSelectAll}
                                    checked={purchaseOrder.length > 0 && purchaseOrder.every(po => selectedIds.has(po.id))}
                                />
                            </TableHead>
                            <TableHead className="text-[#212529] font-bold">PO No.</TableHead>
                            <TableHead className="text-[#212529] font-bold">Date</TableHead>
                            <TableHead className="text-[#212529] font-bold">Customer</TableHead>
                            <TableHead className="text-[#212529] font-bold">PIC</TableHead>
                            <TableHead className="text-[#212529] font-bold">PIC's Phone Number</TableHead>
                            <TableHead className="text-[#212529] font-bold">Required Delivery Date</TableHead>
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
                        ) : purchaseOrder.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">
                                    No data found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            purchaseOrder.map((po) => (
                                <TableRow key={po.id}>
                                    <TableCell className="font-medium pl-8">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedIds.has(po.id)}
                                            onChange={() => toggleSelectRow(po.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="py-4"><p className="text-sm">{po.po_no}/PO/AWP-INS/{po.po_year}</p></TableCell>
                                    <TableCell className="font-medium">{formatDate(po.date)}</TableCell>
                                    <TableCell>{po.customer}</TableCell>
                                    <TableCell>{po.pic_name}</TableCell>
                                    <TableCell className="">{po.pic_phone}</TableCell>
                                    <TableCell className="">
                                        {/* {po.required_date} */}
                                        {formatDate(po.required_date)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="bg-white w-fit flex space-x-3 items-center mx-auto">
                                            <Link href={`/admin/purchase-order/edit/${po.id}`}>
                                                {/* <MdEdit className="w-7 h-7" /> */}
                                                <LiaEdit className="w-6 h-6 text-[#00A63E] hover:opacity-70" />
                                            </Link>
                                            <button onClick={() => handleDelete(po.id)}>
                                                <RiDeleteBinLine className="w-5 h-5 text-[#E7000B] hover:opacity-70" />
                                            </button>
                                            <Link href={`/admin//purchase-order/print/${po.id}`}>
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

        </div >
    )
}