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

import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { deleteWorkOrders, GetAllWorkOrder, getAllWorkOrders, GetAllWorkOrdersResponse } from "@/lib/work-order";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { toast } from "sonner";
// import { IoMdEye } from "react-icons/io";


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
    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <MdWorkHistory className="text-black w-10 h-10" />
                <h1 className="text-3xl font-normal">Work Order  </h1>
            </div>

            {/* list quotations */}
            <div className="bg-white mt-12">
                <div className="py-3 px-4 flex justify-between border rounded-t-sm">
                    {/* create quotations button */}
                    <Link href={"/admin/work-order/create"} className="bg-[#17A2B8] text-white px-2 h-10 flex justify-center items-center rounded-sm">Add Work Order<FiPlus className="w-5 h-5 ml-1" /> </Link>
                    {/* search bar */}
                    <form onSubmit={handleSearch} className="flex flex-row">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)} id="search-input" type="text" className="w-[250px] rounded-l-sm h-8 border my-auto px-2 placeholder:text-sm" placeholder="Search Work Order .." />
                        <button className="border-r border-t border-b h-8 w-8 my-auto flex rounded-r-sm" type="submit"><IoIosSearch className="w-5 m-auto" /></button>
                    </form>
                </div>
                <div className="py-5 px-4 flex justify-between border-b border-x rounded-b-sm">
                    <Table className="bg-[#f2f2f2]">
                        <TableHeader>
                            <TableRow className="bg-[#dadada] hover:bg-[#dadada]">
                                <TableHead className="text-[#212529] font-bold py-6"><input type="checkbox" /></TableHead>
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
                                        <TableCell className="font-medium"><input type="checkbox" /></TableCell>
                                        <TableCell className="py-4"><p className="text-sm">{wo.work_order_no}/AWP-INS/JKT/{wo.work_order_year}</p></TableCell>
                                        <TableCell className="text-center">{wo.date}</TableCell>
                                        {/* ini worker name */}
                                        <TableCell className="text-center whitespace-normal wrap-break-words overflow-hidden">{wo.employees.map((w, index) => (
                                            <span key={index}>{w}, </span>
                                        ))}</TableCell>
                                        <TableCell className="text-left max-w-[500px] whitespace-normal wrap-break-words overflow-hidden">
                                            {wo.scope_of_work.map((w, index) => (
                                                <span key={index}>{w},</span>
                                            ))}
                                        </TableCell>
                                        <TableCell className="text-center w-14">{wo.customer}</TableCell>
                                        <TableCell className="text-center">{wo.work_location}	</TableCell>
                                        <TableCell className="text-center">
                                            <div className="bg-white w-fit flex space-x-3 items-center mx-auto">
                                                <Link href={`/admin/work-order/edit/${wo.id}`}><MdEdit className="w-7 h-7" /></Link>
                                                <div><FaTrash className="w-5 h-5 text-red-500" onClick={() => handleDelete(wo.id)} /></div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
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