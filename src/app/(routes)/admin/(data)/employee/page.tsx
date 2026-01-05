"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { FaAddressCard } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteEmployee, Employee, getEmployees } from "@/lib/employee";
import { toast } from "sonner";


export default function EmployeePage() {
    const [data, setData] = useState<Employee[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        const res = await getEmployees(page, search);

        if (res.success) {
            setData(res.data.data);
            setLastPage(res.meta.last_page);
        }
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
        if (!confirm("Are you sure you want to delete this Employee?")) return;

        const res = await deleteEmployee(id);

        if (!res.success) {
            // alert("Failed to delete: " + res.message);
            toast.error("Failed to delete: " + res.message);
            return;
        }

        // alert("Employee deleted successfully!");
        toast.success("Employee deleted successfully!");
        fetchData();
    };


    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <FaAddressCard className="text-black w-10 h-10" />
                <h1 className="text-3xl font-normal">Data Employee</h1>
            </div>

            {/* list */}
            <div className="bg-white mt-12">
                <div className="py-3 px-4 flex justify-between border rounded-t-sm">
                    <Link
                        href={"/admin/employee/create"}
                        className="bg-[#17A2B8] text-white px-2 h-10 flex justify-center items-center rounded-sm"
                    >
                        Add Employee <FiPlus className="w-5 h-5 ml-1" />
                    </Link>

                    <form onSubmit={handleSearch} className="flex flex-row">
                        <input
                            type="text"
                            className="w-[250px] rounded-l-sm h-8 border px-2 placeholder:text-sm"
                            placeholder="Search employee.."
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="border h-8 w-8 flex rounded-r-sm" type="submit">
                            <IoIosSearch className="w-5 m-auto" />
                        </button>
                    </form>
                </div>

                <div className="py-5 px-4 border-b border-x rounded-b-sm">
                    <Table className="bg-[#f2f2f2]">
                        <TableHeader>
                            <TableRow className="bg-[#dadada] hover:bg-[#dadada]">
                                <TableHead className="text-center"><input type="checkbox" /></TableHead>
                                <TableHead className="text-center font-bold">No</TableHead>
                                <TableHead className="text-center font-bold">Name</TableHead>
                                <TableHead className="text-center font-bold">Position</TableHead>
                                <TableHead className="text-center font-bold">Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {data.map((emp, i) => (
                                <TableRow key={emp.id}>
                                    <TableCell className="text-center"><input type="checkbox" /></TableCell>
                                    {/* <TableCell className="text-center">{i + 1 + (page - 1) * 15}</TableCell> */}
                                    <TableCell className="text-center">{emp.employee_no}</TableCell>
                                    <TableCell className="text-center">{emp.name}</TableCell>
                                    <TableCell className="text-center">{emp.position}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex space-x-3 justify-center">
                                            <Link href={`/admin/employee/edit/${emp.id}`}>
                                                <MdEdit className="w-7 h-7" />
                                            </Link>
                                            <FaTrash className="w-5 h-5 text-red-500 cursor-pointer" onClick={() => handleDelete(emp.id)} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* PAGINATION */}
                    <div className="flex justify-center items-center space-x-2 mt-4">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                            className="px-3 py-1 border disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <p>Page {page} / {lastPage}</p>

                        <button
                            disabled={page >= lastPage}
                            onClick={() => setPage(page + 1)}
                            className="px-3 py-1 border disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
