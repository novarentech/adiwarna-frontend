// "use client";
// import Image from "next/image";
// import { useState } from "react";

// export default function QuotationPage({ params }: { params: { id: string } }) {
//     // Dummy data (ganti nanti dengan fetch API berdasarkan params.id)
//     const quotation = {
//         id: params.id,
//         date: "2025-01-20",
//         ref_no: "001",
//         ref_year: "2025",
//         customer: { name: "PT Dummy Customer" },
//         pic_name: "John Doe",
//         subject: "Installation Work",
//         discount: 10,
//         top: 30,
//         valid_until: 14,
//         clause: "Work includes installation guarantee.",
//         workday: "Working days: Monday–Friday",
//         auth_name: "Mr. Dummy Authorizer",
//         auth_position: "Director",
//         quotationItems: [
//             { description: "Installation Service", quantity: 2, unit: "Job", rate: 1500000 },
//             { description: "Material Supply", quantity: 5, unit: "Unit", rate: 500000 }
//         ],
//         quotationAdiwarnas: [
//             { adiwarna_description: "Provide manpower" },
//             { adiwarna_description: "Provide materials" }
//         ],
//         quotationClients: [
//             { client_description: "Provide site access" },
//             { client_description: "Provide electricity" }
//         ]
//     };

//     const [showModal, setShowModal] = useState(true);

//     const subtotal = quotation.quotationItems.reduce(
//         (sum, i) => sum + i.quantity * i.rate,
//         0
//     );

//     const discount = subtotal * (quotation.discount / 100);
//     const net = subtotal - discount;
//     const vat = net * 0.11;
//     const total = net + vat;

//     const handlePrint = () => {
//         setShowModal(false);
//         setTimeout(() => {
//             window.print();
//             setShowModal(true);
//         }, 200);
//     };

//     return (
//         <div className="relative bg-white text-black print:m-0">
//             {/* ------------ PRINT MODAL ------------ */}
//             {showModal && (
//                 <div className="fixed top-5 right-5 bg-white shadow-xl rounded-lg border p-4 z-50 print:hidden w-72">
//                     <h2 className="font-semibold text-lg flex items-center gap-2">
//                         <span className="text-blue-600">ℹ️</span>
//                         Print
//                     </h2>
//                     <p className="mt-2 text-sm">
//                         Scroll ke bagian paling atas sebelum mencetak!
//                     </p>

//                     <div className="flex gap-2 mt-4">
//                         <button
//                             onClick={() => history.back()}
//                             className="flex-1 bg-red-600 text-white px-3 py-2 rounded"
//                         >
//                             Back
//                         </button>
//                         <button
//                             onClick={handlePrint}
//                             className="flex-1 bg-blue-600 text-white px-3 py-2 rounded"
//                         >
//                             Print
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* ------------ HEADER ------------ */}
//             <div className="page-header fixed top-0 w-full text-center">
//                 <div className="flex justify-center mt-2">
//                     <table className="border border-black w-[95%] text-[16px] border-collapse all-cell-borders">
//                         <tbody>
//                             <tr>
//                                 <th className="border p-2 w-[10%]">
//                                     <Image
//                                         src="/logo.jpeg"
//                                         width={150}
//                                         height={120}
//                                         alt="Logo"
//                                         className="mx-auto"
//                                     />
//                                 </th>
//                                 <th className="border p-2">
//                                     <h2 className="text-center text-xl font-bold">
//                                         PT. ADIWARNA PRATAMA <br /> Quotation
//                                     </h2>
//                                 </th>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* Spacing for print */}
//             <div className="page-header-space h-[130px]" />

//             {/* ------------ CONTENT ------------ */}
//             <div className="px-4">
//                 {/* TOP TABLE */}
//                 <table className="border border-black w-full text-[14pt] border-collapse all-cell-borders mb-4">
//                     <tbody>
//                         <tr>
//                             <th className="border p-2 w-[10%]">Date</th>
//                             <td className="border p-2">
//                                 {new Date(quotation.date).toLocaleDateString("en-GB")}
//                             </td>
//                             <td className="border p-2 w-[40%]">
//                                 Ref: {quotation.ref_no}/AWP-INS/{quotation.ref_year}
//                             </td>
//                         </tr>

//                         <tr>
//                             <td className="border p-2">
//                                 TO: <br /> Attn:
//                             </td>
//                             <td className="border p-2" colSpan={2}>
//                                 {quotation.customer.name} <br /> {quotation.pic_name}
//                             </td>
//                         </tr>

//                         <tr>
//                             <td className="border p-2">Subject</td>
//                             <td className="border p-2" colSpan={2}>
//                                 {quotation.subject}
//                             </td>
//                         </tr>
//                     </tbody>
//                 </table>

//                 <p className="text-[14pt] ml-1">
//                     <strong>Dear {quotation.pic_name}</strong>
//                 </p>

//                 <p className="text-[14pt] ml-1">
//                     With reference to your above request, we are pleased in submitting our
//                     quotation for your consideration.
//                 </p>

