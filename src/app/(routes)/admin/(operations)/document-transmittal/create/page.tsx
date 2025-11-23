"use client";

import Link from "next/link";
import { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { MdDocumentScanner } from "react-icons/md";

interface RowDataReport {
    wo: number;
    year: number;
    location: string;
}

export default function CreateDocTransmittal() {

    // bagian worker order
    const [rowsDataWorkerOrder, setRowsDataWorkerOrder] = useState<RowDataReport[]>([
        { wo: 0, year: 0, location: "" },
    ]);

    const addRowDataReport = () => {
        setRowsDataWorkerOrder([...rowsDataWorkerOrder, { wo: 0, year: 0, location: "" }]);
    };

    const updateRowDataReport = <K extends keyof RowDataReport>(
        index: number,
        field: K,
        value: RowDataReport[K]
    ) => {
        const updated = [...rowsDataWorkerOrder];
        updated[index][field] = value;
        setRowsDataWorkerOrder(updated);
    };


    // const updateRowDataReport = (index: number, field: keyof RowDataReport, value: string) => {
    //     const updated = [...rowsDataWorkerOrder];
    //     updated[index][field] = value;
    //     setRowsDataWorkerOrder(updated);
    // };

    const deleteRowDataReport = (index: number) => {
        setRowsDataWorkerOrder(rowsDataWorkerOrder.filter((_, i) => i !== index));
    };

    const handleCreateDocumentTransmittal = (e: React.FormEvent) => {
        
    }



    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <MdDocumentScanner className="w-10 h-10" />
                <h1 className="text-3xl font-normal">Add Document Transmittal  </h1>
            </div>

            {/* start of form container */}
            <div className="bg-white border rounded-sm px-5 py-6 shadow-xs my-12 ">
                {/* start form */}
                <form onSubmit={handleCreateDocumentTransmittal} className="flex flex-col">
                    <div className="grid grid-cols-1 space-x-4">
                        <div className="flex flex-col space-y-4">
                            {/* Name */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="name" className="font-bold">Name</label>
                                <div className="flex items-center">
                                    <input type="text" id="name" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add your name" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 my-3 space-x-4">
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-1">
                                {/* TA No. */}
                                <label htmlFor="TA-No" className="font-bold">TA No.</label>
                                <div className="flex items-center">
                                    <input type="text" id="TA-No" className="flex-1 border rounded-sm h-9 px-2" placeholder="Number/month/year, ex: 000/VII/2024" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            {/* date */}
                            <div className="flex flex-col space-y-1">
                                {/* year */}
                                <label htmlFor="date" className="font-bold text-transparent">Date</label>
                                <div className="flex items-center">
                                    <input type="date" id="date" className="flex-1 border rounded-sm h-9 px-2" />
                                </div>
                            </div>
                        </div>
                    </div>


                    <hr className="my-6" />


                    <div className="grid grid-cols-2 space-x-4 mb-3">
                        {/* left column */}
                        <div className="flex flex-col space-y-4">
                            {/* customer */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="customer" className="font-bold">Customer</label>
                                <div className="flex">
                                    <select className="flex-1 border rounded-sm h-9 px-2">
                                        <option value="" className="font-light" hidden>---Choose Customer's Name---</option>
                                        <option value="" className="font-light">Test</option>
                                        {/* ini nanti fetch customer trs di loop di option*/}
                                    </select>
                                </div>
                            </div>
                            {/* customer address */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="customer-address" className="font-bold">Customer's Address</label>
                                <div className="flex">
                                    {/* ini nanti value nya otomatis ambil dari customer */}
                                    <input type="text" id="customer-address" className="flex-1 border rounded-sm h-9 px-2 bg-[#e9ecef]" disabled />
                                </div>
                            </div>
                        </div>
                        {/* right column */}
                        <div className="flex flex-col space-y-4">
                            {/* PIC */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="pic" className="font-bold">Person in Charge (PIC)</label>
                                <div className="flex">
                                    <input type="text" id="pic" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add PIC'S name" />
                                </div>
                            </div>

                            {/* Customer's District */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="customer-district" className="font-bold">Customer's District</label>
                                <div className="flex">
                                    <input type="text" id="customer-district" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add Customer's District" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-b my-6" />

                    <div className="flex flex-col space-y-4">
                        {/* Name */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="report-type" className="font-bold">Report Type</label>
                            <div className="flex items-center">
                                <input type="text" id="report-type" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add report type" />
                            </div>
                        </div>
                    </div>

                    {/* Adiwarna To Provide */}
                    <div className="mt-6">
                        <table className="w-full border-separate border-spacing-y-4 border-spacing-x-4">
                            <thead>
                                <tr className="space-x-1">
                                    <th className="w-[5%]">No</th>
                                    <th className="w-[60%] text-left">WO</th>
                                    <th className="w-[30%] text-left">location</th>
                                    <th className="w-[5%]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rowsDataWorkerOrder.map((row, index) => (
                                    <tr key={index} className="">
                                        <td className="text-center">{index + 1}</td>

                                        <td className="flex flex-row items-center">
                                            <input
                                                type="number"
                                                value={row.wo}
                                                onChange={(e) =>
                                                    updateRowDataReport(index, "wo", Number(e.target.value))
                                                }
                                                className="border rounded-sm h-12 px-2 w-full p-2 flex-1"
                                                id="wo-number"
                                                placeholder="Add number"
                                            />
                                            <p className="mx-7 font-bold">/AWP-INS/</p>
                                            <input
                                                type="number"
                                                value={row.year}
                                                onChange={(e) =>
                                                    updateRowDataReport(index, "year", Number(e.target.value))
                                                }
                                                className="border rounded-sm h-12 px-2 w-full p-2 flex-1"
                                                id="wo-year"
                                                placeholder="year"
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="text"
                                                value={row.location}
                                                onChange={(e) =>
                                                    updateRowDataReport(index, "location", e.target.value)
                                                }
                                                className="border rounded-sm min-h-12 px-2 w-full p-2"
                                                id="work-location"
                                                placeholder="Add work location"
                                            />
                                        </td>

                                        <td className="text-center">
                                            <button
                                                className="bg-red-600 w-8 h-8 rounded-sm flex justify-center items-center cursor-pointer"
                                                onClick={() => deleteRowDataReport(index)}
                                            >
                                                <FaTrash className="w-5 h-5 text-white" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Button Add Row */}
                        <div
                            onClick={addRowDataReport}
                            className="mt-4 px-4 py-2 bg-[#17a2b8] text-white rounded flex justify-center items-center mx-4 cursor-pointer"
                        >
                            + Add Row
                        </div>



                    </div>

                    <hr className="border-b my-6" />

                    <div className="ml-auto w-1/4 grid grid-cols-2 space-x-4">
                        <Link href={"/admin/document-transmittal"} className="bg-red-500 flex justify-center items-center text-white h-10 rounded-sm">Cancel</Link>
                        <button type="submit" className="bg-[#17a2b8] flex justify-center items-center text-white h-10 rounded-sm">Save</button>
                    </div>
                </form>
                {/* end form */}
            </div >
            {/* end of form container */}

            <div className="h-20 text-transparent" >.</div>
        </div >
    )
}