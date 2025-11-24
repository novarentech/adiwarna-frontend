"use client";

import Link from "next/link";
import { FiPlus } from "react-icons/fi";
// import { IoIosSearch } from "react-icons/io";

import { MdSupervisorAccount } from "react-icons/md";



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

export default function AccountsPage() {
    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <MdSupervisorAccount className="text-black w-10 h-10" />
                <h1 className="text-3xl font-normal">Accounts</h1>
            </div>

            {/* list quotations */}
            <div className="bg-white mt-12">
                <div className="py-3 px-4 flex justify-between border rounded-t-sm">
                    {/* create quotations button */}
                    <Link href={"/admin/accounts/create"} className="bg-[#17A2B8] text-white px-2 h-10 flex justify-center items-center rounded-sm">Add Data <FiPlus className="w-5 h-5 ml-1" /> </Link>
                    {/* search bar */}
                    {/* <form className="flex flex-row">
                        <input id="search-input" type="text" className="w-[250px] rounded-l-sm h-8 border my-auto px-2 placeholder:text-sm" placeholder="Search customer .." />
                        <button className="border-r border-t border-b h-8 w-8 my-auto flex rounded-r-sm" type="submit"><IoIosSearch className="w-5 m-auto" /></button>
                    </form> */}
                </div>
                <div className="py-5 px-4 flex justify-between border-b border-x rounded-b-sm">
                    <Table className="bg-[#f2f2f2]">
                        <TableHeader>
                            <TableRow className="bg-[#dadada] hover:bg-[#dadada]">
                                <TableHead className="text-[#212529] w-[5%] font-bol text-center"><input type="checkbox" /></TableHead>
                                <TableHead className="text-[#212529] w-[20%] font-bold text-left">Name</TableHead>
                                <TableHead className="text-[#212529] w-[10%] font-bold text-center">Phone number</TableHead>
                                <TableHead className="text-[#212529] w-[20%] font-bold text-center">Role</TableHead>
                                <TableHead className="text-[#212529] w-[30%] font-bold text-left">Email</TableHead>
                                <TableHead className="text-[#212529] w-[15%] font-bold text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>

                            {/* list account */}
                            <TableRow>
                                <TableCell className="font-medium text-center py-6"><input type="checkbox" /></TableCell>
                                {/* nama akun */}
                                <TableCell className="font-medium text-left whitespace-normal wrap-break-words overflow-hidden">
                                    <p className="my-auto">nama employee</p>
                                </TableCell>
                                {/* phone number */}
                                <TableCell className="text-center whitespace-normal wrap-break-words overflow-hidden">+628xxxxxxx</TableCell>
                                <TableCell className="text-center whitespace-normal wrap-break-words overflow-hidden">Admin</TableCell>
                                <TableCell className="text-left whitespace-normal wrap-break-words overflow-hidden">email@mail.com</TableCell>
                                <TableCell className="text-center">
                                    <div className="bg-white w-fit flex space-x-3 items-center mx-auto">
                                        <Link href={"/admin/accounts/edit/1"}><MdEdit className="w-7 h-7" /></Link>
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