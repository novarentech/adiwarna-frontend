"use client";

import Image from "next/image";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";

import { FaUser } from "react-icons/fa6";

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
import { IoMdCart } from "react-icons/io";

export default function CustomerPage() {
    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <FaUser className="text-black w-10 h-10" />
                <h1 className="text-3xl font-normal">Customer</h1>
            </div>

            {/* list quotations */}
            <div className="bg-white mt-12">
                <div className="py-3 px-4 flex justify-between border rounded-t-sm">
                    {/* create quotations button */}
                    <Link href={"/admin/customer/create"} className="bg-[#17A2B8] text-white px-2 h-10 flex justify-center items-center rounded-sm">Add Customer Data <FiPlus className="w-5 h-5 ml-1" /> </Link>
                    {/* search bar */}
                    <form className="flex flex-row">
                        <input id="search-input" type="text" className="w-[250px] rounded-l-sm h-8 border my-auto px-2 placeholder:text-sm" placeholder="Search customer .." />
                        <button className="border-r border-t border-b h-8 w-8 my-auto flex rounded-r-sm" type="submit"><IoIosSearch className="w-5 m-auto" /></button>
                    </form>
                </div>
                <div className="py-5 px-4 flex justify-between border-b border-x rounded-b-sm">
                    <Table className="bg-[#f2f2f2]">
                        <TableHeader>
                            <TableRow className="bg-[#dadada] hover:bg-[#dadada]">
                                <TableHead className="text-[#212529] font-bol text-center"><input type="checkbox" /></TableHead>
                                <TableHead className="text-[#212529] w-[31px] font-bold text-center">No</TableHead>
                                <TableHead className="text-[#212529] w-[700px] font-bold text-center">Customer Info</TableHead>
                                <TableHead className="text-[#212529] w-[500px]font-bold text-center">Work Location</TableHead>
                                <TableHead className="text-[#212529] font-bold text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>

                            <TableRow>
                                <TableCell className="font-medium text-center"><input type="checkbox" /></TableCell>
                                <TableCell className="py-4"><p className="text-sm">1</p></TableCell>
                                {/* customer info */}
                                <TableCell className="font-medium text-center flex flex-col max-w-[700px] whitespace-normal wrap-break-words overflow-hidden">
                                    {/* name */}
                                    <p className="font-bold">PT. Advance Offshore Services</p>
                                    {/* phone number */}
                                    <p className="font-normal">082122166261</p>
                                    {/* office */}
                                    <p className="font-normal">Ventura Building Lantai 6 Suite 601 - JL. RA Kartini Np.26 Jakarta</p>
                                </TableCell>
                                {/* work location */}
                                <TableCell className="text-center w-[500px] bg-red-50 whitespace-normal wrap-break-words overflow-hidden">	
                                    <ul>
                                        <li>cihuy</li>
                                    </ul>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="bg-white w-fit flex space-x-3 items-center mx-auto">
                                        <Link href={"/admin/customer/edit/1"}><MdEdit className="w-7 h-7" /></Link>
                                        <div><FaTrash className="w-5 h-5 text-red-500" /></div>
                                        <Link href={"/admin/customer/print"}><IoMdEye className="w-7 h-7 text-[#31C6D4]" /></Link>
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