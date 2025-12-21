"use client";

import { getWorkAssignmentById, WorkAssignment } from "@/lib/work-assignment";
import { use, useEffect, useState } from "react";
// Import helper/api sesuai struktur projectmu
// import { getWorkAssignmentById } from "@/lib/work-assignment";

export default function WorkAssignmentPrintPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [data, setData] = useState<WorkAssignment | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getWorkAssignmentById(id);
                setData(res.data);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading || !data) return <div className="p-10 text-center">Loading Work Assignment...</div>;

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
                    padding: 2px px;
                }
                input[type="checkbox"] {
                    width: 18px;
                    height: 18px;
                    cursor: default;
                }
                `}
            </style>

            {/* Modal Menu */}
            <div id="printModal" className="fixed top-5 right-5 w-72 z-50 no-print">
                <div className="bg-white shadow-xl border rounded-lg p-4 text-sm">
                    <h5 className="font-bold mb-2 text-blue-600 flex items-center gap-2">
                        <span>📋</span> Work Assignment
                    </h5>
                    <p className="mb-4 text-gray-600 text-xs">Pastikan tampilan sudah sesuai sebelum mencetak.</p>
                    <div className="flex gap-2">
                        <button onClick={() => window.history.back()} className="flex-1 bg-gray-200 py-1.5 rounded hover:bg-gray-300 transition">Back</button>
                        <button onClick={() => window.print()} className="flex-1 bg-blue-600 text-white py-1.5 rounded font-bold hover:bg-blue-700 transition">Print</button>
                    </div>
                </div>
            </div>

            {/* Container Utama (A4) */}
            <div className="print-wrapper no-scrollbar mx-auto bg-white shadow-lg w-[210mm] min-h-[297mm] p-[15mm] flex flex-col print:w-full print:p-0 font-serif">

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
                                        <h2 className="text-lg font-semibold uppercase tracking-wider">Work Assignment</h2>
                                    </td>
                                    <td className="border border-black text-[8pt] p-1">Doc. No.</td>
                                    <td className="border border-black text-[8pt] p-1 font-bold">: FM-MKT-02</td>
                                </tr>
                                <tr>
                                    <td className="border border-black text-[8pt] p-1">Rev. No./Date</td>
                                    <td className="border border-black text-[8pt] p-1 font-bold">: 01/28 Dec 2018</td>
                                </tr>
                            </tbody>
                        </table>
                    </header>

                    {/* Assignment No & Date */}
                    <div className="flex justify-between text-[11pt] mb-2 px-1">
                        <span>No. : <b>{data.assignment_no}/AWP-INS/{data.assignment_year}</b></span>
                        <span>Date : {formatDate(data.date)}</span>
                    </div>

                    <p className="text-[11pt] mb-0.5 px-1">This assignment is issued to:</p>

                    {/* Worker List */}
                    <div className="mb-2 px-6 text-[11pt]">
                        <table className="w-full border-none">
                            <tbody>
                                {data.workers.map((worker: any, i: number) => (
                                    <tr key={worker.id}>
                                        <td className="w-8 py-0.5">{i + 1}.</td>
                                        <td className="w-1/2 py-0.5 font-bold">{worker.worker_name}</td>
                                        <td className="py-0.5">: {worker.position}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="text-[11pt] mb-4 px-1 leading-relaxed text-justify">
                        The above mentioned personnel hereby authorized to perform the works / services
                        on behalf of PT. Adiwarna Pratama for the following:
                    </p>

                    {/* Work Details */}
                    <div className="mb-3 px-1 text-[11pt]">
                        <table className="w-full border-separate border-spacing-y-0.5">
                            <tbody>
                                <tr>
                                    <td className="w-44 align-top">Ref AWP WO No.</td>
                                    <td className="align-top">: <b>{data.ref_no}/AWP-INS/JKT/{data.ref_year}</b></td>
                                </tr>
                                <tr>
                                    <td className="align-top">Customer</td>
                                    <td className="align-top">: {data.customer.name}</td>
                                </tr>
                                <tr>
                                    <td className="align-top">Ref. PO./Instruction</td>
                                    <td className="align-top">: {data.ref_po_no_instruction || "-"}</td>
                                </tr>
                                <tr>
                                    <td className="align-top">Work Location</td>
                                    <td className="align-top">: {data?.customer?.address || "-"}</td>
                                </tr>
                                <tr>
                                    <td className="align-top">Scope of Works</td>
                                    <td className="align-top">: {data.scope}</td>
                                </tr>
                                <tr>
                                    <td className="align-top">Estimate Duration</td>
                                    <td className="align-top">: {data.estimation}</td>
                                </tr>
                                <tr>
                                    <td className="align-top">Mobilization</td>
                                    <td className="align-top">: {formatDate(data.mobilization)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Feedback Section */}
                    <div className="avoid-break mt-6">
                        <div className="flex items-center gap-5 mb-2 px-1">
                            <h3 className="font-bold italic text-[11pt] underline">Customer Response/Feed Back:</h3>
                            <div className="flex gap-12 text-[10pt] font-bold underline italic ml-auto mr-6">
                                <span>E</span><span>G</span><span>F</span><span>P</span>
                            </div>
                        </div>

                        <table className="w-full text-[10pt] italic">
                            <tbody>
                                {[
                                    "Team / personnel the works / service in time",
                                    "Personnel / Team capabilities meet your requirements",
                                    "Team / personnel performed the works work effectively",
                                    "Team / personnel follow your HSE requirement",
                                    "Job performance fulfill / meet your requirements"
                                ].map((text, idx) => (
                                    <tr key={idx} className="h-4">
                                        <td className="w-[65%]">{idx + 1}. {text}</td>
                                        <td className="text-center w-8"><input type="checkbox" /></td>
                                        <td className="text-center w-8"><input type="checkbox" /></td>
                                        <td className="text-center w-8"><input type="checkbox" /></td>
                                        <td className="text-center w-8"><input type="checkbox" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex gap-8 text-[9pt] italic mt-1.5 px-1 opacity-80">
                            <span>Notes:</span>
                            <span>E = Excellent</span>
                            <span>G = Good</span>
                            <span>F = Fair</span>
                            <span>P = Poor</span>
                        </div>
                    </div>

                    {/* Acknowledgment Section */}
                    <div className="mt-8 avoid-break px-1 text-[11pt]">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="w-1/2 font-bold">Acknowledged by</td>
                                    <td className="w-1/6"></td>
                                    <td className="font-bold text-center underline">PT. Adiwarna Pratama</td>
                                </tr>
                                <tr className="h-6">
                                    <td className="font-bold">{data.customer.name}</td>
                                    <td colSpan={2}></td>
                                </tr>
                                <tr className="h-8">
                                    <td>Signature <span className="ml-[14%]">: ............................................</span></td>
                                    <td colSpan={2}></td>
                                </tr>
                                <tr className="h-8">
                                    <td>Name <span className="ml-[20%]">: ............................................</span></td>
                                    <td colSpan={2}></td>
                                </tr>
                                <tr className="h-8">
                                    <td>Starting date <span className="ml-[8.5%]">: ............................................</span></td>
                                    <td colSpan={2}></td>
                                </tr>
                                <tr className="h-8">
                                    <td>Completion date <span className="ml-[2%]">: ............................................</span></td>
                                    <td></td>
                                    <td className="text-center align-bottom">
                                        <p className="font-bold underline uppercase">{data.auth_name || 'Supriyadi'}</p>
                                        <p className="font-bold text-[10pt]">{data.auth_pos || 'Oprt. Manager'}</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Alamat */}
                <footer className="mt-auto pt-4 border-t-2 border-black text-center text-[8pt] leading-tight no-break">
                    <p className="font-bold">Graha Mas Fatmawati Blok B 15, Jl. RS. Fatmawati Kav. 71</p>
                    <p>Cipete Utara Kebayoran Baru, Jakarta 12150 - Phone (62-21)72800322, 7210761, 7210852 Fax. (62-21) 7255428</p>
                    <p>Email: ptawp@cbn.net.id</p>
                </footer>
            </div>
        </div>
    );
}