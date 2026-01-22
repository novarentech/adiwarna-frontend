"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IoIosSearch } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import { FaUser } from "react-icons/fa6";
// import { MdEdit } from "react-icons/md";
// import { FaTrash } from "react-icons/fa";
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
import { LiaEdit } from "react-icons/lia";
import { RiDeleteBinLine } from "react-icons/ri";

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
                        className="bg-[#31C6D4] text-white px-2 h-10 flex justify-center items-center rounded-sm"
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
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB] border-black">
                                <TableHead className="border-black border text-center"><input type="checkbox" /></TableHead>
                                <TableHead className="border-black border text-center font-bold">No</TableHead>
                                <TableHead className="border-black border text-center font-bold max-w-[200px]">Customer Info</TableHead>
                                <TableHead className="border-black border text-center font-bold max-w-[300px]">Work Location</TableHead>
                                <TableHead className="border-black border text-center font-bold">Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {customers.map((c, index) => (
                                <TableRow key={c.id} className="hover:bg-gray-50 border-black">
                                    <TableCell className="text-center border-black border">
                                        <input type="checkbox" />
                                    </TableCell>

                                    <TableCell className="text-center border-black border">
                                        {/* {(page - 1) * 15 + (index + 1)} */}
                                        {c.customer_no}
                                    </TableCell>

                                    <TableCell className="text-left whitespace-normal wrap-break-words border-black border max-w-[300px]">
                                        <p className="font-bold">{c.name}</p>
                                        <p>{c.phone_number}</p>
                                        <p>{c.address}</p>
                                    </TableCell>

                                    <TableCell className="p-0 align-top border-x border-black border">
                                        <div className="divide-y divide-black">
                                            {c.customer_locations.map((loc: CustomerLocation) => (
                                                <div
                                                    key={loc.id}
                                                    className="px-3 py-2 text-left wrap-break-words"
                                                >
                                                    {loc.location_name}
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-center border-black border   ">
                                        <div className="bg-white w-fit flex space-x-3 items-center mx-auto">
                                            <Link href={`/admin/customer/edit/${c.id}`}>
                                                {/* <MdEdit className="w-7 h-7" /> */}
                                                <LiaEdit className="w-6 h-6 text-[#00A63E] hover:opacity-70" />
                                            </Link>
                                            <div onClick={() => handleDelete(c.id)}>
                                                {/* <FaTrash className="w-5 h-5 text-red-500 cursor-pointer" onClick={() => handleDelete(c.id)} /> */}
                                                <RiDeleteBinLine className="w-5 h-5 text-[#E7000B] hover:opacity-70" />
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