//                 <h6 className="text-[14pt] font-bold ml-1 mt-2">
//                     A. Scope of Works and Price:
//                 </h6>

//                 {/* Scope Table */}
//                 <table className="border border-black w-full text-[14pt] border-collapse text-center mt-2 all-cell-borders">
//                     <thead>
//                         <tr>
//                             <th className="border p-1 w-[60px]">No</th>
//                             <th className="border p-1">Scope / Description</th>
//                             <th className="border p-1 w-[70px]">Qty</th>
//                             <th className="border p-1 w-[100px]">Unit</th>
//                             <th className="border p-1 w-[120px]">Rate</th>
//                             <th className="border p-1 w-[120px]">Total</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {quotation.quotationItems.map((item, index) => {
//                             const itemTotal = item.quantity * item.rate;
//                             return (
//                                 <tr key={index}>
//                                     <td className="border p-1">{index + 1}</td>
//                                     <td className="border p-1">{item.description}</td>
//                                     <td className="border p-1">{item.quantity}</td>
//                                     <td className="border p-1">{item.unit}</td>
//                                     <td className="border p-1">
//                                         Rp{item.rate.toLocaleString("id-ID")}
//                                     </td>
//                                     <td className="border p-1">
//                                         Rp{itemTotal.toLocaleString("id-ID")}
//                                     </td>
//                                 </tr>
//                             );
//                         })}
//                     </tbody>

//                     <tfoot className="text-[14pt]">
//                         <tr>
//                             <td colSpan={5} className="text-right border p-1 font-semibold">
//                                 Subtotal
//                             </td>
//                             <td className="border p-1">
//                                 Rp{subtotal.toLocaleString("id-ID")}
//                             </td>
//                         </tr>

//                         <tr>
//                             <td colSpan={5} className="text-right border p-1">
//                                 Discount {quotation.discount}%
//                             </td>
//                             <td className="border p-1">
//                                 Rp{discount.toLocaleString("id-ID")}
//                             </td>
//                         </tr>

//                         <tr>
//                             <td colSpan={5} className="text-right border p-1">
//                                 Net Total
//                             </td>
//                             <td className="border p-1">
//                                 Rp{net.toLocaleString("id-ID")}
//                             </td>
//                         </tr>

//                         <tr>
//                             <td colSpan={5} className="text-right border p-1">
//                                 VAT 11%
//                             </td>
//                             <td className="border p-1">
//                                 Rp{vat.toLocaleString("id-ID")}
//                             </td>
//                         </tr>

//                         <tr>
//                             <td colSpan={5} className="text-right border p-1 font-bold">
//                                 Total
//                             </td>
//                             <td className="border p-1 font-bold">
//                                 Rp{total.toLocaleString("id-ID")}
//                             </td>
//                         </tr>
//                     </tfoot>
//                 </table>

//                 <h6 className="text-[14pt] font-bold ml-1 mt-4">
//                     B. Conditions:
//                 </h6>

//                 <ol className="text-[14pt] ml-6 list-[lower-alpha]">
//                     <li>
//                         PT. Adiwarna Pratama to provide:
//                         <ol className="list-decimal ml-5">
//                             {quotation.quotationAdiwarnas.map((a, idx) => (
//                                 <li key={idx}>{a.adiwarna_description}</li>
//                             ))}
//                         </ol>
//                     </li>

//                     <li>
//                         {quotation.customer.name} at own cost to provide:
//                         <ol className="list-decimal ml-5">
//                             {quotation.quotationClients.map((c, idx) => (
//                                 <li key={idx}>{c.client_description}</li>
//                             ))}
//                         </ol>
//                     </li>

//                     <li>Terms of Payment: Net {quotation.top} days</li>
//                     <li>Quotation valid for {quotation.valid_until} days</li>

//                     {quotation.clause && <li>{quotation.clause}</li>}
//                     {quotation.workday && <li>{quotation.workday}</li>}
//                 </ol>

//                 <p className="text-[14pt] ml-1 mt-3">
//                     We trust that the above prices and conditions will meet your
//                     requirements.
//                 </p>

//                 <p className="text-[14pt] ml-1 mt-6">
//                     Yours faithfully, <br />
//                     PT. Adiwarna Pratama <br />
//                     <br />
//                     <br />
//                     <br />
//                     {quotation.auth_name} <br />
//                     {quotation.auth_position}
//                 </p>
//             </div>

//             {/* ------------ FOOTER ------------ */}
//             <div className="page-footer fixed bottom-0 w-full text-center border-t-4 border-black">
//                 <p className="text-[14px] mt-2 leading-tight">
//                     <strong>
//                         Graha Mas Fatmawati Blok B 15, Jl. RS. Fatmawati Kav. 71
//                     </strong>
//                     <br />
//                     <small>
//                         Cipete Utara Kebayoran Baru, Jakarta 12150 - Phone (62-21) 72800322,
//                         7210761, 7210852 Fax. (62-21) 7255428, Email: ptawp@cbn.net.id
//                     </small>
//                 </p>
//             </div>

