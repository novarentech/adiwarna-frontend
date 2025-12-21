"use client";
import { getQuotationsById, Quotation } from "@/lib/quotations";
import React, { useEffect, useState, use } from "react";

export default function QuotationPrintPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [data, setData] = useState<Quotation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getQuotationsById(id);
                setData(res.data);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading || !data) return <div className="p-10">Loading...</div>;

    const subtotal = data.items.reduce((acc, item) => acc + (parseFloat(item.quantity) * parseFloat(item.rate)), 0);
    const discountAmount = subtotal * (parseFloat(data.discount) / 100);
    const netTotal = subtotal - discountAmount;
    const vat = netTotal * 0.11;
    const grandTotal = netTotal + vat;

    const formatIDR = (val: number) => "Rp" + val.toLocaleString("id-ID", { minimumFractionDigits: 0 });

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
                    <h5 className="font-bold mb-2 text-blue-600 font-sans">Print</h5>
                    <p className="mb-4 font-sans">Back to the top first before printing!</p>
                    <div className="flex gap-2">
                        <button onClick={() => window.history.back()} className="flex-1 bg-red-500 text-white py-1 rounded">Back</button>
                        <button onClick={() => window.print()} className="flex-1 bg-blue-600 text-white py-1 rounded font-bold">Print</button>
                    </div>
                </div>
            </div>

            {/* Container Utama dengan Flexbox */}
            <div className="print-wrapper no-scrollbar   mx-auto bg-white shadow-lg w-[210mm] min-h-[297mm] p-[15mm] flex flex-col print:w-full print:p-0">
                
                {/* --- BAGIAN KONTEN (ATAS) --- */}
                <div className="flex-grow">
                    {/* Header Section */}
                    <header className="mb-4 all-cell-borders">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="w-[20%] text-center">
                                        <img src="/icon.png" alt="Logo" className="w-20 mx-auto" />
                                    </td>
                                    <td className="text-center">
                                        <h1 className="text-xl font-bold">PT. ADIWARNA PRATAMA</h1>
                                        <h2 className="text-lg font-semibold uppercase">Quotation</h2>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </header>

                    {/* Info Table */}
                    <div className="all-cell-borders mb-2 text-[8pt]">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="w-24 font-bold">Date</td>
                                    <td>{data.date}</td>
                                    <td className="w-1/2 font-semibold text-right text-[10pt]">Ref. : {data.ref_no}/AWP-INS/{data.ref_year}</td>
                                </tr>
                                <tr>
                                    <td className="align-top font-bold text-sm text-[8pt]">TO: <br /> Attn:</td>
                                    <td colSpan={2}>
                                        <span className="font-bold">{data.customer.name}</span> <br />
                                        {data.pic_name}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-bold">Subject</td>
                                    <td colSpan={2}>{data.subject}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mb-2 text-[8pt]">
                        <p className="font-bold mb-1 italic">Dear {data.pic_name},</p>
                        <p>With reference to your above request, we are pleased in submitting our quotation for your consideration.</p>
                    </div>

                    {/* Section A - Tabel Scope */}
                    <h3 className="font-bold underline mb-2 italic text-[8pt]">A. Scope of works and Price:</h3>
                    <div className="all-cell-borders mb-4 text-[10pt]">
                        <table className="w-full">
                            <thead className="text-center font-bold bg-gray-50 uppercase text-[8pt]">
                                <tr>
                                    <th className="w-10">No</th>
                                    <th className="text-left">Scope / Description</th>
                                    <th className="w-12">Qty</th>
                                    <th className="w-16">Unit</th>
                                    <th className="w-24">Rate</th>
                                    <th className="w-28">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.map((item: any, i: number) => (
                                    <tr key={item.id} className="text-[8pt]">
                                        <td className="text-center">{i + 1}</td>
                                        <td className="text-left">{item.description}</td>
                                        <td className="text-center">{item.quantity}</td>
                                        <td className="text-center">{item.unit}</td>
                                        <td className="text-right">{formatIDR(Number(item.rate))}</td>
                                        <td className="text-right">{formatIDR(Number(item.quantity) * Number(item.rate))}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="font-bold text-[8pt]">
                                <tr>
                                    <td colSpan={5} className="text-right">Sub Total</td>
                                    <td className="text-right">{formatIDR(subtotal)}</td>
                                </tr>
                                <tr>
                                    <td colSpan={5} className="text-right">Discount {data.discount}%</td>
                                    <td className="text-right">{formatIDR(discountAmount)}</td>
                                </tr>
                                <tr>
                                    <td colSpan={5} className="text-right font-black">NET TOTAL</td>
                                    <td className="text-right">{formatIDR(netTotal)}</td>
                                </tr>
                                <tr>
                                    <td colSpan={5} className="text-right">VAT 11%</td>
                                    <td className="text-right">{formatIDR(vat)}</td>
                                </tr>
                                <tr className="bg-gray-100 uppercase font-black text-[9pt]">
                                    <td colSpan={5} className="text-right">Grand Total</td>
                                    <td className="text-right">{formatIDR(grandTotal)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Section B - Kondisi */}
                    <div className="avoid-break mb-4">
                        <h3 className="font-bold underline mb-2 italic text-[8pt]">B. Conditions:</h3>
                        <ol className="list-[lower-alpha] ml-6 space-y-1 text-[8pt]">
                            <li>PT. Adiwarna Pratama to provide:
                                <ul className="list-decimal ml-6 mt-0.5">
                                    {data.adiwarnas.map((adi: any, i: number) => (
                                        <li key={i}>{adi.adiwarna_description}</li>
                                    ))}
                                </ul>
                            </li>
                            <li>{data.customer.name} at own cost to Provide:
                                <ul className="list-decimal ml-6 mt-0.5">
                                    {data.clients.map((cli: any, i: number) => (
                                        <li key={i}>{cli.client_description}</li>
                                    ))}
                                </ul>
                            </li>
                            <li>Terms of Payment: {data.top} days after receiving our invoice(s)</li>
                            <li>This quotation is valid for {data.valid_until} days from the date of issuance</li>
                            {data.clause && <li>{data.clause}</li>}
                            {data.workday && <li>Workdays: {data.workday}</li>}
                        </ol>
                    </div>

                    <p className="mb-6 text-[8pt]">We trust that the above prices and conditions will meet your requirements and thank you for the opportunity to being of service to your company.</p>

                    {/* Signature */}
                    <div className="w-64 leading-tight text-[8pt] avoid-break">
                        <p>Yours Faithfully,</p>
                        <p className="font-bold mb-16 uppercase">PT. Adiwarna Pratama</p>
                        <p className="font-bold underline uppercase">{data.auth_name}</p>
                        <p className="italic">{data.auth_position}</p>
                    </div>
                </div>

                {/* --- FOOTER (SELALU DI BAWAH) --- */}
                <footer className="mt-auto pt-4 border-t-2 border-black text-center text-[8pt] leading-tight no-break">
                    <p className="font-bold">Graha Mas Fatmawati Blok B 15, Jl. RS. Fatmawati Kav. 71</p>
                    <p>Cipete Utara Kebayoran Baru, Jakarta 12150 - Phone (62-21)72800322, 7210761, 7210852 Fax. (62-21) 7255428</p>
                    <p>Email: ptawp@cbn.net.id</p>
                </footer>
            </div>
        </div>
    );
}