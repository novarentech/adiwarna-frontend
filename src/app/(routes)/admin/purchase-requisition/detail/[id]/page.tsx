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
import { getPurchaseRequisitionById, GetByIDPurchaseRequisitionDetails } from "@/lib/purchase-requisitions";
import { LuArrowLeft, LuPrinter } from "react-icons/lu";
import { LiaEdit } from "react-icons/lia";

export default function DetailPurchaseRequisitionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [data, setData] = useState<GetByIDPurchaseRequisitionDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            const res = await getPurchaseRequisitionById(Number(id));
            if (res.success) {
                setData(res.data);
            } else {
                alert("Data not found");
            }
            setLoading(false);
        };
        fetchDetail();
    }, [id]);

    if (loading) return <div className="p-16 text-center">Loading Detail PR...</div>;
    if (!data) return <div className="p-16 text-center">Data not found.</div>;

    return (
        <div className="w-full h-fit px-16 pt-4 pb-16 bg-[#f4f6f9]">
            {/* Action Header */}
            <div className="flex justify-between items-center mt-8">
                <div className="flex items-center gap-x-4">
                    <Link href="/admin/purchase-requisition" className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
                        <LuArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-4xl">Detail Purchase Requisition</h1>
                </div>
                <div className="flex gap-x-3">
                    <Link href={`/admin/purchase-requisition/print/${id}`} className="bg-gray-600 text-white px-5 h-11 flex justify-center items-center rounded-sm hover:contrast-75">
                        <LuPrinter className="w-5 h-5 mr-2" /> Print PR
                    </Link>
                    <Link href={`/admin/purchase-requisition/edit/${id}`} className="bg-[#00A63E] text-white px-5 h-11 flex justify-center items-center rounded-sm hover:contrast-75">
                        <LiaEdit className="w-6 h-6 mr-1" /> Edit PR
                    </Link>
                </div>
            </div>

            {/* Content Container */}
            <div className="bg-white mt-6 w-full h-fit rounded-[10px] p-8 shadow-sm">
                <div className="flex flex-row justify-between border-b pb-6">
                    <div className="flex flex-col">
                        <p className="text-2xl font-bold text-gray-800">PT. ADIWARNA PRATAMA</p>
                        <p className="text-[#4A5565] tracking-[0.2em] font-medium">PURCHASE REQUISITION</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500 uppercase">Document No:</p>
                        <p className="text-lg font-bold">M-PU-1-04</p>
                        <p className={`mt-2 px-3 py-1 rounded-full text-xs font-bold inline-block uppercase 
                            ${data.status === 'approved' ? 'bg-green-100 text-green-700' :
                                data.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            Status : {data.status}
                        </p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-x-16 mt-8">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 border-b pb-2">
                            <span className="text-sm text-gray-500 uppercase">P.R. Number</span>
                            <span className="font-semibold">{data.pr_no}</span>
                        </div>
                        <div className="grid grid-cols-2 border-b pb-2">
                            <span className="text-sm text-gray-500 uppercase">Rev. No./Date</span>
                            <span className="font-semibold">{data.rev_no || "-"}</span>
                        </div>
                        <div className="grid grid-cols-2 border-b pb-2">
                            <span className="text-sm text-gray-500 uppercase">Required Delivery</span>
                            <span className="font-semibold">{data.required_delivery}</span>
                        </div>
                        <div className="grid grid-cols-2 border-b pb-2">
                            <span className="text-sm text-gray-500 uppercase">Place of Delivery</span>
                            <span className="font-semibold">{data.place_of_delivery}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 border-b pb-2">
                            <span className="text-sm text-gray-500 uppercase">P.O. No / Cash</span>
                            <span className="font-semibold">{data.po_no_cash}</span>
                        </div>
                        <div className="grid grid-cols-2 border-b pb-2">
                            <span className="text-sm text-gray-500 uppercase">Supplier</span>
                            <span className="font-semibold">{data.supplier}</span>
                        </div>
                        <div className="grid grid-cols-2 border-b pb-2">
                            <span className="text-sm text-gray-500 uppercase">Routing</span>
                            <span className="font-semibold capitalize">{data.routing}</span>
                        </div>
                        <div className="grid grid-cols-2 border-b pb-2">
                            <span className="text-sm text-gray-500 uppercase">Date</span>
                            <span className="font-semibold">{data.date}</span>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mt-12">
                    <h2 className="text-lg font-bold mb-4 text-gray-700 border-l-4 border-[#31C6D4] pl-3">Items Details</h2>
                    <div className="border rounded-xl overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader className="bg-[#F9FAFB]">
                                <TableRow>
                                    <TableHead className="w-16 text-center">No</TableHead>
                                    <TableHead className="w-24 text-center">Qty</TableHead>
                                    <TableHead className="w-24">Unit</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Unit Price</TableHead>
                                    <TableHead className="text-right pr-8">Total Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.items.map((item, index) => (
                                    <TableRow key={item.id} className="hover:bg-gray-50">
                                        <TableCell className="text-center font-medium text-gray-500">{index + 1}</TableCell>
                                        <TableCell className="text-center font-bold">{Number(item.qty)}</TableCell>
                                        <TableCell>{item.unit}</TableCell>
                                        <TableCell className="font-medium">{item.description}</TableCell>
                                        <TableCell className="text-right">Rp {Number(item.unit_price).toLocaleString('id-ID')}</TableCell>
                                        <TableCell className="text-right pr-8 font-bold">Rp {Number(item.total_price).toLocaleString('id-ID')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="w-full flex justify-end mt-8">
                    <div className="w-80 space-y-3 bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
                        <div className="flex justify-between text-gray-600">
                            <span className="text-sm uppercase tracking-wider">Sub Total:</span>
                            <span className="font-semibold text-black text-lg">Rp {Number(data.sub_total).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span className="text-sm uppercase tracking-wider">VAT ({data.vat_percentage}%):</span>
                            <span className="font-semibold text-black text-lg">Rp {Number(data.vat_amount).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="border-t pt-3 flex justify-between items-center text-[#31C6D4]">
                            <span className="text-sm font-bold uppercase tracking-widest">Total:</span>
                            <span className="text-2xl font-black">Rp {Number(data.total_amount).toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </div>

                {/* Notes Section */}
                {data.notes && (
                    <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                        <p className="text-xs font-bold text-blue-800 uppercase mb-1">Notes</p>
                        <p className="text-gray-700 italic">"{data.notes}"</p>
                    </div>
                )}

                <hr className="border-b border-[#e6e6e6] my-10" />

                {/* Approval Personnel */}
                <div className="grid grid-cols-3 gap-x-12 mt-6 mb-4">
                    <div className="text-center">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-10 text-left border-b pb-1">Requested By</p>
                        <p className="text-lg font-bold border-b-2 border-gray-100 inline-block px-4">{data.requested_by}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-10 text-left border-b pb-1">Approved By</p>
                        <p className="text-lg font-bold border-b-2 border-gray-100 inline-block px-4">{data.approved_by}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-10 text-left border-b pb-1">Authorized By</p>
                        <p className="text-lg font-bold border-b-2 border-gray-100 inline-block px-4">{data.authorized_by}</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <Link href="/admin/purchase-requisition" className="text-[#31C6D4] font-bold hover:underline transition-all">
                    ← Return to Purchase Requisition List
                </Link>
            </div>
        </div>
    );
}