//             <div className="page-footer-space h-[80px]" />
//         </div>
//     );
// }
"use client";
// import React from "react";

// const quotationDummy = {
//     date: "2025-11-20",
//     ref_no: "001",
//     ref_year: "2025",
//     customer: { name: "PT. Contoh Customer" },
//     pic_name: "Budi Santoso",
//     subject: "Quotation for Office Supplies",
//     top: 30,
//     valid_until: 30,
//     clause: "Special clause here",
//     workday: "Workday info here",
//     auth_name: "John Doe",
//     auth_position: "Manager",
//     discount: 5,
//     quotationItems: [
//         { description: "Item 1", quantity: 2, unit: "pcs", rate: 50000 },
//         { description: "Item 2", quantity: 5, unit: "pcs", rate: 75000 },
//     ],
//     quotationAdiwarnas: [
//         { adiwarna_description: "Provide installation service" },
//     ],
//     quotationClients: [
//         { client_description: "Provide access to site" },
//     ],
// };

// const QuotationPage: React.FC = () => {
//     const quotations = quotationDummy;

//     const subtotal = quotations.quotationItems.reduce(
//         (acc, item) => acc + item.quantity * item.rate,
//         0
//     );
//     const discount = (quotations.discount ?? 0) / 100 * subtotal;
//     const net = subtotal - discount;
//     const vat = net * 0.11;
//     const total = net + vat;

//     const printAndHideModal = () => {
//         const modal = document.getElementById("printModal");
//         if (modal) modal.style.display = "none";
//         window.print();
//         if (modal) modal.style.display = "block";
//     };

//     return (
//         <div className="relative">
//             {/* Print Modal */}
//             <div
//                 id="printModal"
//                 className="fixed top-5 right-5 w-80 z-50 block"
//             >
//                 <div className="bg-white shadow rounded-lg">
//                     <div className="p-3 border-b flex items-center gap-2">
//                         <svg
//                             className="w-5 h-5 text-blue-500"
//                             fill="currentColor"
//                             viewBox="0 0 20 20"
//                         >
//                             <path
//                                 fillRule="evenodd"
//                                 d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-9 4a1 1 0 102 0V10a1 1 0 10-2 0v4zm0-6a1 1 0 100-2 1 1 0 000 2z"
//                                 clipRule="evenodd"
//                             />
//                         </svg>
//                         <h5 className="text-lg font-semibold">Print</h5>
//                     </div>
//                     <div className="p-3">Back to the top first before printing!</div>
//                     <div className="p-3 flex justify-center gap-2">
//                         <button
//                             onClick={() => window.history.back()}
//                             className="bg-red-500 text-white py-1 px-3 rounded flex-1"
//                         >
//                             Back
//                         </button>
//                         <button
//                             onClick={printAndHideModal}
//                             className="bg-blue-500 text-white py-1 px-3 rounded flex-1"
//                         >
//                             Print
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Header */}
//             <div className="fixed top-0 w-full h-[130px] bg-white z-20 flex justify-center items-center">
//                 <table className="table-auto border border-black border-collapse text-center text-lg w-[95%]">
//                     <tbody>
//                         <tr>
//                             <td className="border border-black w-1/6 p-2">
//                                 <img
//                                     src="/logo.jpeg"
//                                     alt="Logo"
//                                     className="mx-auto w-36"
//                                 />
//                             </td>
//                             <td className="border border-black p-2">
//                                 <h2 className="text-center font-bold">
//                                     PT. ADIWARNA PRATAMA <br /> Quotation
//                                 </h2>
//                             </td>
//                         </tr>
//                     </tbody>
//                 </table>
//             </div>

//             {/* Footer */}
//             <div className="fixed bottom-0 w-full h-[80px] border-t-4 border-black text-center text-sm p-2">
//                 <p>
//                     <strong>Graha Mas Fatmawati Blok B 15, Jl. RS. Fatmawati Kav. 71</strong>
//                     <br />
//                     Cipete Utara Kebayoran Baru, Jakarta 12150 - Phone (62-21)72800322, 7210761, 7210852 Fax. (62-21) 7255428, Email: ptawp@cbn.net.id
//                 </p>
//             </div>

//             {/* Content */}
//             <div className="pt-[140px] pb-[90px] px-2">
//                 <table className="table-auto border border-black border-collapse w-full mb-4 text-base">
//                     <tbody>
//                         <tr>
//                             <th className="border border-black p-1 w-1/6">Date</th>
//                             <td className="border border-black p-1">{quotations.date}</td>
//                             <td className="border border-black p-1 w-2/6">
//                                 Ref. : {quotations.ref_no}/AWP-INS/{quotations.ref_year}
//                             </td>
//                         </tr>
//                         <tr>
//                             <th className="border border-black p-1">TO: <br /> Attn:</th>
//                             <td className="border border-black p-1" colSpan={2}>
//                                 {quotations.customer.name} <br /> {quotations.pic_name}
//                             </td>
//                         </tr>
//                         <tr>
//                             <th className="border border-black p-1">Subject</th>
//                             <td className="border border-black p-1" colSpan={2}>
//                                 {quotations.subject}
//                             </td>
//                         </tr>
//                     </tbody>
//                 </table>

