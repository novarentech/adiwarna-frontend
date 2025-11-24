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
import { FaCircle } from "react-icons/fa6";
import { useState } from "react";
// import { IoMdEye } from "react-icons/io";


export default function TrackRecordPage() {

    const columnList = {
        noWorkOrder: "No. Work Order",
        dateStarted: "Date Started",
        workerName: "Worker's Name",
        scopeOfWork: "Scope of Work",
        customer: "Customer",
        workLocation: "Work Location",
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
                <FaCircle className="text-black w-7 h-7" />
                <h1 className="text-3xl font-normal">Track Record  </h1>
            </div>

            {/* start Filter tanggal */}
            <div className="w-2/3 grid grid-cols-[3fr_3fr_0.1fr] mt-12 space-x-4">
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col space-y-1">
                        {/* Tanggal Awal: */}
                        <label htmlFor="tanggal-awal-filter" className="font-bold">Tanggal Awal:</label>
                        <div className="flex items-center">
                            <input type="date" id="tanggal-awal-filter" className="flex-1 bg-white border rounded-sm h-9 px-2" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col space-y-4">
                    {/* Tanggal Akhir: */}
                    <div className="flex flex-col space-y-1">
                        {/* terms of payment */}
                        <label htmlFor="tanggal-akhir-filter" className="font-bold">Tanggal Akhir:</label>
                        <div className="flex items-center">
                            <input type="date" id="tanggal-akhir-filter" className="flex-1 bg-white border rounded-sm h-9 px-2" placeholder="50" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col space-y-4 mt-auto">
                    <div className="flex items-center">
                        <button type="submit" id="apply-filter-date" className="flex-1 border rounded-sm h-9 px-2 bg-blue-500 text-white cursor-pointer">Filter</button>
                    </div>
                </div>
            </div>
            {/* end Filter tanggal */}

            {/* list track record */}
            <div className="bg-white mt-2">
                <div className="py-3 px-4 flex justify-between border rounded-t-sm">
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
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* list work order */}
                            <TableRow>
                                <TableCell className="font-medium"><input type="checkbox" /></TableCell>
                                {columns.noWorkOrder && (
                                    <TableCell className="py-4"><p className="text-sm">1234/AWP-INS/JKT/2025</p></TableCell>
                                )}
                                {columns.dateStarted && (
                                    <TableCell className="text-center">	08 November 2025</TableCell>
                                )}
                                {/* ini worker name */}
                                {columns.workerName && (
                                    <TableCell className="text-center whitespace-normal wrap-break-words overflow-hidden">andwjhoia, andwjhoia</TableCell>
                                )}
                                {columns.scopeOfWork && (
                                    <TableCell className="text-left w-[500px] whitespace-normal wrap-break-words overflow-hidden">MPI, Penetrant Test, UT Wall Thickness Spot Check, Load Test, Lifting Gear Inspection, Treating Iron Inspection, Offshore Container Inspection, PRV Testing, Witness Leak Test, Sling and Shackle Inspection, Hardness Test, Spreader Bar Inspection</TableCell>
                                )}
                                {columns.customer && (
                                    <TableCell className="text-center w-14">CV ANUGRAH</TableCell>
                                )}
                                {columns.workLocation && (
                                    <TableCell className="text-center">LJK Marunda	</TableCell>
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