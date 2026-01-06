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
import { use, useState, useEffect } from "react";
import { getMaterialReceivinById, GetMaterialReceivingReportResponseById } from "@/lib/material-receiving";
import { LuArrowLeft, LuPrinter } from "react-icons/lu";
import { LiaEdit } from "react-icons/lia";
import { toast } from "sonner";

export default function DetailMaterialReceivingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<GetMaterialReceivingReportResponseById["data"] | null>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            const res = await getMaterialReceivinById(Number(id));
            if (res.success) {
                setData(res.data);
            } else {
                toast.error("Data not found");
            }
            setLoading(false);
        };
        fetchDetail();
    }, [id]);

    if (loading) return <div className="p-16 text-center">Loading Detail...</div>;
    if (!data) return <div className="p-16 text-center">Data not found.</div>;

    return (
        <div className="w-full h-fit px-16 pt-4 pb-16 bg-[#f4f6f9]">
            {/* Header Title with Action Buttons */}
            <div className="flex justify-between items-center mt-8">
                <div className="flex items-center gap-x-4">
                    <Link href="/admin/material-receiving" className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
                        <LuArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-4xl">Detail Material Receiving</h1>
                </div>
                <div className="flex gap-x-3">
                    <Link href={`/admin/material-receiving/print/${id}`} className="bg-gray-600 text-white px-5 h-11 flex justify-center items-center rounded-sm hover:contrast-75">
                        <LuPrinter className="w-5 h-5 mr-2" /> Print
                    </Link>
                    <Link href={`/admin/material-receiving/edit/${id}`} className="bg-[#00A63E] text-white px-5 h-11 flex justify-center items-center rounded-sm hover:contrast-75">
                        <LiaEdit className="w-6 h-6 mr-1" /> Edit Record
                    </Link>
                </div>
            </div>

            {/* Content Container */}
            <div className="bg-white mt-6 w-full h-fit rounded-[10px] p-6 shadow-sm">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <p className="text-xl font-bold">PT. ADIWARNA PRATAMA</p>
                        <p className="text-[#4A5565]">Material Receiving Record</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-[#4A5565]">Doc. No: <span className="text-black">FM-PC1-06</span></p>
                        <p className="text-sm text-[#4A5565] mt-1">Rev. No: <span className="text-black">01/02.01.2018</span></p>
                    </div>
                </div>

                <hr className="border-b border-[#e6e6e6] my-6" />

                {/* Info Header */}
                <div className="grid grid-cols-3 gap-8">
                    <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase font-bold">P.O. / INV. / PR No.</p>
                        <p className="text-lg border-b pb-1">{data.po_no}/MR/AWP-{data.po_date} </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase font-bold">Supplier</p>
                        <p className="text-lg border-b pb-1">{data.supplier}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase font-bold">Receiving Date</p>
                        <p className="text-lg border-b pb-1">{data.receiving_date}</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8 mt-6">
                    <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase font-bold">Order By</p>
                        <p className={`mt-1 px-4 py-1 rounded-md w-fit capitalize font-medium ${data.order_by === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                            {data.order_by}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase font-bold">Status</p>
                        <p className={`mt-1 px-4 py-1 rounded-full w-fit capitalize font-medium ${data.status === 'complete' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {data.status}
                        </p>
                    </div>
                </div>

                {/* Material Items Table */}
                <div className="mt-10">
                    <h2 className="text-lg font-bold mb-4">Material Items</h2>
                    <div className="border rounded-xl overflow-hidden">
                        <Table>
                            <TableHeader className="bg-[#F9FAFB]">
                                <TableRow>
                                    <TableHead className="w-16 text-center py-4">No</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-center">Qty Ordered</TableHead>
                                    <TableHead className="text-center">Qty Received</TableHead>
                                    <TableHead>Remarks</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.items.map((item, index) => (
                                    <TableRow key={item.id || index}>
                                        <TableCell className="text-center py-4">{index + 1}</TableCell>
                                        <TableCell className="font-medium">{item.description}</TableCell>
                                        <TableCell className="text-center">{item.order_qty}</TableCell>
                                        <TableCell className="text-center">{item.received_qty}</TableCell>
                                        <TableCell className="text-gray-600 italic">{item.remarks || "-"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Notes Section */}
                {data.notes && (
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-sm font-bold text-gray-500 uppercase mb-2">Notes</p>
                        <p className="text-gray-700">{data.notes}</p>
                    </div>
                )}

                <hr className="border-b border-[#e6e6e6] my-8" />

                {/* Personnel Section */}
                <div className="grid grid-cols-2 gap-12">
                    <div className="border-l-4 border-[#31C6D4] pl-4">
                        <p className="text-xs text-gray-500 uppercase font-bold">Received By</p>
                        <p className="text-xl mt-1">{data.received_by}</p>
                    </div>
                    <div className="border-l-4 border-gray-300 pl-4">
                        <p className="text-xs text-gray-500 uppercase font-bold">Acknowledge By</p>
                        <p className="text-xl mt-1">{data.acknowledge_by}</p>
                    </div>
                </div>
                {/* Personnel Section POSITION*/}
                <div className="grid grid-cols-2 gap-12">
                    <div className="border-l-4 border-[#31C6D4] pl-4">
                        <p className="text-xl mt-1">{data.received_position}</p>
                    </div>
                    <div className="border-l-4 border-gray-300 pl-4">
                        <p className="text-xl mt-1">{data.acknowledge_position}</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <Link href="/admin/material-receiving" className="text-[#31C6D4] font-bold hover:underline">
                    Back to List
                </Link>
            </div>
        </div>
    );
}