//                 <p className="text-base mb-2"><strong>Dear {quotations.pic_name}</strong></p>
//                 <p className="text-base mb-2">
//                     With reference to your above request, we are pleased in submitting our quotation for your consideration.
//                 </p>

//                 <h6 className="font-bold mb-2">A. Scope of works and Price:</h6>

//                 <table className="table-auto border border-black border-collapse w-full text-center mb-4 text-base">
//                     <thead>
//                         <tr>
//                             <th className="border border-black p-1 w-[50px]">No</th>
//                             <th className="border border-black p-1">Scope / Description</th>
//                             <th className="border border-black p-1 w-[50px]">Qty</th>
//                             <th className="border border-black p-1 w-[50px]">Unit</th>
//                             <th className="border border-black p-1 w-[100px]">Rate</th>
//                             <th className="border border-black p-1 w-[100px]">Total</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {quotations.quotationItems.map((item, idx) => {
//                             const totalItem = item.quantity * item.rate;
//                             return (
//                                 <tr key={idx}>
//                                     <td className="border border-black p-1">{idx + 1}</td>
//                                     <td className="border border-black p-1">{item.description}</td>
//                                     <td className="border border-black p-1">{item.quantity}</td>
//                                     <td className="border border-black p-1">{item.unit}</td>
//                                     <td className="border border-black p-1">Rp{item.rate.toLocaleString()}</td>
//                                     <td className="border border-black p-1">Rp{totalItem.toLocaleString()}</td>
//                                 </tr>
//                             );
//                         })}
//                     </tbody>
//                     <tfoot>
//                         <tr>
//                             <td className="border border-black p-1 text-right" colSpan={5}>Sub Total</td>
//                             <td className="border border-black p-1">Rp{subtotal.toLocaleString()}</td>
//                         </tr>
//                         <tr>
//                             <td className="border border-black p-1 text-right" colSpan={5}>Discount {quotations.discount ?? 0}%</td>
//                             <td className="border border-black p-1">Rp{discount.toLocaleString()}</td>
//                         </tr>
//                         <tr>
//                             <td className="border border-black p-1 text-right" colSpan={5}>Net Total</td>
//                             <td className="border border-black p-1">Rp{net.toLocaleString()}</td>
//                         </tr>
//                         <tr>
//                             <td className="border border-black p-1 text-right" colSpan={5}>VAT 11%</td>
//                             <td className="border border-black p-1">Rp{vat.toLocaleString()}</td>
//                         </tr>
//                         <tr>
//                             <td className="border border-black p-1 text-right font-bold" colSpan={5}>Total</td>
//                             <td className="border border-black p-1 font-bold">Rp{total.toLocaleString()}</td>
//                         </tr>
//                     </tfoot>
//                 </table>

//                 <h6 className="font-bold mb-2">B. Conditions:</h6>
//                 <ol className="list-decimal ml-4 text-base">
//                     <li>
//                         PT. Adiwarna Pratama to provide:
//                         <ol className="list-decimal ml-4">
//                             {quotations.quotationAdiwarnas.map((adi, idx) => (
//                                 <li key={idx}>{adi.adiwarna_description}</li>
//                             ))}
//                         </ol>
//                     </li>
//                     <li>
//                         {quotations.customer.name} at own cost to Provide:
//                         <ol className="list-decimal ml-4">
//                             {quotations.quotationClients.map((client, idx) => (
//                                 <li key={idx}>{client.client_description}</li>
//                             ))}
//                         </ol>
//                     </li>
//                     <li>Terms of Payment: Net {quotations.top} days after receiving our invoice(s)</li>
//                     <li>This quotation is valid for {quotations.valid_until} days from the date of issuance</li>
//                     {quotations.clause && <li>{quotations.clause}</li>}
//                     {quotations.workday && <li>{quotations.workday}</li>}
//                 </ol>

//                 <p className="text-base mt-2">
//                     We trust that the above prices and conditions will meet your requirements and thank you for the opportunity to being of service to your company.
//                 </p>
//                 <p className="text-base mt-2">
//                     Yours Faithfully, <br />
//                     PT. Adiwarna Pratama <br /><br /><br /><br />
//                     {quotations.auth_name} <br />
//                     {quotations.auth_position}
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default QuotationPage;


// import React from "react";

