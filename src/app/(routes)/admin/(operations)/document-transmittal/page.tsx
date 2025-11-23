"use client";
import { MdDocumentScanner } from "react-icons/md";

import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { IoIosSearch, IoMdCart } from "react-icons/io";
import { MdAssignment } from "react-icons/md";


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

export default function DocumentTransmittalPage() {
    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <MdDocumentScanner className="text-black w-10 h-10" />
                <h1 className="text-3xl font-normal">Document Transmittal  </h1>
            </div>

            {/* list quotations */}
            <div className="bg-white mt-12">
                <div className="py-3 px-4 flex justify-between border rounded-t-sm">
                    {/* create quotations button */}
                    <Link href={"/admin/document-transmittal/create"} className="bg-[#17A2B8] text-white px-2 h-10 flex justify-center items-center rounded-sm">Add Document Transmittal<FiPlus className="w-5 h-5 ml-1" /> </Link>
                    {/* search bar */}
                    <form className="flex flex-row">
                        <input id="search-input" type="text" className="w-[250px] rounded-l-sm h-8 border my-auto px-2 placeholder:text-sm" placeholder="Search Document Transmittal .." />
                        <button className="border-r border-t border-b h-8 w-8 my-auto flex rounded-r-sm" type="submit"><IoIosSearch className="w-5 m-auto" /></button>
                    </form>
                </div>
                <div className="py-5 px-4 flex justify-between border-b border-x rounded-b-sm">
                    <Table className="bg-[#f2f2f2]">
                        <TableHeader>
                            <TableRow className="bg-[#dadada] hover:bg-[#dadada]">
                                <TableHead className="text-[#212529] font-bold"><input type="checkbox" /></TableHead>
                                <TableHead className="text-[#212529] font-bold">TA No.</TableHead>
                                <TableHead className="text-[#212529] font-bold">Date</TableHead>
                                <TableHead className="text-[#212529] font-bold">Customer</TableHead>
                                <TableHead className="text-[#212529] font-bold text-center">PIC</TableHead>
                                <TableHead className="text-[#212529] font-bold text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* list documenet transmittal */}
                            <TableRow>
                                <TableCell className="font-medium"><input type="checkbox" /></TableCell>
                                <TableCell className="py-4"><p className="text-sm">	000/vi/2025</p></TableCell>
                                <TableCell>	21 November 2025</TableCell>
                                <TableCell>PT. MHI</TableCell>
                                <TableCell className="text-center">MHI Workshop - Daan Mogot</TableCell>
                                <TableCell className="text-center">
                                    <div className="bg-white w-fit flex space-x-3 items-center mx-auto">
                                        <Link href={"/admin/document-transmittal/edit/1"}><MdEdit className="w-7 h-7" /></Link>
                                        <div><FaTrash className="w-5 h-5 text-red-500" /></div>
                                        <Link href={"/admin/document-transmittal/print"}><IoMdEye className="w-7 h-7 text-[#31C6D4]" /></Link>
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