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
import { IoMdCart } from "react-icons/io";

export default function DailyActivityReportPage() {
    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <h1 className="text-3xl font-normal">Daily Activity</h1>
            </div>

            {/* list quotations */}
            <div className="bg-white mt-12">
                <div className="py-3 px-4 flex justify-between border rounded-t-sm">
                    {/* create quotations button */}
                    <Link href={"/admin/daily-activity-report/create"} className="bg-[#17A2B8] text-white px-2 h-10 flex justify-center items-center rounded-sm">Add Data <FiPlus className="w-5 h-5 ml-1" /> </Link>
                </div>
                <div className="py-5 px-4 flex justify-between border-b border-x rounded-b-sm">
                    <Table className="bg-[#f2f2f2]">
                        <TableHeader>
                            <TableRow className="bg-[#dadada] hover:bg-[#dadada]">
                                <TableHead className="text-[#212529] font-bold"><input type="checkbox" /></TableHead>
                                <TableHead className="text-[#212529] font-bold">Ref. AWP W.O. No.</TableHead>
                                <TableHead className="text-[#212529] font-bold">Service Contract No./ PO No.</TableHead>
                                <TableHead className="text-[#212529] font-bold">Customer</TableHead>
                                <TableHead className="text-[#212529] font-bold">Work Location</TableHead>
                                <TableHead className="text-[#212529] font-bold">Date</TableHead>
                                <TableHead className="text-[#212529] font-bold">Prepared By</TableHead>
                                <TableHead className="text-[#212529] font-bold text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>

                            <TableRow>
                                <TableCell className="font-medium"><input type="checkbox" /></TableCell>
                                <TableCell className="py-4"><p className="text-sm">576765/PO/AWP-INS/2077</p></TableCell>
                                <TableCell className="font-medium">order.orderId</TableCell>
                                <TableCell>	CIhuy</TableCell>
                                <TableCell>yahoo</TableCell>
                                <TableCell className="">10 November 2025</TableCell>
                                <TableCell className="">
                                    yahoo
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="bg-white w-fit flex space-x-3 items-center mx-auto">
                                        <Link href={"/admin/daily-activity-report/edit/1"}><MdEdit className="w-7 h-7" /></Link>
                                        <div><FaTrash className="w-5 h-5 text-red-500" /></div>
                                        <Link href={"/admin//daily-activity-report/print"}><IoMdEye className="w-7 h-7 text-[#31C6D4]" /></Link>
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