// const quotationDummy = {
//     date: "2025-11-20",
//     ref_no: "001",
//     ref_year: "2025",
//     customer: { name: "PT. Contoh Customer" },
//     pic_name: "Budi Santoso",
//     subject: "Quotation for Office Supplies",
//     top: 30,
//     valid_until: 30,
//     clause: "Special clause here",
//     workday: "Workday info here",
//     auth_name: "John Doe",
//     auth_position: "Manager",
//     discount: 5,
//     quotationItems: [
//         { description: "Item 1", quantity: 2, unit: "pcs", rate: 50000 },
//         { description: "Item 2", quantity: 5, unit: "pcs", rate: 75000 },
//     ],
//     quotationAdiwarnas: [
//         { adiwarna_description: "Provide installation service" },
//     ],
//     quotationClients: [
//         { client_description: "Provide access to site" },
//     ],
// };

// const QuotationPage: React.FC = () => {
//     const quotations = quotationDummy;

//     const subtotal = quotations.quotationItems.reduce(
//         (acc, item) => acc + item.quantity * item.rate,
//         0
//     );
//     const discount = (quotations.discount ?? 0) / 100 * subtotal;
//     const net = subtotal - discount;
//     const vat = net * 0.11;
//     const total = net + vat;

//     const printAndHideModal = () => {
//         const modal = document.getElementById("printModal");
//         if (modal) modal.style.display = "none";
//         window.print();
//         if (modal) modal.style.display = "block";
//     };

//     return (
//         <>
//             <style>
//                 {`
//           @page {
//             margin: 15mm 15mm 20mm 15mm;
//           }
//           @media print {
//             body {
//               margin: 0;
//               -webkit-print-color-adjust: exact;
//             }
//             #printModal {
//               display: none !important;
//             }
//           }
//           table {
//             border-collapse: collapse;
//           }
//           th, td {
//             border: 1px solid black;
//             padding: 6px 8px;
//             line-height: 1.2;
//           }
//           th {
//             font-weight: 700;
//           }
//         `}
//             </style>

//             {/* Print Modal */}
//             <div
//                 id="printModal"
//                 className="fixed top-5 right-5 w-80 z-50 block"
//             >
//                 <div className="bg-white shadow rounded-lg">
//                     <div className="p-3 border-b flex items-center gap-2">
//                         <svg
//                             className="w-5 h-5 text-blue-500"
//                             fill="currentColor"
//                             viewBox="0 0 20 20"
//                         >
//                             <path
//                                 fillRule="evenodd"
//                                 d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-9 4a1 1 0 102 0V10a1 1 0 10-2 0v4zm0-6a1 1 0 100-2 1 1 0 000 2z"
//                                 clipRule="evenodd"
//                             />
//                         </svg>
//                         <h5 className="text-lg font-semibold">Print</h5>
//                     </div>
//                     <div className="p-3">Back to the top first before printing!</div>
//                     <div className="p-3 flex justify-center gap-2">
//                         <button
//                             onClick={() => window.history.back()}
//                             className="bg-red-500 text-white py-1 px-3 rounded flex-1"
//                         >
//                             Back
//                         </button>
//                         <button
//                             onClick={printAndHideModal}
//                             className="bg-blue-500 text-white py-1 px-3 rounded flex-1"
//                         >
//                             Print
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Header */}
//             <header className="text-center mb-4">
//                 <table className="mx-auto w-full w-full" style={{ borderCollapse: "collapse" }}>
//                     <tbody>
//                         <tr>
//                             <td
//                                 style={{
//                                     width: "120px",
//                                     verticalAlign: "middle",
//                                     border: "none",
//                                     padding: 0,
//                                     textAlign: "center",
//                                 }}
//                             >
//                                 {/* Pakai link logo placeholder supaya muncul */}
//                                 <img
//                                     src="https://via.placeholder.com/120x80?text=Logo"
//                                     alt="Logo"
//                                     style={{ maxWidth: "120px" }}
//                                 />
//                             </td>
//                             <td
//                                 style={{
//                                     verticalAlign: "middle",
//                                     borderBottom: "1px solid black",
//                                     paddingBottom: "0.3rem",
//                                 }}
//                             >
//                                 <h2 className="font-bold text-xl">PT. ADIWARNA PRATAMA</h2>
//                                 <p className="font-semibold">Quotation</p>
//                             </td>
//                         </tr>
//                     </tbody>
//                 </table>
//             </header>

//             {/* Main content */}
//             <main className="w-full mx-auto text-sm leading-tight" style={{ fontFamily: "Arial, sans-serif" }}>
//                 <table className="w-full mb-4" style={{ borderCollapse: "collapse", borderLeft: "none", borderRight: "none" }}>
//                     <tbody>
//                         <tr>
//                             <th style={{ border: "none", textAlign: "left", paddingRight: "1rem" }}>Date</th>
//                             <td style={{ border: "none" }}>{quotations.date}</td>
//                             <td style={{ border: "none", textAlign: "right" }}>
//                                 Ref. : {quotations.ref_no}/AWP-INS/{quotations.ref_year}
//                             </td>
//                         </tr>
//                         <tr>
//                             <th style={{ border: "none", textAlign: "left", paddingRight: "1rem" }}>TO:</th>
//                             <td style={{ border: "none" }}>{quotations.customer.name}</td>
//                             <td style={{ border: "none" }}></td>
//                         </tr>
//                         <tr>
//                             <th style={{ border: "none", textAlign: "left", paddingRight: "1rem" }}>Attn:</th>
//                             <td style={{ border: "none" }}>{quotations.pic_name}</td>
//                             <td style={{ border: "none" }}></td>
//                         </tr>
//                         <tr>
//                             <th style={{ border: "none", textAlign: "left", paddingRight: "1rem" }}>Subject</th>
//                             <td style={{ border: "none" }} colSpan={2}>
//                                 {quotations.subject}
//                             </td>
//                         </tr>
//                     </tbody>
//                 </table>

