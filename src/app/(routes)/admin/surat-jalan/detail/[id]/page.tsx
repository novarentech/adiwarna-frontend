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

// untuk detail semua input dll nya disabled jadi untuk lihat aja get by ID
export default function SuratJalanDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    return (
        <div className="w-full h-fit px-8 pt-4 pb-16 bg-[#f4f6f9]">
            <h1 className="text-4xl mt-8">Detail Surat Jalan</h1>
            {/* form container */}
            <div className="bg-white mt-6 w-full h-fit rounded-[10px] p-6">
                <div className="flex flex-row justify-between">
                    {/* alamat */}
                    <div className="flex flex-col">
                        <p className="text-lg">PT. ADIWARNA PRATAMA</p>
                        <div className="flex flex-col text-[#4A5565]">
                            <p>GRAHAMAS FATMAWATI B-15</p>
                            <p>CIPETE UTARA, KEBAYORAN BARU</p>
                            <p>JAKARTA SELATAN - 12150</p>
                            <p>Telp. 021-7269032 Fax. 021</p>
                            <p>7253610</p>
                        </div>
                    </div>
                    {/* surat jalan */}
                    <h2 className="text-2xl uppercase">Surat Jalan</h2>
                </div>


                <hr className="border-b border-[#e6e6e6] my-6" />

                <form action="" className="flex flex-col w-full h-fit">
                    <div className="w-full grid grid-cols-2 gap-x-8">
                        {/* left side */}
                        <div className="space-y-4">
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="kepada" className="text-sm">Kepada (Customer/Shipper)</label>
                                <input id="kepada" type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" />
                            </div>
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="address" className="text-sm">Address</label>
                                <textarea id="address" className="w-full h-[110px] border p-2 rounded-sm border-[#D1D5DC] resize-none" />
                            </div>
                        </div>
                        {/* right side */}
                        <div className="space-y-4">
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="nosure" className="text-sm">No Surat</label>
                                <input id="nosure" type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" />
                            </div>
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="tanggal" className="text-sm">Tanggal</label>
                                <input id="tanggal" type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" />
                            </div>
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="nowo" className="text-sm">No WO</label>
                                <input id="nowo" type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" />
                            </div>
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="dalamdengan" className="text-sm">Dalam Dengan</label>
                                <input id="dalamdengan" type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" />
                            </div>
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="platkendaraan" className="text-sm">Plat Kendaraan</label>
                                <input id="platkendaraan" type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" />
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
                                        <TableHead>No</TableHead>
                                        <TableHead className="w-2/6 font-bold">Nama Barang</TableHead>
                                        <TableHead className="w-2/6 font-bold">Serial Number</TableHead>
                                        <TableHead className="w-1/6 font-bold">Qty</TableHead>
                                        <TableHead className="font-bold text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="py-6">1</TableCell>
                                        <TableCell><input type="text" className="w-10/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" /></TableCell>
                                        <TableCell><input type="text" className="w-10/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" /></TableCell>
                                        <TableCell><input type="number" className="w-8/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" /></TableCell>
                                        <TableCell className="text-center"><button className="cursor-pointer hover:contrast-75"><RiDeleteBinLine className="w-6 h-6 text-[#E7000B]" /></button></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4 mt-6">
                        <label htmlFor="note" className="text-sm">Note</label>
                        <textarea id="note" className="w-full h-[110px] border p-2 rounded-sm border-[#D1D5DC] resize-none" placeholder="Harapan S/N, RA 219-06207 dan silan S/N, 291905 biaya arca" />
                    </div>

                    <div className="w-full grid grid-cols-2 gap-x-8 mt-6">
                        <div className="flex flex-col space-y-4">
                            <label htmlFor="diterima" className="text-sm">Diterima / Diserahkan Oleh</label>
                            <input id="diterima" type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="Name" />
                        </div>
                        <div className="flex flex-col space-y-4">
                            <label htmlFor="diserahkanadiwarna" className="text-sm">Diserahkan Oleh PT. Adiwarna Pratama</label>
                            <input id="diserahkanadiwarna" type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="Name" />
                        </div>
                    </div>

                    <hr className="border-b border-[#e6e6e6] my-6" />

                    <div className="flex flex-row ml-auto gap-x-4">
                        <Link href={"/admin/surat-jalan"} className=" border text-black px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75">
                            Cancel
                        </Link>
                        <button className=" bg-[#31C6D4] text-white px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75">
                            Save Surat Jalan
                        </button>
                    </div>
                </form>
            </div>
            {/* form container */}


        </div>
    )
}