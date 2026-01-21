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
    const [isExporting, setIsExporting] = useState(false);
    const [exportCount, setExportCount] = useState(0);

    const getExportData = async () => {
        setIsExporting(true);

        // sesuaikan kalau API kamu beda
        const res = await getAll999PurchaseOrders(1, search);

        if (!res.success || !res.data) {
            toast.error("Gagal mengambil data Purchase Order");
            setIsExporting(false);
            return null;
        }

        const formatted = res.data.map((po: any) => ({
            "PO No": `${po.po_no}/PO/AWP-INS/${po.po_year}`,
            "Date": po.date,
            "Customer": po.customer,
            "PIC": po.pic_name,
            "PIC Phone": po.pic_phone,
            "Required Delivery Date": handleISODateFormat(po.required_date),
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


            {/* list purchaseOrder */}
            <div className="bg-white mt-10 rounded-[10px] overflow-hidden shadow-sm border border-[#E5E7EB]">

                <Table className="">
                    <TableHeader>
                        <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB] border-[#E5E7EB]">
                            <TableHead className="text-[#212529] font-bold py-8 pl-8"><input type="checkbox" /></TableHead>
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
                                    <TableCell className="font-medium pl-8"><input type="checkbox" /></TableCell>
                                    <TableCell className="py-4"><p className="text-sm">{po.po_no}/PO/AWP-INS/{po.po_year}</p></TableCell>
                                    <TableCell className="font-medium">{po.date}</TableCell>
                                    <TableCell>{po.customer}</TableCell>
                                    <TableCell>{po.pic_name}</TableCell>
                                    <TableCell className="">{po.pic_phone}</TableCell>
                                    <TableCell className="">
                                        {/* {po.required_date} */}
                                        {handleISODateFormat(po.required_date)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="bg-white w-fit flex space-x-3 items-center mx-auto">
                                            <Link href={`/admin/purchase-order/edit/${po.id}`}>
                                                {/* <MdEdit className="w-7 h-7" /> */}
                                                <LiaEdit className="w-6 h-6 text-[#00A63E] hover:opacity-70" />
                                            </Link>
                                            <div>
                                                {/* <FaTrash className="w-5 h-5 text-red-500" onClick={() => handleDelete(po.id)} /> */}
                                                <RiDeleteBinLine className="w-5 h-5 text-[#E7000B] hover:opacity-70" />
                                            </div>
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