//                 <p className="mb-2">
//                     <strong>Dear {quotations.pic_name}</strong>
//                 </p>
//                 <p className="mb-4">
//                     With reference to your above request, we are pleased in submitting our quotation for your consideration.
//                 </p>

//                 <h3 className="font-bold mb-2">A. Scope of works and Price:</h3>

//                 <table
//                     className="w-full mb-4"
//                     style={{ borderCollapse: "collapse" }}
//                 >
//                     <thead>
//                         <tr>
//                             <th style={{ width: "40px", textAlign: "center" }}>No</th>
//                             <th style={{ textAlign: "left" }}>Scope / Description</th>
//                             <th style={{ width: "40px", textAlign: "center" }}>Qty</th>
//                             <th style={{ width: "40px", textAlign: "center" }}>Unit</th>
//                             <th style={{ width: "90px", textAlign: "right" }}>Rate</th>
//                             <th style={{ width: "90px", textAlign: "right" }}>Total</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {quotations.quotationItems.map((item, idx) => {
//                             const totalItem = item.quantity * item.rate;
//                             return (
//                                 <tr key={idx}>
//                                     <td style={{ textAlign: "center" }}>{idx + 1}</td>
//                                     <td>{item.description}</td>
//                                     <td style={{ textAlign: "center" }}>{item.quantity}</td>
//                                     <td style={{ textAlign: "center" }}>{item.unit}</td>
//                                     <td style={{ textAlign: "right" }}>Rp{item.rate.toLocaleString()}</td>
//                                     <td style={{ textAlign: "right" }}>Rp{totalItem.toLocaleString()}</td>
//                                 </tr>
//                             );
//                         })}
//                     </tbody>
//                     <tfoot>
//                         <tr>
//                             <td colSpan={5} style={{ textAlign: "right" }}>
//                                 Sub Total
//                             </td>
//                             <td style={{ textAlign: "right" }}>Rp{subtotal.toLocaleString()}</td>
//                         </tr>
//                         <tr>
//                             <td colSpan={5} style={{ textAlign: "right" }}>
//                                 Discount {quotations.discount ?? 0}%
//                             </td>
//                             <td style={{ textAlign: "right" }}>Rp{discount.toLocaleString()}</td>
//                         </tr>
//                         <tr>
//                             <td colSpan={5} style={{ textAlign: "right" }}>
//                                 Net Total
//                             </td>
//                             <td style={{ textAlign: "right" }}>Rp{net.toLocaleString()}</td>
//                         </tr>
//                         <tr>
//                             <td colSpan={5} style={{ textAlign: "right" }}>
//                                 VAT 11%
//                             </td>
//                             <td style={{ textAlign: "right" }}>Rp{vat.toLocaleString()}</td>
//                         </tr>
//                         <tr>
//                             <td colSpan={5} style={{ textAlign: "right", fontWeight: "bold" }}>
//                                 Total
//                             </td>
//                             <td style={{ textAlign: "right", fontWeight: "bold" }}>
//                                 Rp{total.toLocaleString()}
//                             </td>
//                         </tr>
//                     </tfoot>
//                 </table>

//                 <h3 className="font-bold mb-2">B. Conditions:</h3>
//                 <ol className="list-decimal ml-6 mb-4">
//                     <li>
//                         PT. Adiwarna Pratama to provide:
//                         <ol className="list-decimal ml-6">
//                             {quotations.quotationAdiwarnas.map((adi, idx) => (
//                                 <li key={idx}>{adi.adiwarna_description}</li>
//                             ))}
//                         </ol>
//                     </li>
//                     <li>
//                         {quotations.customer.name} at own cost to Provide:
//                         <ol className="list-decimal ml-6">
//                             {quotations.quotationClients.map((client, idx) => (
//                                 <li key={idx}>{client.client_description}</li>
//                             ))}
//                         </ol>
//                     </li>
//                     <li>Terms of Payment: Net {quotations.top} days after receiving our invoice(s)</li>
//                     <li>This quotation is valid for {quotations.valid_until} days from the date of issuance</li>
//                     {quotations.clause && <li>{quotations.clause}</li>}
//                     {quotations.workday && <li>{quotations.workday}</li>}
//                 </ol>

