"use client";

import { MdEdit, MdWorkHistory } from "react-icons/md";


import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { ImWrench } from "react-icons/im";


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
import { FaCircle, FaTrash } from "react-icons/fa6";
import { useState } from "react";
import { IoMdEye } from "react-icons/io";
// import { IoMdEye } from "react-icons/io";


export default function DataEquipmentGeneral() {

    const columnList = {
        no: "No",
        deskripsi: "Deskripsi",
        merkType: "Merk/Type",
        serialNumber: "Serial Number",
        durasi: "Durasi",
        tanggalKalibrasi: "Tanggal Kalibrasi",
        tanggalExpired: "Tanggal Expired",
        lembagaKalibrasi: "Lembaga Kalibrasi",
        kondisi: "Kondisi",
        action: "Action",
    };


    const [columns, setColumns] = useState(
        Object.fromEntries(Object.keys(columnList).map((key) => [key, true]))
    );

    const [openDropdown, setOpenDropdown] = useState(false);
    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9] border">
            {/* title container */}
            <div className="flex flex-row items-center space-x-3 mt-2">
                <ImWrench className="text-black w-10 h-10" />
                <h1 className="text-3xl font-normal">Data Equipment General</h1>
            </div>

            {/* list track record */}
            <div className="bg-white mt-12">
                <div className="py-3 px-4 flex justify-between border rounded-t-sm">
                    <Link href={"/admin/equipment-general/create"} className="bg-[#17A2B8] text-white px-2 h-10 flex justify-center items-center rounded-sm">Add Equipment Data <FiPlus className="w-5 h-5 ml-1" /> </Link>
                </div>
                {/* ini untuk nampilin berapa */}
                <div className="flex justify-between py-3 px-4 border-x">
                    <form className="flex flex-row space-x-2 items-center">
                        <p>show</p>
                        <select name="" id="" className="w-14 h-8 border rounded-sm">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <p>entries</p>
                    </form>

                    <form className="flex flex-row space-x-2 items-center">
                        <label htmlFor="search">Search :</label>
                        <input type="text" className="flex bg-white border rounded-sm h-9 px-2" />
                    </form>
                </div>

                {/* start of copy, csv,, excel, pdf, print, column visibility*/}
                <div className="w-2/6 flex pl-4 border-x">
                    <div className="bg-[#6c757d] w-full h-[38px] rounded-sm flex flex-row items-center text-white">
                        <button className="flex-1 h-full hover:brightness-125 bg-[#6c757d] rounded-l-sm">Copy</button>
                        <button className="flex-1 h-full hover:brightness-125 bg-[#6c757d]">CSV</button>
                        <button className="flex-1 h-full hover:brightness-125 bg-[#6c757d]">Excel</button>
                        <button className="flex-1 h-full hover:brightness-125 bg-[#6c757d]">PDF</button>
                        <button className="flex-1 h-full hover:brightness-125 bg-[#6c757d] rounded-r-sm">Print</button>
                        <div className="relative">
                            <button
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
                                                checked={columns[key]}
                                                onChange={() =>
                                                    setColumns({ ...columns, [key]: !columns[key] })
                                                }
                                            />
                                            <span>{label}</span>
                                        </label>
                                    ))}

                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="py-5 px-4 flex justify-between border-x">
                    <Table className="bg-[#f2f2f2] z-10">
                        <TableHeader>
                            <TableRow className="bg-[#dadada] hover:bg-[#dadada]">
                                <TableHead className="text-[#212529] font-bold py-6"><input type="checkbox" /></TableHead>
                                {columns.no && (
                                    <TableHead className="text-[#212529] font-bold text-center">No</TableHead>
                                )}
                                {columns.deskripsi && (
                                    <TableHead className="text-[#212529] font-bold text-center">Deskripsi</TableHead>
                                )}
                                {columns.merkType && (
                                    <TableHead className="text-[#212529] font-bold text-center">Merk/Type</TableHead>
                                )}
                                {columns.serialNumber && (
                                    <TableHead className="text-[#212529] font-bold text-center">Serial Number</TableHead>
                                )}
                                {columns.durasi && (
                                    <TableHead className="text-[#212529] font-bold text-center">Durasi</TableHead>
                                )}
                                {columns.tanggalKalibrasi && (
                                    <TableHead className="text-[#212529] font-bold text-center">Tanggal Kalibrasi</TableHead>
                                )}
                                {columns.tanggalExpired && (
                                    <TableHead className="text-[#212529] font-bold text-center">Tanggal Expired</TableHead>
                                )}
                                {columns.lembagaKalibrasi && (
                                    <TableHead className="text-[#212529] font-bold text-center">Lembaga Kalibrasi</TableHead>
                                )}
                                {columns.kondisi && (
                                    <TableHead className="text-[#212529] font-bold text-center">Kondisi</TableHead>
                                )}
                                {columns.action && (
                                    <TableHead className="text-[#212529] font-bold text-center">Action</TableHead>
                                )}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {/* list of equipment data */}
                            <TableRow>
                                <TableCell className="font-medium"><input type="checkbox" /></TableCell>
                                {columns.no && (
                                    <TableCell className="py-4"><p className="text-sm">1</p></TableCell>
                                )}
                                {columns.deskripsi && (
                                    <TableCell className="text-center">Profile Gauge</TableCell>
                                )}
                                {columns.merkType && (
                                    <TableCell className="text-center">Gagemaker - TPRTC8R TC3</TableCell>
                                )}
                                {columns.serialNumber && (
                                    <TableCell className="text-center">K06649 TC3-5</TableCell>
                                )}
                                {columns.durasi && (
                                    <TableCell className="text-center">12 Months</TableCell>
                                )}
                                {columns.tanggalKalibrasi && (
                                    <TableCell className="text-center">13 Jan 2025</TableCell>
                                )}
                                {columns.tanggalExpired && (
                                    <TableCell className="text-center">13 Jan 2026</TableCell>
                                )}
                                {columns.lembagaKalibrasi && (
                                    <TableCell className="text-center">External</TableCell>
                                )}
                                {columns.kondisi && (
                                    <TableCell className="text-center"><span className="bg-green-500 text-white">OK (Fit for Use)</span></TableCell>
                                )}
                                {columns.action && (
                                    <TableCell className="text-center">
                                        <div className="bg-white w-fit flex space-x-3 items-center mx-auto">
                                            <Link href={"/admin/equipment-general/edit/1"}><MdEdit className="w-7 h-7" /></Link>
                                            <div><FaTrash className="w-5 h-5 text-red-500" /></div>
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableBody>

                    </Table>
                </div>
                <div className="flex justify-between border-b border-x rounded-b-sm py-3 px-4">
                    {/* nampilin jumlah list yang diperlihatkan */}
                    <div>Showing 1 to 1 of 1 entries</div>
                    <div className="border flex flex-row h-9 items-center">
                        {/* button previous pagination */}
                        <div className="bg-blue-500 h-full flex justify-center items-center">
                            Previous
                        </div>
                        {/* page pagination */}
                        <div className="w-10 flex justify-center items-center">
                            1
                        </div>
                        {/* button next pagination */}
                        <div className="bg-blue-500 h-full flex justify-center items-center">
                            Next
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}