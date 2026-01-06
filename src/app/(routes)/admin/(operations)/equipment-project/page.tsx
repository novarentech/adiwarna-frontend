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

import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { useEffect, useState } from "react";
// Ganti import fungsi dan interface dari quotations ke equipment project
import { deleteEquipmentproject, getAllEquipmentproject } from "@/lib/equipment-project";
import { EquipmentProjectData } from "@/lib/equipment-project"; // Sesuaikan path interface Anda
import { ImWrench } from "react-icons/im";
import { toast } from "sonner";


export default function EquipmentProjectPage() {
    // Ganti tipe state dari GetAllQuotation[] menjadi EquipmentProjectData[]
    const [equipmentProjects, setEquipmentProjects] = useState<EquipmentProjectData[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        // Ganti fungsi API yang dipanggil
        const res = await getAllEquipmentproject(page, 15, search); // Menggunakan perPage default 15

        if (res.success) {
            // Ganti state yang diset
            setEquipmentProjects(res.data);
            setLastPage(res.meta.last_page);
        } else {
            console.error("Failed to fetch equipment projects:");
            // Anda bisa tambahkan alert atau notifikasi di sini
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchData();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this Equipment Project?")) return;

        // Ganti fungsi API delete
        const res = await deleteEquipmentproject(id);

        if (!res.success) {
            // alert("Failed to delete: " + res.message);
            toast.error("Failed to delete: " + res.message);
            return;
        }

        // alert("Equipment Project deleted successfully!");
        toast.success("Equipment Project deleted successfully!");
        fetchData();
    };

    // Fungsi helper untuk memformat tanggal YYYY-MM-DD ke DD Mon YYYY
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
        // Date akan mengasumsikan zona waktu lokal. Sesuaikan jika Anda ingin menampilkan dalam zona waktu tertentu.
        return new Date(dateString).toLocaleDateString('en-GB', options).replace(/ /g, ' ');
    };

    // Fungsi helper untuk mendapatkan nomor urut (No.)
    const getNo = (index: number) => {
        return (page - 1) * 15 + index + 1; // Asumsi per_page = 15
    }

    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                {/* Ganti Ikon dan Judul */}
                {/* Asumsi Anda memiliki ikon lain, jika tidak, gunakan ikon yang sama atau hapus tag Image */}
                <ImWrench className="text-black w-10 h-10" />
                <h1 className="text-3xl font-normal">Data Equipment Projects</h1>
            </div>

            {/* list equipment projects */}
            <div className="bg-white mt-12 shadow-md rounded-lg"> {/* Tambahkan shadow dan rounded untuk kesan modern */}
                <div className="py-3 px-4 flex justify-between border-b rounded-t-lg">
                    {/* create equipment project button */}
                    {/* Sesuaikan link ke halaman pembuatan equipment project */}
                    <Link href={"/admin/equipment-project/create"} className="bg-[#17A2B8] text-white px-2 h-10 flex justify-center items-center rounded-sm">
                        Add Project Data <FiPlus className="w-4 h-4 ml-1" />
                    </Link>
                    {/* search bar */}
                    <form onSubmit={handleSearch} className="flex flex-row">
                        <input value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            id="search-input"
                            type="text"
                            className="w-[200px] rounded-l-sm h-8 border my-auto px-2 placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-[#17A2B8]"
                            placeholder="Search Projects..." />
                        <button className="border-r border-t border-b h-8 w-8 my-auto flex rounded-r-sm bg-gray-50 hover:bg-gray-100" type="submit"><IoIosSearch className="w-5 m-auto text-gray-600" /></button>
                    </form>
                </div>
                <div className="py-2 px-4 border-b rounded-b-lg overflow-x-auto"> {/* Tambahkan overflow-x-auto */}
                    <Table className="min-w-full">
                        <TableHeader>
                            {/* Sesuaikan kolom tabel sesuai gambar */}
                            <TableRow className="bg-[#f2f2f2] hover:bg-[#f2f2f2]">
                                <TableHead className="text-[#212529] font-bold w-12 text-center">No.</TableHead>
                                <TableHead className="text-[#212529] font-bold w-32">Project Date</TableHead>
                                <TableHead className="text-[#212529] font-bold">Customer</TableHead>
                                <TableHead className="text-[#212529] font-bold">Location</TableHead>
                                <TableHead className="text-[#212529] font-bold w-32">Prepared By</TableHead>
                                <TableHead className="text-[#212529] font-bold w-32">Verified By</TableHead>
                                <TableHead className="text-[#212529] font-bold text-center w-24">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : equipmentProjects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10">
                                        No data found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                equipmentProjects.map((project, index) => (
                                    // Ganti key dari q.id ke project.id
                                    <TableRow key={project.id} className="even:bg-white odd:bg-[#fafafa] hover:bg-gray-50">
                                        <TableCell className="text-center font-medium">{getNo(index)}</TableCell>
                                        <TableCell className="py-6 text-sm">{(project.project_date)}</TableCell>
                                        <TableCell className="text-sm">{project.customer}</TableCell>
                                        <TableCell className="text-sm">{project.location}</TableCell>
                                        <TableCell className="text-sm">{project.prepared_by}</TableCell>
                                        <TableCell className="text-sm">{project.verified_by}</TableCell>
                                        <TableCell className="text-center">
                                            {/* Sesuaikan style action buttons agar mirip gambar */}
                                            <div className="w-fit flex space-x-1 items-center mx-auto">
                                                {/* Edit Button */}
                                                <Link href={`/admin/equipment-project/edit/${project.id}`} className="p-1 text-gray-600 hover:text-blue-600">
                                                    <MdEdit className="w-4 h-4" />
                                                </Link>
                                                {/* Delete Button */}
                                                <button onClick={() => handleDelete(project.id)} className="p-1 text-red-500 hover:text-red-700">
                                                    <FaTrash className="w-3.5 h-3.5" />
                                                </button>
                                                {/* View/Detail Button */}
                                                <Link href={`/admin/equipment-project/print/${project.id}`} className="p-1 text-[#31C6D4] hover:text-[#17A2B8] bg-blue-50/50 rounded-full">
                                                    <IoMdEye className="w-4 h-4" />
                                                </Link>
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