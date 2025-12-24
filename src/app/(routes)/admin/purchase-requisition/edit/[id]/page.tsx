"use client";

import { FiPlus } from "react-icons/fi";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { RiDeleteBinLine } from "react-icons/ri";
import Link from "next/link";
import { use } from "react";

export default function EditPurchaseRequisitionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    return (
        <div className="w-full h-fit px-16 pt-4 pb-16 bg-[#f4f6f9]">
            <h1 className="text-4xl mt-8">Edit Purchase Requisition : {id}</h1>
            {/* form container */}
            <div className="bg-white mt-6 w-full h-fit rounded-[10px] p-6">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <p className="text-xl">PT. ADIWARNA PRATAMA</p>
                        <div className="flex flex-col text-[#4A5565]">
                            <p>PURCHASE REQUISITION</p>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm text-[#4A5565]">Doc. No:</p>
                        <p className="text-sm">M-PU-1-04</p>

                    </div>
                </div>


                <hr className="border-b border-[#e6e6e6] my-6" />

                <form action="" className="flex flex-col w-full h-fit">
                    <div className="w-full grid grid-cols-2 gap-x-8">
                        {/* left side */}
                        <div className="space-y-4">
                            <div className="flex flex-row space-x-4">
                                <div className="flex-1 flex flex-col space-y-4">
                                    <label htmlFor="prnumber" className="text-sm">P.R. No.</label>
                                    <input id="prnumber" type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="037/PU/AWP/01/2018" />
                                </div>
                                <div className="flex-1 flex flex-col space-y-4">
                                    <label htmlFor="revno" className="text-sm">Rev. No./Date</label>
                                    <input id="revno" type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="01/02.01.2018" />
                                </div>
                            </div>
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="reqdev" className="text-sm">Required Delivery</label>
                                <input id="reqdev" type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" />
                            </div>
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="pod" className="text-sm">Place of Delivery</label>
                                <input id="pod" type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="AWP HO" />
                            </div>
                        </div>
                        {/* right side */}
                        <div className="space-y-4">
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="ponumber" className="text-sm">P.O. No. / Cash</label>
                                <input id="ponumber" type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="Fill in -> Null" />
                            </div>
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="supplier" className="text-sm">Supplier</label>
                                <input id="supplier" type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="online" />
                            </div>
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="routing" className="text-sm">Routing / Offline</label>
                                <input id="routing" type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" />
                            </div>
                        </div>
                    </div>


                    {/* item list (nanti bisa add item) */}
                    <div className="flex flex-col mt-6">
                        <div className="w-full flex flex-row justify-between">
                            <h1>Items Details</h1>
                            {/* button nambah item */}
                            <button className=" bg-[#31C6D4] text-white px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75">
                                <FiPlus className="w-5 h-5 mr-1" /> Add Item
                            </button>
                        </div>
                        {/* list input mengisi item */}
                        <div className="mt-4 border overflow-hidden rounded-xl">
                            <Table>
                                <TableHeader className="bg-[#F9FAFB]">
                                    <TableRow>
                                        <TableHead className="w-1/12 pl-10">No</TableHead>
                                        <TableHead className="w-1/12 font-bold">Qty</TableHead>
                                        <TableHead className="w-1/12 font-bold">Unit</TableHead>
                                        <TableHead className="w-2/6 font-bold">Description</TableHead>
                                        <TableHead className="w-1/6 font-bold">Unit Price</TableHead>
                                        <TableHead className="w-1/6 font-bold">Total Price</TableHead>
                                        <TableHead className="font-bold text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="py-6 pl-10">1</TableCell>
                                        <TableCell><input type="text" className="w-10/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" /></TableCell>
                                        <TableCell><input type="text" className="w-10/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" /></TableCell>
                                        <TableCell><input type="text" className="w-10/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="Item description" /></TableCell>
                                        <TableCell className="space-x-2"><p className="inline-block">RP</p><input type="number" className="w-10/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="0" /></TableCell>
                                        <TableCell className="space-x-2"><p className="inline-block">RP</p><input type="number" className="w-10/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="0" /></TableCell>
                                        <TableCell className="text-center"><button className="cursor-pointer hover:contrast-75"><RiDeleteBinLine className="w-6 h-6 text-[#E7000B]" /></button></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>


                    <div className="w-3/12 flex flex-col ml-auto space-y-4 mt-4">
                        <hr className="border-b border-[#e6e6e6] my-1" />
                        <div className="flex justify-between">
                            <p>Sub Total:</p>
                            {/* value subtotal */}
                            <p>Rp 0</p>
                        </div>
                        <hr className="border-b border-[#e6e6e6] my-1" />
                        <div className="flex justify-between">
                            <p>10% VAT:</p>
                            {/* value subtotal */}
                            <p>Rp 0</p>
                        </div>
                        <hr className="border-b border-black my-1" />
                        <div className="flex justify-between">
                            <p>TOTAL:</p>
                            {/* value subtotal */}
                            <p>Rp 0</p>
                        </div>
                    </div>

                    <hr className="border-b border-[#e6e6e6] my-6" />

                    <div className="w-full grid grid-cols-3 gap-x-8 mt-6">
                        <div className="flex flex-col space-y-4">
                            <label htmlFor="req" className="text-sm">Requested by</label>
                            <input id="req" type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="Name/Position" />
                        </div>
                        <div className="flex flex-col space-y-4">
                            <label htmlFor="approvedby" className="text-sm">Approved by</label>
                            <input id="approvedby" type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="Name/Position" />
                        </div>
                        <div className="flex flex-col space-y-4">
                            <label htmlFor="author" className="text-sm">Authorized by</label>
                            <input id="author" type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="Director" />
                        </div>
                    </div>

                    <hr className="border-b border-[#e6e6e6] my-6" />

                    <div className="flex flex-row ml-auto gap-x-4">
                        <Link href={"/admin/purchase-requisition"} className=" border text-black px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75">
                            Cancel
                        </Link>
                        <button className=" bg-[#31C6D4] text-white px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75">
                            Save Purchase Requisition
                        </button>
                    </div>
                </form>
            </div>
            {/* form container */}


        </div>
    )
}