//                 <p className="mb-8">
//                     We trust that the above prices and conditions will meet your requirements and thank you for the opportunity to being of service to your company.
//                 </p>

//                 <p>
//                     Yours Faithfully, <br />
//                     PT. Adiwarna Pratama <br />
//                     <br />
//                     <br />
//                     <br />
//                     {quotations.auth_name} <br />
//                     {quotations.auth_position}
//                 </p>
//             </main>

//             {/* Footer */}
//             <footer className="fixed bottom-0 w-full border-t-4 border-black bg-white py-2 text-center text-xs font-semibold w-full mx-auto">
//                 Graha Mas Fatmawati Blok B 15, Jl. RS. Fatmawati Kav. 71 <br />
//                 Cipete Utara Kebayoran Baru, Jakarta 12150 - Phone (62-21)72800322, 7210761, 7210852 Fax. (62-21) 7255428, Email: ptawp@cbn.net.id
//             </footer>
//         </>
//     );
// };

// export default QuotationPage;

import React from "react";

const quotationDummy = {
    date: "2025-11-05",
    ref_no: "1",
    ref_year: "2077",
    customer: { name: "PT. Guna Tesuma Indonesia" },
    pic_name: "agus",
    subject: "s",
    top: 7900,
    valid_until: 3456,
    clause: "eyggi",
    workday: "f. 97",
    auth_name: "John Doe",
    auth_position: "Manager",
    discount: 99,
    quotationItems: [
        { description: "akldlwnlkadnk", quantity: 2, unit: "1", rate: 11 },
        { description: "1", quantity: 3, unit: "2", rate: 2 },
    ],
    quotationAdiwarnas: [{ adiwarna_description: "daadwad" }],
    quotationClients: [{ client_description: "dadwad" }],
};

