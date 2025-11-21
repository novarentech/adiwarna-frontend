"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";

interface RowDataScope {
    qty: string;
    unit: string;
    description: string;
    unitRate: string;
}

interface RowDataAdiwarnaProvide {
    details: string;
}

interface RowDataClientProvide {
    details: string;
}

export default function CreateQuotationsPage() {

    // bagian SCOPE
    const [rowsSCope, setRowsScope] = useState<RowDataScope[]>([
        { qty: "", unit: "", description: "", unitRate: "" },
    ]);

    const addRowScope = () => {
        setRowsScope([...rowsSCope, { qty: "", unit: "", description: "", unitRate: "" }]);
    };

    const updateRowScope = (index: number, field: keyof RowDataScope, value: string) => {
        const updated = [...rowsSCope];
        updated[index][field] = value;
        setRowsScope(updated);
    };

    const deleteRowSCope = (index: number) => {
        setRowsScope(rowsSCope.filter((_, i) => i !== index));
    };

    // bagian ADiwarna Provide
    const [rowsAdiwarnaProvide, setRowsAdiwarnaProvide] = useState<RowDataAdiwarnaProvide[]>([
        { details: "" },
    ]);

    const addRowAdiwarnaProvide = () => {
        setRowsAdiwarnaProvide([...rowsAdiwarnaProvide, { details: "" }]);
    };

    const updateRowAdiwarnaProvide = (index: number, field: keyof RowDataAdiwarnaProvide, value: string) => {
        const updated = [...rowsAdiwarnaProvide];
        updated[index][field] = value;
        setRowsAdiwarnaProvide(updated);
    };

    const deleteRowAdiwarnaProvide = (index: number) => {
        setRowsAdiwarnaProvide(rowsAdiwarnaProvide.filter((_, i) => i !== index));
    };

    // bagian client Provide
    const [rowsClientProvide, setRowsClientProvide] = useState<RowDataClientProvide[]>([
        { details: "" },
    ]);

    const addRowClientProvide = () => {
        setRowsClientProvide([...rowsClientProvide, { details: "" }]);
    };

    const updateRowClientProvide = (index: number, field: keyof RowDataClientProvide, value: string) => {
        const updated = [...rowsClientProvide];
        updated[index][field] = value;
        setRowsClientProvide(updated);
    };

    const deleteRowClientProvide = (index: number) => {
        setRowsClientProvide(rowsClientProvide.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <MdEdit className="w-10 h-10" />
                <h1 className="text-3xl font-normal">Add Quotations  </h1>
            </div>

            {/* start of form container */}
            <div className="bg-white border rounded-sm px-5 py-6 shadow-xs my-12 ">
                {/* start form */}
                <form action="" className="flex flex-col">
                    {/* seperate into 2 section */}
                    <div className="grid grid-cols-2 space-x-4">
                        {/* left column */}
                        <div className="flex flex-col space-y-4">
                            {/* REF */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="ref" className="font-bold">Ref.</label>
                                <div className="flex items-center">
                                    <input type="text" id="ref" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add number" />
                                    <p className="mx-4 font-bold">/AWS-INS/</p>
                                    <input type="text" id="year" className="flex-1 border rounded-sm h-9 px-2" placeholder="year" />
                                </div>
                            </div>
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
                            {/* customer */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="subject" className="font-bold">Subject</label>
                                <div className="flex">
                                    <input type="text" id="subject" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add Subject" />
                                </div>
                            </div>
                        </div>
                        {/* right column */}
                        <div className="flex flex-col space-y-4">
                            {/* Date */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="date" className="font-bold">Date</label>
                                <div className="flex">
                                    <input type="date" id="date" className="flex-1 border rounded-sm h-9 px-2" />
                                </div>
                            </div>
                            {/* PIC */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="pic" className="font-bold">Person in Charge (PIC)</label>
                                <div className="flex">
                                    <input type="text" id="pic" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add PIC'S name" />
                                </div>
                            </div>
                            {/* PIC phone */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="pic-phone" className="font-bold">PIC's Phone number</label>
                                <div className="flex">
                                    <input type="text" id="pic-phone" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add PIC'S telephone number" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* scope of works */}
                    <div className="mt-12">
                        <table className="w-full border-separate border-spacing-y-6 border-spacing-x-4">
                            <thead>
                                <tr className="space-x-1">
                                    <th className="w-[5%]">No</th>
                                    <th className="w-[10%]">Qty</th>
                                    <th className="w-[10%]">Unit</th>
                                    <th>Descsription</th>
                                    <th className="w-[15%]">Unit Rate</th>
                                    <th className="w-[5%]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rowsSCope.map((row, index) => (
                                    <tr key={index} className="">
                                        <td className="text-center">{index + 1}</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={row.qty}
                                                onChange={(e) => updateRowScope(index, "qty", e.target.value)}
                                                className="border rounded-sm h-9 px-2 w-full mx-auto appearance-none"
                                                placeholder="0"
                                            />
                                        </td>

                                        <td>
                                            <input
                                                value={row.unit}
                                                onChange={(e) => updateRowScope(index, "unit", e.target.value)}
                                                className="border rounded-sm h-9 px-2 w-full"
                                                placeholder="Unit"
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="text"
                                                value={row.description}
                                                onChange={(e) =>
                                                    updateRowScope(index, "description", e.target.value)
                                                }
                                                className="border rounded-sm h-9 px-2 w-full"
                                                placeholder="Add Description"
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="number"
                                                value={row.unitRate}
                                                onChange={(e) => updateRowScope(index, "unitRate", e.target.value)}
                                                className="border rounded-sm h-9 px-2 w-full"
                                                placeholder="0"
                                            />
                                        </td>

                                        <td className="text-center">
                                            <button
                                                className="bg-red-600 w-8 h-8 rounded-sm flex justify-center items-center cursor-pointer"
                                                onClick={() => deleteRowSCope(index)}
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
                            onClick={addRowScope}
                            className="mt-4 px-4 py-2 bg-[#17a2b8] text-white rounded flex justify-center items-center mx-4 cursor-pointer"
                        >
                            + Add Row
                        </div>
                    </div>

                    {/* section ADiwarna to provide */}
                    <h2 className="mt-12 font-bold">PT Adiwarna To Provide</h2>
                    {/* Adiwarna To Provide */}
                    <div className="mt-6">
                        <table className="w-full border-separate border-spacing-y-4 border-spacing-x-4">
                            <thead>
                                <tr className="space-x-1">
                                    <th className="w-[5%]">No</th>
                                    <th className="w-[90%] text-left">Details</th>
                                    <th className="w-[5%]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rowsAdiwarnaProvide.map((row, index) => (
                                    <tr key={index} className="">
                                        <td className="text-center">{index + 1}</td>

                                        <td>
                                            <textarea
                                                value={row.details}
                                                onChange={(e) =>
                                                    updateRowAdiwarnaProvide(index, "details", e.target.value)
                                                }
                                                className="border rounded-sm min-h-16 px-2 w-full p-2"
                                                placeholder="Masukkan sesuai kebutuhan"
                                            />
                                        </td>

                                        <td className="text-center">
                                            <button
                                                className="bg-red-600 w-8 h-8 rounded-sm flex justify-center items-center cursor-pointer"
                                                onClick={() => deleteRowAdiwarnaProvide(index)}
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
                            onClick={addRowAdiwarnaProvide}
                            className="mt-4 px-4 py-2 bg-[#17a2b8] text-white rounded flex justify-center items-center mx-4 cursor-pointer"
                        >
                            + Add Row
                        </div>



                    </div>

                    {/* section ADiwarna to provide */}
                    <h2 className="mt-12 font-bold">Client To Provide</h2>
                    {/* Adiwarna To Provide */}
                    <div className="mt-6">
                        <table className="w-full border-separate border-spacing-y-4 border-spacing-x-4">
                            <thead>
                                <tr className="space-x-1">
                                    <th className="w-[5%]">No</th>
                                    <th className="w-[90%] text-left">Details</th>
                                    <th className="w-[5%]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rowsClientProvide.map((row, index) => (
                                    <tr key={index} className="">
                                        <td className="text-center">{index + 1}</td>

                                        <td>
                                            <textarea
                                                value={row.details}
                                                onChange={(e) =>
                                                    updateRowClientProvide(index, "details", e.target.value)
                                                }
                                                className="border rounded-sm min-h-16 px-2 w-full p-2"
                                                placeholder="Masukkan sesuai kebutuhan"
                                            />
                                        </td>

                                        <td className="text-center">
                                            <button
                                                className="bg-red-600 w-8 h-8 rounded-sm flex justify-center items-center cursor-pointer"
                                                onClick={() => deleteRowClientProvide(index)}
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
                            onClick={addRowClientProvide}
                            className="mt-4 px-4 py-2 bg-[#17a2b8] text-white rounded flex justify-center items-center mx-4 cursor-pointer"
                        >
                            + Add Row
                        </div>
                    </div>

                    <div className="mt-12 flex-col space-y-4">
                        {/* Terms of payment and quotation valid*/}
                        <div className="grid grid-cols-2">
                            <div className="flex flex-col space-y-4">
                                {/* terms of payment */}
                                <div className="flex flex-col space-y-1">
                                    <label htmlFor="terms-of-payment" className="font-bold">Terms of Payment</label>
                                    <div className="flex items-center">
                                        <input type="text" id="terms-of-payment" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add Terms Of Payment" />
                                        <p className="mx-4 font-bold">Days</p>
                                    </div>
                                </div>
                            </div>
                            {/* right column */}
                            <div className="flex flex-col space-y-4">
                                {/* quotations valid */}
                                <div className="flex flex-col space-y-1">
                                    <label htmlFor="quotations-valid" className="font-bold">Quotations Valid</label>
                                    <div className="flex items-center">
                                        <input type="text" id="quotations-valid" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add number" />
                                        <p className="mx-4 font-bold">Days</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* clause */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="clause" className="font-bold">Clause</label>
                            <div className="flex">
                                <input type="text" id="clause" className="flex-1 border rounded-sm h-9 px-2" />
                            </div>
                        </div>
                        {/* workday */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="workday" className="font-bold">Workday</label>
                            <div className="flex">
                                <input type="text" id="workday" className="flex-1 border rounded-sm h-9 px-2" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 space-x-4">
                            <div className="flex flex-col space-y-4">
                                {/* Author */}
                                <div className="flex flex-col space-y-1">
                                    <label htmlFor="author" className="font-bold">Authorized By</label>
                                    <div className="flex items-center">
                                        <input type="text" id="author" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add Name" />
                                    </div>
                                </div>
                            </div>
                            {/* right column */}
                            <div className="flex flex-col space-y-4">
                                {/* Position */}
                                <div className="flex flex-col space-y-1">
                                    <label htmlFor="position" className="font-bold">Position</label>
                                    <div className="flex items-center">
                                        <input type="text" id="positions" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add Position" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Dicount */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="dicscount" className="font-bold">Dicscount</label>
                            <div className="flex">
                                <input type="text" id="dicscount" className="w-2/6 border rounded-sm h-9 px-2" />
                                <p className="my-auto ml-2">{"(%)"}</p>
                            </div>
                        </div>
                    </div>
                    <hr className="border-b my-6" />
                    <div className="ml-auto w-1/4 grid grid-cols-2 space-x-4">
                        <Link href={"/admin/quotations"} className="bg-red-500 flex justify-center items-center text-white h-10 rounded-sm">Cancel</Link>
                        <button type="submit" className="bg-[#17a2b8] flex justify-center items-center text-white h-10 rounded-sm">Save</button>
                    </div>
                </form>
                {/* end form */}
            </div>
            {/* end of form container */}

            <div className="h-20 text-transparent">.</div>
        </div>
    )
}
