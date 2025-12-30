"use client";

import { getDeliveryNoteById } from "@/lib/delivery-notes";
import { use, useEffect, useState } from "react";

export default function DeliveryNotePrintPage({ params }: { params: Promise<{ id: number }> }) {
    const { id } = use(params);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Sesuai interface GetbyIdDeliveryNoteDetails yang Anda berikan
                
                // Ganti dengan call API asli:
                const res = await getDeliveryNoteById(id);
                setData(res.data);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading || !data) return <div className="p-10 text-center font-sans">Loading Surat Jalan...</div>;

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
                }
                .all-cell-borders table {
                    border-collapse: collapse;
                    width: 100%;
                }
                .all-cell-borders th, 
                .all-cell-borders td {
                    border: 0.5px solid black !important;
                    padding: 6px 8px;
                }
                `}
            </style>

            {/* Modal Print Kontrol */}
            <div id="printModal" className="fixed top-5 right-5 w-72 z-50 no-print font-sans">
                <div className="bg-white shadow-xl border rounded-lg p-4 text-sm">
                    <h5 className="font-bold mb-2 text-blue-600 flex items-center gap-2">
                        <span>🚚</span> Surat Jalan
                    </h5>
                    <div className="flex gap-2">
                        <button onClick={() => window.history.back()} className="flex-1 bg-gray-200 py-1.5 rounded hover:bg-gray-300">Back</button>
                        <button onClick={() => window.print()} className="flex-1 bg-blue-600 text-white py-1.5 rounded font-bold hover:bg-blue-700">Print</button>
                    </div>
                </div>
            </div>

            {/* Kontainer Utama */}
            <div className="print-wrapper mx-auto bg-white shadow-lg w-[210mm] min-h-[297mm] p-[15mm] flex flex-col print:w-full print:p-0 font-sans text-[10pt]">

                <div className="grow">
                    {/* Header: Logo & Company Info */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-4">
                            <img src="/icon.png" alt="Logo" className="w-16 h-16 object-contain" />
                            <div>
                                <h1 className="text-lg font-bold leading-none">PT. ADIWARNA PRATAMA</h1>
                                <p className="text-[8pt] text-gray-600 leading-tight mt-1 whitespace-pre-line">
                                    GRAHAMAS FATMAWATI B-15{"\n"}
                                    CIPETE UTARA - KEBAYORAN BARU{"\n"}
                                    JAKARTA SELATAN 12150{"\n"}
                                    Telp : 021-72800322 Fax : 021-7255428
                                </p>
                            </div>
                        </div>
                        <div className="ml-[10%] mt-auto mr-auto">
                            <h2 className="text-base font-bold underline inline-block uppercase tracking-widest">Surat Jalan</h2>
                        </div>
                    </div>

                    {/* Informasi Atas: Customer & Document Details */}
                    <div className="grid grid-cols-2 gap-8 mb-6">
                        {/* Kolom Kiri: Customer */}
                        <div className="border border-black p-3 rounded-sm">
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="w-16 font-semibold align-top">Kepada</td>
                                        <td className="align-top">: <b>{data.customer}</b></td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold align-top">Alamat</td>
                                        <td className="align-top">: <span className="whitespace-pre-line">{data.customer_address}</span></td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold align-top pt-2">Attn</td>
                                        <td className="align-top pt-2">: {data.received_by || "Fill In"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Kolom Kanan: Dokumen */}
                        <div className="border border-black p-3 rounded-sm">
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="w-32 font-semibold">No. Surat</td>
                                        <td>: {data.delivery_note_no}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Tanggal</td>
                                        <td>: {formatDate(data.date)}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">No. WO</td>
                                        <td>: {data.wo_no}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Dikirim Dengan</td>
                                        <td>: {data.delivered_with || "-"}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Plat Kendaraan</td>
                                        <td>: {data.vehicle_plate || "-"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Tabel Barang */}
                    <div className="all-cell-borders mb-4">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-center uppercase text-[9pt] font-bold">
                                <tr>
                                    <th className="w-12">No</th>
                                    <th>Nama Barang</th>
                                    <th className="w-1/3">Serial Number</th>
                                    <th className="w-20">Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.length > 0 ? (
                                    data.items.map((item: any, idx: number) => (
                                        <tr key={item.id}>
                                            <td className="text-center">{idx + 1}</td>
                                            <td>{item.item_name}</td>
                                            <td>{item.serial_number || "-"}</td>
                                            <td className="text-center">{item.qty}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center italic py-4">No items listed.</td>
                                    </tr>
                                )}
                                {/* Baris Kosong Tambahan agar Tabel Terlihat Penuh (Opsional) */}
                                {[...Array(Math.max(0, 8 - data.items.length))].map((_, i) => (
                                    <tr key={`empty-${i}`} className="h-8">
                                        <td></td><td></td><td></td><td></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Catatan / Note */}
                    <div className="mb-8 border border-black p-2 min-h-[60px]">
                        <p className="font-bold underline text-[9pt] mb-1">Note:</p>
                        <p className="text-[9pt] italic">{data.notes || "Honeywell S/N: MA 219-005007 dan Altai S/N: 201909 tanpa box"}</p>
                    </div>

                    {/* Tanda Tangan */}
                    <div className="flex justify-between mt-10 px-4">
                        <div className="w-64 text-center">
                            <p className="mb-16">Diterima / Diketahui Oleh:</p>
                            <p className="font-bold underline uppercase">{data.received_by || "( ................................ )"}</p>
                        </div>
                        <div className="w-64 text-center">
                            <p className="mb-16">Disiapkan Oleh,{"\n"}<b>PT. ADIWARNA PRATAMA</b></p>
                            <p className="font-bold underline uppercase">{data.delivered_by || "( ................................ )"}</p>
                        </div>
                    </div>
                </div>

                {/* Footer Perusahaan */}
                <footer className="mt-auto pt-4 border-t-2 border-black text-center text-[7.5pt] leading-tight">
                    <p className="font-bold">Graha Mas Fatmawati Blok B 15, Jl. RS. Fatmawati Kav. 71</p>
                    <p>Cipete Utara Kebayoran Baru, Jakarta 12150 - Phone (62-21)72800322, 7210761, 7210852 Fax. (62-21) 7255428</p>
                    <p>Email: ptawp@cbn.net.id | Website: www.adiwarna.com</p>
                </footer>
            </div>
        </div>
    );
}