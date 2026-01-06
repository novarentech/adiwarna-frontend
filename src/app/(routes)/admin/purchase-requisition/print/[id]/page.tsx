"use client";

import { GetByIDPurchaseRequisitionDetails, getPurchaseRequisitionById } from "@/lib/purchase-requisitions";
import { use, useEffect, useState } from "react";
// Import helper API Anda
// import { getPurchaseRequisitionById } from "@/lib/api";

export default function PurchaseRequisitionPrintPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [data, setData] = useState<GetByIDPurchaseRequisitionDetails>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getPurchaseRequisitionById(Number(id));
                setData(res.data);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading || !data) return <div className="p-10 text-center font-sans">Loading Purchase Requisition...</div>;

    const formatCurrency = (val: string) => {
        const num = parseFloat(val) || 0;
        return new Intl.NumberFormat("id-ID").format(num);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="bg-gray-100 min-h-screen print:bg-white print:min-h-0">
            <style>
                {`
                @page { size: A4; margin: 10mm; }
                ::-webkit-scrollbar {
                display: none;
                }
                @media print {
                    html, body { background: white !important; overflow: visible !important; }
                    .no-print { display: none !important; }
                    .print-wrapper {
                        box-shadow: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                        display: flex !important;
                        flex-direction: column !important;
                    }
                }
                .all-cell-borders table { border-collapse: collapse; width: 100%; }
                .all-cell-borders th, .all-cell-borders td {
                    border: 0.5px solid black !important;
                    padding: 4px 6px;
                }
                `}
            </style>

            {/* Modal Control */}
            <div className="fixed top-5 right-5 w-72 z-50 no-print font-sans">
                <div className="bg-white shadow-xl border rounded-lg p-4 text-sm">
                    <h5 className="font-bold mb-2 text-blue-600 flex items-center gap-2">
                        <span>📝</span> Purchase Requisition
                    </h5>
                    <div className="flex gap-2">
                        <button onClick={() => window.history.back()} className="flex-1 bg-gray-200 py-1.5 rounded">Back</button>
                        <button onClick={() => window.print()} className="flex-1 bg-blue-600 text-white py-1.5 rounded font-bold">Print</button>
                    </div>
                </div>
            </div>

            <div className="print-wrapper mx-auto bg-white shadow-lg w-[210mm] min-h-[297mm] p-[10mm] flex flex-col print:w-full print:p-0 font-sans text-[9pt]">

                <div className="grow">
                    {/* Header Box */}
                    <header className="all-cell-borders mb-3">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="w-[15%] text-center py-2" rowSpan={2}>
                                        <img src="/icon.png" alt="Logo" className="w-14 mx-auto" />
                                    </td>
                                    <td className="text-center w-[55%] font-bold text-[11pt]" rowSpan={2}>
                                        PT. ADI WARNA PRATAMA
                                        <div className="text-[10pt] font-bold mt-1 uppercase">Purchase Requisition</div>
                                    </td>
                                    <td className="w-[12%] text-[8pt]">Doc. No.</td>
                                    <td className="w-[18%] text-[8pt] font-bold">FM-PCL-04</td>
                                </tr>
                                <tr>
                                    <td className="text-[8pt]">Rev. No./Date</td>
                                    <td className="text-[8pt] font-bold">01 / 02.01.2018</td>
                                </tr>
                            </tbody>
                        </table>
                    </header>

                    {/* Metadata Section */}
                    <div className="border border-black mb-3">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="w-[20%] font-semibold p-1">P.R. No. :</td>
                                    <td className="w-[30%] p-1">{data.pr_no}/PR/AWP-{data.pr_date}</td>
                                    <td className="w-[20%] font-semibold p-1">P.O. No. / Cash :</td>
                                    <td className="w-[30%] p-1">{data.po_no_cash}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold p-1" >Date :</td>
                                    <td className="p-1">{formatDate(data.date)}</td>
                                    <td className="font-semibold p-1">Supplier :</td>
                                    <td className="capitalize p-1">{data.supplier}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold p-1">Required Delivery :</td>
                                    <td className="p-1">AWP</td>
                                    <td className="font-semibold p-1">Place of Delivery :</td>
                                    <td className="font-normal p-1">AWP</td>
                                </tr>
                                <tr>
                                    <td colSpan={2}></td>
                                    <td className="font-semibold p-1">Online/Offline :</td>
                                    <td className="flex gap-4 p-1">
                                        {data.routing}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Items Table */}
                    <div className="all-cell-borders mb-0">
                        <table className="w-full text-center">
                            <thead className="font-bold uppercase text-[8.5pt] bg-gray-50">
                                <tr>
                                    <th className="w-[5%]">Item No.</th>
                                    <th className="w-[8%]">Qty</th>
                                    <th className="w-[10%]">Unit</th>
                                    <th className="w-[42%]">Description</th>
                                    <th className="w-[15%]">Unit Price</th>
                                    <th className="w-[20%]">Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.map((item: any, idx: number) => (
                                    <tr key={item.id}>
                                        <td>{idx + 1}</td>
                                        <td>{item.qty}</td>
                                        <td>{item.unit}</td>
                                        <td className="text-left font-medium">{item.description}</td>
                                        <td className="text-right">
                                            <div className="flex justify-between"><span>Rp</span> <span>{formatCurrency(item.unit_price)}</span></div>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex justify-between"><span>Rp</span> <span>{formatCurrency(item.total_price)}</span></div>
                                        </td>
                                    </tr>
                                ))}
                                {/* Filler Rows */}
                                {[...Array(Math.max(0, 12 - data.items.length))].map((_, i) => (
                                    <tr key={`empty-${i}`} className="h-7 text-transparent">
                                        <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
                                        {/* <td className="text-right flex justify-between"><span>Rp</span><span>-</span></td>
                                        <td className="text-right flex justify-between"><span>Rp</span><span>-</span></td> */}
                                    </tr>
                                ))}
                            </tbody>
                            {/* Financial Summary */}
                            <tfoot>
                                <tr>
                                    <td colSpan={4} className="border-none text-right font-bold py-1">Sub Total :</td>
                                    <td className="text-right font-bold" colSpan={2}>
                                        <div className="flex justify-between italic"><span>Rp</span> <span>{formatCurrency(data.sub_total)}</span></div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={4} className="border-none text-right font-bold py-1">{data.vat_percentage}% VAT :</td>
                                    <td className="text-right font-bold" colSpan={2}>
                                        <div className="flex justify-between italic"><span>Rp</span> <span>{formatCurrency(data.vat_amount)}</span></div>
                                    </td>
                                </tr>
                                <tr className="bg-gray-100">
                                    <td colSpan={4} className="border-none text-right font-bold py-2 uppercase tracking-wide">Total :</td>
                                    <td className="text-right font-bold" colSpan={2}>
                                        <div className="flex justify-between"><span>Rp</span> <span>{formatCurrency(data.total_amount)}</span></div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Signatures */}
                    <div className="grid grid-cols-3 gap-0 mt-8 all-cell-borders">
                        <div className="text-center p-2 min-h-[130px] flex flex-col justify-between border-r-0">
                            <p className="font-semibold text-[8pt]">Requested by:</p>
                            <div className="mt-auto">
                                <div className="font-bold ">{data.requested_by}</div>
                                <div className="text-[8pt] text-gray-600 border-t border-black mt-1">{data.requested_position}</div>
                            </div>
                        </div>
                        <div className="text-center p-2 min-h-[130px] flex flex-col justify-between border-x-0">
                            <p className="font-semibold text-[8pt]">Approved by:</p>
                            <div className="mt-auto">
                                <div className="font-bold">{data.approved_by}</div>
                                <div className="text-[8pt] text-gray-600 border-t border-black mt-1">{data.approved_position}</div>
                            </div>
                        </div>
                        <div className="text-center p-2 min-h-[130px] flex flex-col justify-between border-l-0">
                            <p className="font-semibold text-[8pt]">Authorized by:</p>
                            <div className="mt-auto">
                                <div className="font-bold">{data.authorized_by}</div>
                                <div className="text-[8pt] font-bold border-t border-black mt-1">Director</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Alamat */}
                <footer className="mt-8 border-t-2 border-black pt-2 text-center text-[7.5pt] font-serif">
                    <p className="font-bold">Graha Mas Fatmawati Blok B 15, Jl. RS. Fatmawati Kav. 71</p>
                    <p>Cipete Utara Kebayoran Baru, Jakarta 12150 - Phone (62-21) 72800322, 7210761, Fax (62-21) 7255428</p>
                    <p className="italic">Email: ptawp@cbn.net.id</p>
                </footer>
            </div>
        </div>
    );
}