const QuotationPrintPage: React.FC = () => {
    const q = quotationDummy;

    const subtotal = q.quotationItems.reduce(
        (acc, i) => acc + i.quantity * i.rate,
        0
    );
    const discount = (q.discount ?? 0) / 100 * subtotal;
    const net = subtotal - discount;
    const vat = net * 0.11;
    const total = net + vat;

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const printAndHideModal = () => {
        const modal = document.getElementById("printModal");
        if (modal) modal.style.display = "none";
        window.print();
        if (modal) modal.style.display = "block";
    };

    return (
        <>
            <style>
                {`
          @page {
            margin: 15mm 15mm 20mm 15mm;
          }
          @media print {
            body {
              margin: 0;
              -webkit-print-color-adjust: exact;
              font-family: Arial, sans-serif;
              font-size: 12pt;
            }
            #printModal {
              display: none !important;
            }
          }
          /* Table border full */
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid black;
            padding: 4px 6px;
            vertical-align: middle;
          }
          th {
            background-color: #444;
            color: white;
            font-weight: 700;
            text-align: center;
          }
          /* Remove border from header cells that do not have border */
          .no-border {
            border: none !important;
            padding-left: 0 !important;
          }
          /* Bold first column in summary */
          .summary-label {
            font-weight: 700;
            text-align: right;
          }
          .summary-value {
            font-weight: 700;
            text-align: right;
          }
          /* Remove bottom border for last conditions li */
          ol.conditions > li:last-child {
            margin-bottom: 0;
          }
        `}
            </style>

            {/* Print Modal */}
            <div
                id="printModal"
                className="fixed top-5 right-5 w-80 z-50 block"
            >
                <div className="bg-white shadow rounded-lg">
                    <div className="p-3 border-b flex items-center gap-2">
                        <svg
                            className="w-5 h-5 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-9 4a1 1 0 102 0V10a1 1 0 10-2 0v4zm0-6a1 1 0 100-2 1 1 0 000 2z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <h5 className="text-lg font-semibold">Print</h5>
                    </div>
                    <div className="p-3">Back to the top first before printing!</div>
                    <div className="p-3 flex justify-center gap-2">
                        <button
                            onClick={() => window.history.back()}
                            className="bg-red-500 text-white py-1 px-3 rounded flex-1"
                        >
                            Back
                        </button>
                        <button
                            onClick={printAndHideModal}
                            className="bg-blue-500 text-white py-1 px-3 rounded flex-1"
                        >
                            Print
                        </button>
                    </div>
                </div>
            </div>

            {/* Header */}
            <header className="w-full mx-auto border border-black mb-6 grid grid-cols-[100px_1fr] items-center">
                <div className="border-r border-black p-2 flex justify-center items-center">
                    <img
                        src="/icon.png"
                        alt="Logo"
                        className="max-w-20"
                    />
                </div>
                <div className="text-center p-2 font-bold">
                    <div className="text-xl">PT. ADIWARNA PRATAMA</div>
                    <div className="font-semibold">Quotation</div>
                </div>
            </header>

            {/* Main content */}
            <main className="w-full mx-auto" style={{ fontFamily: "Arial, sans-serif", fontSize: "10pt" }}>
                <table className="mb-4">
                    <tbody>
                        <tr>
                            <th style={{ width: "120px", textAlign: "left" }}>Date</th>
                            <td style={{ width: "40%" }}>{formatDate(q.date)}</td>
                            <th style={{ width: "130px", textAlign: "left" }}>Ref.</th>
                            <td style={{ width: "30%" }}>
                                {q.ref_no}/AWP-INS/w{q.ref_year}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ textAlign: "left" }}>TO:</th>
                            <td colSpan={3}>{q.customer.name}</td>
                        </tr>
                        <tr>
                            <th style={{ textAlign: "left" }}>Attn:</th>
                            <td colSpan={3}>{q.pic_name}</td>
                        </tr>
                        <tr>
                            <th style={{ textAlign: "left" }}>Subject</th>
                            <td colSpan={3}>{q.subject}</td>
                        </tr>
                    </tbody>
                </table>

                <p className="mb-3">
                    <strong>Dear {q.pic_name}</strong>
                </p>
                <p className="mb-4">
                    With reference to your above request, we are pleased in submitting our quotation for your consideration.
                </p>

                <h3 className="font-bold mb-2">A. Scope of works and Price:</h3>

                <table className="mb-4" style={{ width: "100%" }}>
                    <thead>
                        <tr>
                            <th style={{ width: "35px" }}>No</th>
                            <th style={{ textAlign: "left" }}>Scope / Description</th>
                            <th style={{ width: "45px" }}>Qty</th>
                            <th style={{ width: "45px" }}>Unit</th>
                            <th style={{ width: "90px" }}>Rate</th>
                            <th style={{ width: "90px" }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {q.quotationItems.map((item, idx) => {
                            const totalItem = item.quantity * item.rate;
                            return (
                                <tr key={idx}>
                                    <td className="text-center">{idx + 1}</td>
                                    <td>{item.description}</td>
                                    <td className="text-center">{item.quantity}</td>
                                    <td className="text-center">{item.unit}</td>
                                    <td className="text-right">Rp{item.rate.toLocaleString()}</td>
                                    <td className="text-right">Rp{totalItem.toLocaleString()}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={5} className="summary-label">
                                Sub Total
                            </td>
                            <td className="summary-value">Rp{subtotal.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td colSpan={5} className="summary-label">
                                Discount {q.discount ?? 0}%
                            </td>
                            <td className="summary-value">Rp{discount.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td colSpan={5} className="summary-label">
                                Net Total
                            </td>
                            <td className="summary-value">Rp{net.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td colSpan={5} className="summary-label">
                                VAT 11%
                            </td>
                            <td className="summary-value">Rp{vat.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td colSpan={5} className="summary-label font-bold border-t border-black">
                                Total
                            </td>
                            <td className="summary-value font-bold border-t border-black">
                                Rp{total.toLocaleString()}
                            </td>
                        </tr>
                    </tfoot>
                </table>

                <h3 className="font-bold mb-2">B. Conditions:</h3>
                <ol className="conditions list-decimal ml-6 mb-8" style={{ listStyleType: "lower-alpha" }}>
                    <li>
                        PT. Adiwarna Pratama to provide:
                        <ol className="list-decimal ml-6" style={{ listStyleType: "decimal" }}>
                            {q.quotationAdiwarnas.map((adi, i) => (
                                <li key={i}>{adi.adiwarna_description}</li>
                            ))}
                        </ol>
                    </li>
                    <li>
                        {q.customer.name} at own cost to Provide:
                        <ol className="list-decimal ml-6" style={{ listStyleType: "decimal" }}>
                            {q.quotationClients.map((client, i) => (
                                <li key={i}>{client.client_description}</li>
                            ))}
                        </ol>
                    </li>
                    <li>Terms of Payment: Net {q.top} days after receiving our invoice(s)</li>
                    <li>This quotation is valid for {q.valid_until} days from the date of issuance</li>
                    {q.clause && <li>{q.clause}</li>}
                    {q.workday && <li>{q.workday}</li>}
                </ol>

                <p className="mb-8">
                    We trust that the above prices and conditions will meet your requirements and thank you for the opportunity to being of service to your company.
                </p>

                <p>
                    Yours Faithfully, <br />
                    PT. Adiwarna Pratama <br />
                    <br />
                    <br />
                    <br />
                    {q.auth_name} <br />
                    {q.auth_position}
                </p>
            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 w-full border-t-4 border-black bg-white py-2 text-center text-xs font-semibold w-full mx-auto">
                <div>
                    <strong>Graha Mas Fatmawati Blok B 15, Jl. RS. Fatmawati Kav. 71</strong>
                </div>
                <div>
                    Cipete Utara Kebayoran Baru, Jakarta 12150 - Phone (62-21)72800322, 7210761, 7210852 Fax. (62-21) 7255428, Email: ptawp@cbn.net.id
                </div>
            </footer>
        </>
    );
};

export default QuotationPrintPage;
