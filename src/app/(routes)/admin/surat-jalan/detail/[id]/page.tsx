"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { getDeliveryNoteById, GetbyIdDeliveryNoteDetails } from "@/lib/delivery-notes";
import { LuArrowLeft, LuPrinter } from "react-icons/lu";
import { LiaEdit } from "react-icons/lia";
import { toast } from "sonner";

export default function SuratJalanDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [data, setData] = useState<GetbyIdDeliveryNoteDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            const res = await getDeliveryNoteById(Number(id));
            if (res.success) {
                setData(res.data);
            } else {
                toast.error("Surat Jalan tidak ditemukan");
            }
            setLoading(false);
        };
        fetchDetail();
    }, [id]);

    if (loading) return <div className="p-16 text-center">Memuat detail Surat Jalan...</div>;
    if (!data) return <div className="p-16 text-center">Data tidak ditemukan.</div>;

    return (
        <div className="w-full h-fit px-16 pt-4 pb-16 bg-[#f4f6f9]">
            {/* Header Action */}
            <div className="flex justify-between items-center mt-8">
                <div className="flex items-center gap-x-4">
                    <Link href="/admin/surat-jalan" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-all">
                        <LuArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-4xl font-light">Detail Surat Jalan</h1>
                </div>
                <div className="flex gap-x-3">
                    <button className="bg-gray-600 text-white px-5 h-11 flex justify-center items-center rounded-sm hover:brightness-90">
                        <LuPrinter className="w-5 h-5 mr-2" /> Print Document
                    </button>
                    <Link href={`/admin/surat-jalan/edit/${id}`} className="bg-[#00A63E] text-white px-5 h-11 flex justify-center items-center rounded-sm hover:brightness-90">
                        <LiaEdit className="w-6 h-6 mr-1" /> Edit SJ
                    </Link>
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white mt-6 w-full h-fit rounded-[10px] p-8 shadow-sm">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <p className="text-xl font-bold">PT. ADIWARNA PRATAMA</p>
                        <div className="flex flex-col text-[#4A5565] text-xs mt-1">
                            <p>GRAHAMAS FATMAWATI B-15</p>
                            <p>CIPETE UTARA, KEBAYORAN BARU</p>
                            <p>JAKARTA SELATAN - 12150</p>
                            <p>Telp. 021-7269032 Fax. 021-7253610</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-black text-gray-200 uppercase tracking-widest">Surat Jalan</h2>
                        <div className={`mt-2 px-4 py-1 rounded-full text-xs font-bold inline-block uppercase 
                            ${data.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                data.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {data.status}
                        </div>
                    </div>
                </div>

                <hr className="border-b border-[#e6e6e6] my-6" />

                <div className="w-full grid grid-cols-2 gap-x-12">
                    {/* Sisi Kiri: Customer Info */}
                    <div className="space-y-6">
                        <div className="flex flex-col space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kepada (Customer/Shipper)</label>
                            <p className="p-3 bg-gray-50 border rounded-sm font-medium">{data.customer.name}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Address</label>
                            <p className="p-3 bg-gray-50 border rounded-sm min-h-[110px] whitespace-pre-wrap text-sm text-gray-700">{data.customer.address}</p>
                        </div>
                    </div>

                    {/* Sisi Kanan: SJ Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">No Surat</label>
                            <p className="p-3 bg-gray-50 border rounded-sm font-bold">{data.dn_no}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal</label>
                            <p className="p-3 bg-gray-50 border rounded-sm">{data.date}</p>
                        </div>
                        <div className="flex flex-col space-y-2 col-span-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">No WO</label>
                            <p className="p-3 bg-gray-50 border rounded-sm">{data.wo_no}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dalam Dengan</label>
                            <p className="p-3 bg-gray-50 border rounded-sm">{data.delivered_with || "-"}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Plat Kendaraan</label>
                            <p className="p-3 bg-gray-50 border rounded-sm">{data.vehicle_plate}</p>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="flex flex-col mt-10">
                    <h3 className="text-lg font-bold mb-4 border-l-4 border-[#31C6D4] pl-3 text-gray-700">Items Details</h3>
                    <div className="border rounded-xl overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader className="bg-[#F9FAFB]">
                                <TableRow>
                                    <TableHead className="w-16 text-center">No</TableHead>
                                    <TableHead className="w-3/6 font-bold">Nama Barang</TableHead>
                                    <TableHead className="w-2/6 font-bold">Serial Number</TableHead>
                                    <TableHead className="w-1/6 font-bold text-center">Qty</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.items.map((item, index) => (
                                    <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <TableCell className="py-4 text-center font-medium text-gray-400">{index + 1}</TableCell>
                                        <TableCell className="font-semibold text-gray-800">{item.item_name}</TableCell>
                                        <TableCell className="font-mono text-sm">{item.serial_number || "-"}</TableCell>
                                        <TableCell className="text-center font-bold">{item.qty}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Note Section */}
                <div className="flex flex-col space-y-2 mt-10 p-4 bg-blue-50/50 rounded-lg border border-blue-100 border-dashed">
                    <label className="text-xs font-bold text-blue-400 uppercase tracking-wider">Note / Keterangan</label>
                    <p className="text-sm text-gray-600 italic">
                        {data.notes ? `"${data.notes}"` : "Tidak ada catatan tambahan."}
                    </p>
                </div>

                {/* Signature Section */}
                <div className="w-full grid grid-cols-2 gap-x-12 mt-12 mb-6">
                    <div className="text-center">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-16 text-left border-b pb-1">Diterima / Diserahkan Oleh</p>
                        <p className="text-xl font-bold text-gray-800 underline decoration-[#31C6D4] decoration-2 underline-offset-8">
                            {data.received_by}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-16 text-left border-b pb-1">Diserahkan Oleh PT. Adiwarna Pratama</p>
                        <p className="text-xl font-bold text-gray-800 underline decoration-[#31C6D4] decoration-2 underline-offset-8">
                            {data.delivered_by}
                        </p>
                    </div>
                </div>

                <hr className="border-b border-[#e6e6e6] my-8" />

                <div className="flex justify-end">
                    <Link href="/admin/surat-jalan" className="text-sm font-bold text-[#31C6D4] hover:underline">
                        ← Kembali ke Daftar Surat Jalan
                    </Link>
                </div>
            </div>
        </div>
    );
}