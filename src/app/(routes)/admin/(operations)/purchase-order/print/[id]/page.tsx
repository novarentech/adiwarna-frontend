"use client"

import { getPurchaseOrderById, PurchaseOrderDetail } from "@/lib/purchase-order";
import { use, useEffect, useState } from "react";

export default function PurchaseOrderPrintPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [data, setData] = useState<PurchaseOrderDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getPurchaseOrderById(id);
                setData(res.data);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading || !data) return <div className="p-10">Loading...</div>;

    // --- Logika Perhitungan ---
    const subtotal = data.items.reduce((acc: number, item: any) => acc + (parseFloat(item.quantity) * parseFloat(item.rate)), 0);
    const discountAmount = subtotal * (Number(data.discount) / 100);
    const netTotal = subtotal - discountAmount;
    const vat = netTotal * 0.11;
    const grandTotal = netTotal + vat;

    const formatIDR = (val: number) => "Rp" + val.toLocaleString("id-ID", { minimumFractionDigits: 0 });
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <>
            <div className="bg-gray-100 min-h-screen print:bg-white print:min-h-0">
                <style>
                    {`
                @page {
                    size: A4;
                    margin: 15mm;
                }
                @media print {
                    html, body {
                        background: white !important;
                        height: 100% !important; /* Penting untuk footer bawah */
                        overflow: visible !important;
                    }
                    .no-print { display: none !important; }
                    
                    .print-wrapper {
                        box-shadow: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                        /* Memastikan kontainer mengambil tinggi penuh halaman saat print */
                        min-height: 100vh !important; 
                        display: flex !important;
                        flex-direction: column !important;
                    }

                    tr { page-break-inside: avoid; }
                    .avoid-break { page-break-inside: avoid; }
                }

                .all-cell-borders table {
                    border-collapse: collapse;
                    width: 100%;
                }
                .all-cell-borders th, 
                .all-cell-borders td {
                    border: 0.2px solid black !important;
                    padding: 1px 2px; /* Dikembalikan sedikit agar teks tidak menempel garis */
                }
                `}
                </style>
                {/* Modal Menu */}
                <div id="printModal" className="fixed top-5 right-5 w-72 z-50 no-print">
                    <div className="bg-white shadow-xl border rounded-lg p-4 text-sm">
                        <h5 className="font-bold mb-2 text-blue-600">Print</h5>
                        <p className="mb-4">Back to the top first before printing!</p>
                        <div className="flex gap-2">
                            <button onClick={() => window.history.back()} className="flex-1 bg-red-500 text-white py-1 rounded">Back</button>
                            <button onClick={() => window.print()} className="flex-1 bg-blue-600 text-white py-1 rounded font-bold">Print</button>
                        </div>
                    </div>
                </div>

                {/* Container Utama */}
                <div className="print-wrapper no-scrollbar   mx-auto bg-white shadow-lg w-[210mm] min-h-[297mm] p-[15mm] flex flex-col print:w-full print:p-0">
                    {/* --- BAGIAN ATAS (KONTEN) --- */}
                    <div className="grow">

                        {/* Header Section */}
                        <header className="mb-4">
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="w-[15%] text-center border border-black" rowSpan={2}>
                                            <img src="/icon.png" alt="Logo" className="w-20 mx-auto" />
                                        </td>
                                        <td className="text-center w-[50%] border border-black" rowSpan={2}>
                                            <h1 className="text-xl font-bold">PT. ADIWARNA PRATAMA</h1>
                                            <h2 className="text-lg font-semibold uppercase tracking-wider">Purchase Order</h2>
                                        </td>
                                        <td className="border border-black text-[8pt] p-1">Doc. No.</td>
                                        {/* bawaan dari laravel nya masih statis */}
                                        <td className="border border-black text-[8pt] p-1 font-bold">: FM-PCL-05</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-black text-[8pt] p-1 whitespace-nowrap">Rev. No./Date</td>
                                        {/* bawaan dari laravel nya masih statis */}
                                        <td className="border border-black text-[8pt] p-1 font-bold">: 00/02 Oct 2012</td>
                                    </tr>
                                </tbody>
                            </table>
                        </header>

                        {/* PO Basic Info */}
                        <div className=" mb-2 text-[10pt]">
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="border border-black p-1 w-24 font-bold">PO No.</td>
                                        <td className="border border-black p-1 font-bold"><b>{data.po_no}/AWP-INS/{data.po_year}</b></td>
                                        <td className="border border-black p-1 w-20 font-bold">Date</td>
                                        <td className="border border-black p-1 w-40">{formatDate(data.date)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Vendor & Delivery Address Info */}
                        <div className="text-[9pt]">
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="w-1/2 align-top border border-black p-1">
                                            <span className="font-bold uppercase">To:</span><br />
                                            <div className="mt-1 leading-relaxed">
                                                <b className="text-[10pt]">{data.customer.name}</b><br />
                                                {data.customer.address}<br />
                                                Telp.: {data.customer.phone_number}<br />
                                                Contact : {data.pic_name} ({data.pic_phone})
                                            </div>
                                        </td>
                                        <td className="w-1/2 align-top border border-black p-1">
                                            <span className="font-bold uppercase">Delivery Address:</span><br />
                                            <div className="mt-1 leading-relaxed">
                                                <b>PT. Adiwarna Pratama</b><br />
                                                Graha Mas Fatmawati, Blok B No. 15 Jl. RS Fatmawati Kav.71, Kebayoran Baru, Jakarta Selatan - 12150<br />
                                                Jakarta - Indonesia
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Delivery & Terms Info */}
                        <div className="mb-4 text-[8pt] text-center">
                            <table className="w-full border border-black border-t-0">
                                <thead className="bg-gray-50 font-bold">
                                    <tr className="border border-black border-t-0">
                                        <td className="w-1/4 border border-t-0 border-black">Required Delivery Date</td>
                                        <td className="w-1/4 border border-t-0 border-black">Terms Of Payment</td>
                                        <td className="w-1/4 border border-t-0 border-black">Quotation Ref.</td>
                                        <td className="w-1/4 border border-t-0 border-black">PR No.</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="font-semibold h-8 ">
                                        <td className="border border-black">{formatDate(data.required_date)}</td>
                                        <td className="border border-black">{data.top_dp} DP; {data.top_cod}</td>
                                        <td className="border border-black">{data.quotation_ref}</td>
                                        <td className="border border-black">
                                            {data.purchase_requisition_no ?
                                                `${data.purchase_requisition_no}/PR/${data.purchase_requisition_year}` : "-"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Items Table */}
                        <div className="mb-6 text-[9pt]">
                            <table className="w-full border border-black">
                                <thead className="text-center font-bold bg-gray-50 uppercase text-[8pt]">
                                    <tr>
                                        <th className="w-10 border border-black">No</th>
                                        <th className="w-20 border border-black" colSpan={2}>Quantity</th>
                                        <th className="border border-black">Description</th>
                                        <th className="w-32 border border-black">Rate</th>
                                        <th className="w-32 border border-black">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.map((item: any, i: number) => (
                                        <tr key={item.id}>
                                            <td className="text-center border border-black">{i + 1}</td>
                                            <td className="text-center border-r-0 w-10 border border-black">{item.quantity}</td>
                                            <td className="text-center border-l-0 w-10 border border-black">{item.unit}</td>
                                            <td className="text-left border border-black">
                                                <pre className="font-serif">{item.description}</pre>
                                            </td>
                                            <td className="text-right border border-black">{formatIDR(Number(item.rate))}</td>
                                            <td className="text-right border border-black">{formatIDR(Number(item.quantity) * Number(item.rate))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="font-semibold text-right">
                                    <tr>
                                        <td colSpan={5} className="p-1 border border-black">Sub Total</td>
                                        <td className="p-1 border border-black">{formatIDR(subtotal)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={5} className="p-1 border border-black">Discount ({data.discount}%)</td>
                                        <td className="p-1 border border-black">{formatIDR(discountAmount)}</td>
                                    </tr>
                                    <tr className="bg-gray-50 italic">
                                        <td colSpan={5} className="p-1 border border-black">Net Total</td>
                                        <td className="p-1 border border-black">{formatIDR(netTotal)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={5} className="p-1 border border-black text-[8pt]">VAT 11%</td>
                                        <td className="p-1 border border-black">{formatIDR(vat)}</td>
                                    </tr>
                                    <tr className="font-black text-[11pt] border-t-2 border-black">
                                        <td colSpan={5} className="p-1 border border-black uppercase">Total</td>
                                        <td className="p-1 border border-black">{formatIDR(grandTotal)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Signatures */}
                        <div className="grid grid-cols-3 gap-4 text-center text-[9pt] avoid-break mt-10">
                            <div className="flex flex-col h-32 justify-between">
                                <p>Requested by:</p>
                                <div>
                                    <hr className="border-black mb-1 mx-4" />
                                    <p className="font-bold uppercase">{data.req_name || "-"}</p>
                                    <p className="text-[8pt] italic">{data.req_pos || " - "}</p>
                                </div>
                            </div>
                            <div className="flex flex-col h-32 justify-between">
                                <p>Approved by:</p>
                                <div>
                                    <hr className="border-black mb-1 mx-4" />
                                    <p className="font-bold uppercase">{data.app_name || " - "}</p>
                                    <p className="text-[8pt] italic">{data.app_pos || " - "}</p>
                                </div>
                            </div>
                            <div className="flex flex-col h-32 justify-between">
                                <p>Authorized by:</p>
                                <div>
                                    <hr className="border-black mb-1 mx-4" />
                                    <p className="font-bold uppercase">{data.auth_name || " - "}</p>
                                    <p className="text-[8pt] italic">{data.auth_pos || "- "}</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* --- FOOTER (ALAMAT) --- */}
                    <footer className="mt-auto pt-4 border-t-2 border-black text-center text-[8pt] leading-tight no-break">
                        <p className="font-bold">Graha Mas Fatmawati Blok B 15, Jl. RS. Fatmawati Kav. 71</p>
                        <p>Cipete Utara Kebayoran Baru, Jakarta 12150 - Phone (62-21)72800322, 7210761, 7210852 Fax. (62-21) 7255428</p>
                        <p>Email: ptawp@cbn.net.id</p>
                    </footer>
                </div>
            </div>
        </>
    );
}