"use client";

import { GetbyidDocumentTransmittal, getDocumentTransmittalById } from "@/lib/document-transmittals";
import { use, useEffect, useState } from "react";
// import { getTransmittalById } from "@/lib/transmittal";

export default function DocumentTransmittalPrintPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [data, setData] = useState<GetbyidDocumentTransmittal | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getDocumentTransmittalById(id);
                setData(res.data);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading || !data) return <div className="p-10 text-center font-sans">Loading Document Transmittal...</div>;

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    return (
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
                        height: 100% !important;
                        overflow: visible !important;
                    }
                    .no-print { display: none !important; }
                    .print-wrapper {
                        box-shadow: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
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
                    border: 0.5px solid black !important;
                    padding: 8px;
                }
                .signature-table td {
                    border: 0.5px solid black !important;
                    padding: 0;
                    vertical-align: top;
                }
                `}
            </style>

            {/* Modal Menu */}
            <div id="printModal" className="fixed top-5 right-5 w-72 z-50 no-print font-sans">
                <div className="bg-white shadow-xl border rounded-lg p-4 text-sm">
                    <h5 className="font-bold mb-2 text-blue-600">Print Transmittal</h5>
                    <p className="mb-4 text-gray-500 text-xs">Back to the top first before printing!</p>
                    <div className="flex gap-2">
                        <button onClick={() => window.history.back()} className="flex-1 bg-gray-200 py-1.5 rounded">Back</button>
                        <button onClick={() => window.print()} className="flex-1 bg-blue-600 text-white py-1.5 rounded font-bold">Print</button>
                    </div>
                </div>
            </div>

            {/* Container Utama (A4) */}
            <div className="print-wrapper mx-auto bg-white shadow-lg w-[210mm] min-h-[297mm] p-[15mm] flex flex-col print:w-full print:p-0 font-serif">

                <div className="grow">
                    {/* Header Section */}
                    <header className="mb-8">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="w-[20%] text-center py-4 border border-black">
                                        <img src="/icon.png" alt="Logo" className="w-24 mx-auto" />
                                    </td>
                                    <td className="text-center py-4 border border-black">
                                        <h1 className="text-2xl font-bold">PT. ADIWARNA PRATAMA</h1>
                                        <h2 className="text-xl font-semibold uppercase tracking-widest">Document Transmittal</h2>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </header>

                    {/* TA Info & Customer Address */}
                    <div className="mb-4 px-2 text-[12pt] leading-relaxed">
                        <p className="mb-2">TA No. : <b>{data.ta_no}</b></p>

                        <div className="mb-2">
                            <p className="font-bold text-[14pt]">{data.customer.name}</p>
                            <div className="whitespace-pre-line text-gray-800">
                                {data.customer.address}
                                {data.customer.district && <p>{data.customer.district}</p>}
                            </div>
                        </div>

                        <p className="mt-4"><b>Attention: {data.pic_name}</b></p>
                    </div>

                    {/* Content Intro */}
                    <p className="px-2 mb-6 text-[12pt]">Please find enclosed the following documents:</p>

                    <h3 className="px-2 mb-4 font-bold text-[12pt]">
                        {data.report_type}
                    </h3>

                    {/* Documents Table */}
                    <div className="mb-12 px-2">
                        <table className="w-5/6 text-center text-[11pt]">
                            <thead className="uppercase font-bold text-[10pt]">
                                <tr>
                                    <th className="w-12 ">No</th>
                                    <th className="">Work Order</th>
                                    <th className="">Work Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.documents.map((doc: any, i: number) => (
                                    <tr key={doc.id}>
                                        <td className="">{i + 1}</td>
                                        <td className="text-center py-1  p-1">
                                            {doc.wo_number}/AWP-INS/JKT/{doc.wo_year}
                                        </td>
                                        <td className="text-center py-1 p-1">{doc.location}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Signatures Section */}
                    <div className="px-2 avoid-break">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    {/* Submitted By */}
                                    <td className="w-1/2 px-4 border border-black">
                                        <p className="text-center font-bold underline mb-4">Submitted by:</p>
                                        <table className="w-full text-[11pt]">
                                            <tbody>
                                                <tr className="h-14">
                                                    <td className="border-none w-24">Signature</td>
                                                    <td className="border-none">: </td>
                                                </tr>
                                                <tr>
                                                    <td className="border-none">Name</td>
                                                    <td className="border-none">: {data.name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="border-none">Date</td>
                                                    <td className="border-none">: {formatDate(data.date)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>

                                    {/* Received By */}
                                    <td className="w-1/2 px-4 border border-black">
                                        <p className="text-center font-bold underline mb-4">Received by:</p>
                                        <table className="w-full text-[11pt]">
                                            <tbody>
                                                <tr className="h-14">
                                                    <td className="border-none w-24">Signature</td>
                                                    <td className="border-none">: </td>
                                                </tr>
                                                <tr>
                                                    <td className="border-none">Name</td>
                                                    <td className="border-none">: ......................................</td>
                                                </tr>
                                                <tr>
                                                    <td className="border-none">Date</td>
                                                    <td className="border-none">: ......................................</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <p className="mt-4 text-center italic font-bold text-[10pt]">
                            (Please sign on this transmittal after receiving the said document)
                        </p>
                    </div>
                </div>

                {/* Footer Alamat */}
                <footer className="mt-auto pt-4 border-t-2 border-black text-center text-[8pt] leading-tight">
                    <p className="font-bold">Graha Mas Fatmawati Blok B 15, Jl. RS. Fatmawati Kav. 71</p>
                    <p>Cipete Utara Kebayoran Baru, Jakarta 12150 - Phone (62-21)72800322, 7210761, 7210852 Fax. (62-21) 7255428</p>
                    <p>Email: ptawp@cbn.net.id</p>
                </footer>
            </div>
        </div>
    );
}