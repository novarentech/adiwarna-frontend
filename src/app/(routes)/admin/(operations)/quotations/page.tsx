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



export default function QuotationsPage() {
    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <Image src={"/icons/icon-quotations-black.svg"} className="text-black" alt="icon quotations" width={40} height={40} />
                <h1 className="text-3xl font-normal">Quotations  </h1>
            </div>

            {/* list quotations */}
            <div className="bg-white mt-12">
                <div className="py-3 px-4 flex justify-between border rounded-t-sm">
                    {/* create quotations button */}
                    <Link href={"/admin/quotations/create"} className="bg-[#17A2B8] text-white px-2 h-10 flex justify-center items-center rounded-sm">Add Data <FiPlus className="w-5 h-5 ml-1" /> </Link>
                    {/* search bar */}
                    <form className="flex flex-row">
                        <input id="search-input" type="text" className="w-[200px] rounded-l-sm h-8 border my-auto px-2 placeholder:text-sm" placeholder="Search Quotations..." />
                        <button className="border-r border-t border-b h-8 w-8 my-auto flex rounded-r-sm" type="submit"><IoIosSearch className="w-5 m-auto" /></button>
                    </form>
                </div>
                <div className="py-5 px-4 flex justify-between border-b border-x rounded-b-sm">
                    <Table className="bg-[#f2f2f2]">
                        <TableHeader>
                            <TableRow className="bg-[#dadada] hover:bg-[#dadada]">
                                <TableHead className="text-[#212529] font-bold"><input type="checkbox" /></TableHead>
                                <TableHead className="text-[#212529] font-bold">Product</TableHead>
                                <TableHead className="text-[#212529] font-bold">Ref</TableHead>
                                <TableHead className="text-[#212529] font-bold">Date</TableHead>
                                <TableHead className="text-[#212529] font-bold">Customer</TableHead>
                                <TableHead className="text-[#212529] font-bold">PIC</TableHead>
                                <TableHead className="text-[#212529] font-bold">Subject</TableHead>
                                <TableHead className="text-[#212529] font-bold text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>

                            <TableRow>
                                <TableCell className="font-medium"><input type="checkbox" /></TableCell>
                                <TableCell className="py-4"><p className="text-sm">order.product</p></TableCell>
                                <TableCell className="font-medium">order.orderId</TableCell>
                                <TableCell>order.date</TableCell>
                                <TableCell>order.customerName</TableCell>
                                <TableCell className="">order.status</TableCell>
                                <TableCell className="">
                                    order.amount
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="bg-white w-fit flex space-x-3 items-center mx-auto">
                                        <Link href={"/admin/quotations/edit/1"}><MdEdit className="w-7 h-7" /></Link>
                                        <div><FaTrash className="w-5 h-5 text-red-500" /></div>
                                        <Link href={"/admin//quotations/print"}><IoMdEye className="w-7 h-7 text-[#31C6D4]" /></Link>
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