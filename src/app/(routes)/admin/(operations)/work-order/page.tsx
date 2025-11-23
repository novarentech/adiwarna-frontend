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
import { IoMdEye } from "react-icons/io";


export default function WorkOrderPage() {
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
                    {/* search bar
                    <form className="flex flex-row">
                        <input id="search-input" type="text" className="w-[250px] rounded-l-sm h-8 border my-auto px-2 placeholder:text-sm" placeholder="Search Work Order .." />
                        <button className="border-r border-t border-b h-8 w-8 my-auto flex rounded-r-sm" type="submit"><IoIosSearch className="w-5 m-auto" /></button>
                    </form> */}
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
                        <TableBody>
                            {/* list work order */}
                            <TableRow>
                                <TableCell className="font-medium"><input type="checkbox" /></TableCell>
                                <TableCell className="py-4"><p className="text-sm">1234/AWP-INS/JKT/2025</p></TableCell>
                                <TableCell className="text-center">	08 November 2025</TableCell>
                                {/* ini worker name */}
                                <TableCell className="text-center whitespace-normal wrap-break-words overflow-hidden">andwjhoia, andwjhoia</TableCell>
                                <TableCell className="text-left max-w-[500px] whitespace-normal wrap-break-words overflow-hidden">MPI, Penetrant Test, UT Wall Thickness Spot Check, Load Test, Lifting Gear Inspection, Treating Iron Inspection, Offshore Container Inspection, PRV Testing, Witness Leak Test, Sling and Shackle Inspection, Hardness Test, Spreader Bar Inspection</TableCell>
                                <TableCell className="text-center w-14">CV ANUGRAH</TableCell>
                                <TableCell className="text-center">LJK Marunda	</TableCell>
                                <TableCell className="text-center">
                                    <div className="bg-white w-fit flex space-x-3 items-center mx-auto">
                                        <Link href={"/admin/work-order/edit/1"}><MdEdit className="w-7 h-7" /></Link>
                                        <div><FaTrash className="w-5 h-5 text-red-500" /></div>
                                    </div>
                                </TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>
                </div>
            </div>
        </div >
    )
}