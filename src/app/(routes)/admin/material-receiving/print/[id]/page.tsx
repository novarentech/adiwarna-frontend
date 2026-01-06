"use client";

import { getMaterialReceivinById, GetMaterialReceivingReportResponseById, GetMaterialRecevingResponseByIDForPrint } from "@/lib/material-receiving";
import { use, useEffect, useState } from "react";
// Import helper API Anda
// import { getMaterialReceivinById } from "@/lib/api";

export default function MaterialReceivingPrintPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [data, setData] = useState<GetMaterialRecevingResponseByIDForPrint>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {

                // Jika sudah siap gunakan API asli:
                const res = await getMaterialReceivinById(Number(id));
                setData(res.data);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading || !data) return <div className="p-10 text-center font-sans">Loading Material Receiving Record...</div>;

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).replace(/\//g, '.');
    };

    return (
        <div className="bg-gray-100 min-h-screen print:bg-white print:min-h-0">
            <style>
                {`
                @page {
                    size: A4;
                    margin: 10mm;
                }
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
                    padding: 4px 8px;
                }
                `}
            </style>

            {/* Modal Control */}
            <div id="printModal" className="fixed top-5 right-5 w-72 z-50 no-print font-sans">
                <div className="bg-white shadow-xl border rounded-lg p-4 text-sm">
                    <h5 className="font-bold mb-2 text-blue-600 flex items-center gap-2">
                        <span>📦</span> Material Receiving
                    </h5>
                    <div className="flex gap-2">
                        <button onClick={() => window.history.back()} className="flex-1 bg-gray-200 py-1.5 rounded hover:bg-gray-300 transition">Back</button>
                        <button onClick={() => window.print()} className="flex-1 bg-blue-600 text-white py-1.5 rounded font-bold hover:bg-blue-700 transition">Print</button>
                    </div>
                </div>
            </div>

            {/* A4 Content Wrapper */}
            <div className="print-wrapper mx-auto bg-white shadow-lg w-[210mm] min-h-[297mm] p-[10mm] flex flex-col print:w-full print:p-0 font-sans text-[9.5pt]">

                <div className="grow">
                    {/* Header Table */}
                    <header className="all-cell-borders mb-4">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="w-[15%] text-center py-2" rowSpan={2}>
                                        <img src="/icon.png" alt="Logo" className="w-14 mx-auto" />
                                    </td>
                                    <td className="text-center w-[55%] font-bold text-[12pt]" rowSpan={2}>
                                        PT. ADIWARNA PRATAMA
                                        <div className="text-[10pt] font-semibold mt-1">Material Receiving Record</div>
                                    </td>
                                    <td className="w-[12%] text-[8pt]">Doc. No.</td>
                                    <td className="w-[18%] text-[8pt] font-bold">FM-PCL-06</td>
                                </tr>
                                <tr>
                                    <td className="text-[8pt]">Rev. No.</td>
                                    <td className="text-[8pt] font-bold">01 / 02.01.2018</td>
                                </tr>
                            </tbody>
                        </table>
                    </header>

                    {/* Meta Data Section */}
                    <div className="all-cell-borders mb-2">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="w-[20%] font-semibold">Ref. PO No.</td>
                                    <td className="w-[30%] font-bold">{data.po_no}/PR/AWP-{data.po_date} </td>
                                    <td className="w-[20%] font-semibold">Supplier</td>
                                    <td className="w-[30%]">{data.supplier}</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold">Ref. P.O No.</td>
                                    <td>-</td>
                                    <td className="font-semibold">Receiving Date</td>
                                    <td>{data.receiving_date}</td>
                                </tr>
                                <tr>
                                    <td colSpan={2}></td>
                                    <td className="font-semibold">Order By</td>
                                    <td className="">
                                        {/* <div className="flex items-center gap-1">
                                            <div className={`w-3 h-3 border border-black ${data.order_by === 'offline' ? 'bg-black' : ''}`}></div> Offline
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className={`w-3 h-3 border border-black ${data.order_by === 'online' ? 'bg-black' : ''}`}></div> Online
                                        </div> */}
                                        {data.order_by}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Items Table */}
                    <div className="all-cell-borders mb-4">
                        <table className="w-full text-center">
                            <thead className="font-bold uppercase text-[8.5pt]">
                                <tr>
                                    <th className="w-[5%]" rowSpan={2}>No.</th>
                                    <th className="w-[50%]" rowSpan={2}>Description</th>
                                    <th className="w-[20%]" colSpan={2}>Qty</th>
                                    <th className="w-[25%]" rowSpan={2}>Remarks<br /><span className="lowercase font-normal text-[7.5pt]">(Good Condition / Reject)</span></th>
                                </tr>
                                <tr>
                                    <th className="w-[10%]">Ordered</th>
                                    <th className="w-[10%]">Received</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.map((item: any, idx: number) => (
                                    <tr key={item.id}>
                                        <td>{idx + 1}</td>
                                        <td className="text-left">{item.description}</td>
                                        <td>{item.order_qty}</td>
                                        <td>{item.received_qty}</td>
                                        <td>{item.remarks || '-'}</td>
                                    </tr>
                                ))}
                                {/* Baris Kosong untuk mengisi sisa halaman */}
                                {[...Array(Math.max(0, 15 - data.items.length))].map((_, i) => (
                                    <tr key={`empty-${i}`} className="h-7">
                                        <td></td><td></td><td></td><td></td><td></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Signature Section */}
                    <div className="grid grid-cols-2 gap-4 mt-8 px-2 avoid-break">
                        <div className="text-left">
                            <p className="mb-1 text-gray-700">Received By,</p>
                            <div className="h-28 flex items-end">
                                {/* Area Tanda Tangan */}
                                <div className="w-48 border-b border-black text-center font-bold">
                                    {data.received_by}
                                    <div className="font-normal text-[8pt] border-t border-dotted border-gray-400 mt-1">{data.received_position}</div>
                                </div>
                            </div>
                            <p className="mt-2">Date: {data.receiving_date}</p>
                        </div>

                        <div className="text-right">
                            <div className="inline-block text-left">
                                <p className="mb-1 text-gray-700">Acknowledge by,</p>
                                <div className="h-28 flex items-end">
                                    {/* Area Tanda Tangan */}
                                    <div className="w-48 border-b border-black text-center font-bold">
                                        {data.acknowledge_by || "(..........................)"}
                                        <div className="font-normal text-[8pt] border-t border-dotted border-gray-400 mt-1">{data.acknowledge_position || 'Manager'}</div>
                                    </div>
                                </div>
                                <p className="mt-2">Date: ..........................</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Perusahaan */}
                <footer className="mt-auto pt-4 border-t-2 border-black text-center text-[7.5pt] leading-tight font-serif">
                    <p className="font-bold">Graha Mas Fatmawati Blok B 15, Jl. RS. Fatmawati Kav. 71</p>
                    <p>Cipete Utara Kebayoran Baru, Jakarta 12150 - Phone (62-21)72800322, 7210761, 7210852 Fax. (62-21) 7255428</p>
                    <p>Email: ptawp@cbn.net.id</p>
                </footer>
            </div>
        </div>
    );
}