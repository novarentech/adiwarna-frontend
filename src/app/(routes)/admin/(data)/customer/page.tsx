"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IoIosSearch } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import { FaUser } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
// import { IoMdEye } from "react-icons/io";


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Customer, CustomerLocation, deleteCustomer, getCustomers } from "@/lib/customer";
import { toast } from "sonner";

export default function CustomerPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });

    const fetchData = async (query: string = "", pageNum: number = 1) => {
        const res = await getCustomers(query, pageNum);

        if (res.success) {
            setCustomers(res.data);
            setMeta(res.meta);
        }
    };

    useEffect(() => {
        fetchData(search, page);
    }, [page]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);       // reset ke page 1 saat search
        fetchData(search, 1);
    };


    const handleDelete = async (id: number) => {
        const confirmDelete = confirm("Are you sure you want to delete this customer?");
        if (!confirmDelete) return;

        const res = await deleteCustomer(id);

        if (!res.success) {
            // alert("Failed to delete: " + res.message);
            toast.error("Failed to delete: " + res.message);
            return;
        }

        // alert("Customer deleted successfully!");
        toast.success("Customer deleted successfully!");

        // reload data
        fetchData(search, page);
    };

    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">

            {/* title */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <FaUser className="text-black w-10 h-10" />
                <h1 className="text-3xl font-normal">Customer</h1>
            </div>

            <div className="bg-white mt-12">
                <div className="py-3 px-4 flex justify-between border rounded-t-sm">

                    <Link
                        href={"/admin/customer/create"}
                        className="bg-[#17A2B8] text-white px-2 h-10 flex justify-center items-center rounded-sm"
                    >
                        Add Customer Data <FiPlus className="w-5 h-5 ml-1" />
                    </Link>

                    {/* search bar */}
                    <form className="flex flex-row" onSubmit={handleSearch}>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-[250px] rounded-l-sm h-8 border my-auto px-2 placeholder:text-sm"
                            placeholder="Search customer .."
                        />
                        <button
                            className="border-r border-t border-b h-8 w-8 my-auto flex rounded-r-sm"
                            type="submit"
                        >
                            <IoIosSearch className="w-5 m-auto" />
                        </button>
                    </form>
                </div>

                {/* table */}
                <div className="py-5 px-4 border-b border-x rounded-b-sm">
                    <Table className="bg-[#f2f2f2]">
                        <TableHeader>
                            <TableRow className="bg-[#dadada] hover:bg-[#dadada]">
                                <TableHead className="text-center"><input type="checkbox" /></TableHead>
                                <TableHead className="text-center font-bold">No</TableHead>
                                <TableHead className="text-center font-bold">Customer Info</TableHead>
                                <TableHead className="text-center font-bold">Work Location</TableHead>
                                <TableHead className="text-center font-bold">Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {customers.map((c, index) => (
                                <TableRow key={c.id}>
                                    <TableCell className="text-center">
                                        <input type="checkbox" />
                                    </TableCell>

                                    <TableCell className="text-center">
                                        {/* {(page - 1) * 15 + (index + 1)} */}
                                        {c.customer_no}
                                    </TableCell>

                                    <TableCell className="text-left whitespace-normal wrap-break-words">
                                        <p className="font-bold">{c.name}</p>
                                        <p>{c.phone_number}</p>
                                        <p>{c.address}</p>
                                    </TableCell>

                                    <TableCell className="text-center whitespace-normal wrap-break-words">
                                        <ul>
                                            {c.customer_locations.map((loc: CustomerLocation) => (
                                                <li key={loc.id}>{loc.location_name}</li>
                                            ))}
                                        </ul>
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <div className="bg-white w-fit flex space-x-3 items-center mx-auto">
                                            <Link href={`/admin/customer/edit/${c.id}`}>
                                                <MdEdit className="w-7 h-7" />
                                            </Link>
                                            <div>
                                                <FaTrash className="w-5 h-5 text-red-500 cursor-pointer" onClick={() => handleDelete(c.id)} />
                                            </div>
                                        </div>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* pagination */}
                    <div className="flex justify-center items-center space-x-3 mt-4">

                        {/* Prev */}
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-40"
                        >
                            Prev
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(num => (
                            <button
                                key={num}
                                onClick={() => setPage(num)}
                                className={`px-3 py-1 rounded 
                                    ${num === page ? "bg-blue-500 text-white" : "bg-gray-200"}
                                `}
                            >
                                {num}
                            </button>
                        ))}

                        {/* Next */}
                        <button
                            disabled={page >= meta.last_page}
                            onClick={() => setPage(page + 1)}
                            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-40"
                        >
                            Next
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
}
