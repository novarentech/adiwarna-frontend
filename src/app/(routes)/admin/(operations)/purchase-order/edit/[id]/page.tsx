"use client";

import { MdAddShoppingCart } from "react-icons/md";

import Link from "next/link";
import { use, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";

interface RowDataScope {
    qty: string;
    unit: string;
    description: string;
    unitRate: string;
}

type EditPurchaseOrderParams = Promise<{ id: string }>;

export default function EditPurchaseOrderPage({
    params,
}: {
    params: EditPurchaseOrderParams;
}) {
    const actualParams = use(params);
    const id = actualParams.id;

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

    const handleCreatePurchaseOrder = (e: React.FormEvent) => {
        e.preventDefault();
    }



    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <MdEdit className="w-10 h-10" />
                <h1 className="text-3xl font-normal">Edit Purchase Order  </h1>
            </div>

            {/* start of form container */}
            <div className="bg-white border rounded-sm px-5 py-6 shadow-xs my-12 ">
                {/* start form */}
                <form onClick={handleCreatePurchaseOrder} className="flex flex-col">
                    {/* seperate into 2 section */}
                    <div className="grid grid-cols-2 space-x-4">
                        {/* left column */}
                        <div className="flex flex-col space-y-4">
                            {/* REF */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="po-no" className="font-bold">PO No.</label>
                                <div className="flex items-center">
                                    <input type="text" id="po-no" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add number" />
                                    <p className="mx-4 font-bold">/PO/AWS-INS/</p>
                                    <input type="text" id="year" className="flex-1 border rounded-sm h-9 px-2" placeholder="year" />
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
                        </div>
                    </div>

                    <hr className="my-6" />

                    <div className="grid grid-cols-2 space-x-4">
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
                                    <input type="text" id="customer-address" className="flex-1 border rounded-sm h-9 px-2 bg-[#e9ecef]" placeholder="Add Subject" disabled />
                                </div>
                            </div>
                            {/* customer address */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="customer-phone" className="font-bold">Customer's Phone Number</label>
                                <div className="flex">
                                    <input type="text" id="customer-phone" className="flex-1 border rounded-sm h-9 px-2 bg-[#e9ecef]" placeholder="Add Subject" disabled />
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
                            {/* PIC phone */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="pic-phone" className="font-bold">PIC's Phone number</label>
                                <div className="flex">
                                    <input type="text" id="pic-phone" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add PIC'S telephone number" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="mt-6" />

                    <div className="grid grid-cols-[3fr_2fr_2fr] my-6 space-x-4">
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-1">
                                {/* required delivery date */}
                                <label htmlFor="req-deli-date" className="font-bold">Required Delivery Date</label>
                                <div className="flex items-center">
                                    <input type="date" id="req-deli-date" className="flex-1 border rounded-sm h-9 px-2" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            {/* quotations valid */}
                            <div className="flex flex-col space-y-1">
                                {/* terms of payment */}
                                <label htmlFor="term-of-payment" className="font-bold">Terms of Payment</label>
                                <div className="flex items-center">
                                    <input type="text" id="term-of-payment" className="flex-1 border rounded-sm h-9 px-2" placeholder="50" />
                                    <p className="mx-2 font-bold">% DP;</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            {/* persen COD */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="quotations-valid" className="font-bold text-transparent">.</label>
                                <div className="flex items-center">
                                    <input type="text" id="quotations-valid" className="flex-1 border rounded-sm h-9 px-2" placeholder="50" />
                                    <p className="mx-4 font-bold">% COD</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-[3fr_2fr_2fr] my-1 space-x-4">
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-1">
                                {/* Quotation Ref. */}
                                <label htmlFor="quotation-ref" className="font-bold">Quotation Ref.</label>
                                <div className="flex items-center">
                                    <input type="date" id="quotation-ref" className="flex-1 border rounded-sm h-9 px-2" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            {/* PR no */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="pr-no" className="font-bold">PR No.</label>
                                <div className="flex items-center">
                                    <input type="text" id="pr-no" className="flex-1 border rounded-sm h-9 px-2" placeholder="50" />
                                    <p className="mx-2 font-bold">/PR/</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            {/* year */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="quotations-year" className="font-bold text-transparent">.</label>
                                <div className="flex items-center">
                                    <input type="number" id="quotations-year" className="flex-1 border rounded-sm h-9 px-2" placeholder="Year" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="mt-6" />

                    {/* scope of works */}
                    <div className="mt-6">
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

                    <hr className="border-b my-6" />

                    <div className="grid grid-cols-2 space-x-4">
                        {/* left column */}
                        <div className="flex flex-col space-y-4">
                            {/* REQ BY */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="requested-by" className="font-bold">Requested By</label>
                                <div className="flex items-center">
                                    <input type="text" id="requested-by" className="flex-1 border rounded-sm h-9 px-2" placeholder="Masukkan nama anda" />
                                </div>
                            </div>
                            {/* approved */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="approved-by" className="font-bold">Approved By</label>
                                <div className="flex">
                                    <input type="text" id="approved-by" className="flex-1 border rounded-sm h-9 px-2" placeholder="Masukkan nama" />
                                </div>
                            </div>
                            {/* author */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="authorized-by" className="font-bold">Authorized By</label>
                                <div className="flex">
                                    <input type="text" id="authorized-by" className="flex-1 border rounded-sm h-9 px-2" placeholder="Masukkan nama" />
                                </div>
                            </div>
                        </div>
                        {/* right column */}
                        <div className="flex flex-col space-y-4">
                            {/* Position request by */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="req-position" className="font-bold">Position</label>
                                <div className="flex">
                                    <input type="req-position" id="text" className="flex-1 border rounded-sm h-9 px-2" placeholder="Masukkan Posisi Anda" />
                                </div>
                            </div>
                            {/* position approved by */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="approve-position" className="font-bold">Person in Charge (PIC)</label>
                                <div className="flex">
                                    <input type="text" id="approve-position" className="flex-1 border rounded-sm h-9 px-2" placeholder="Masukkan Posisi " />
                                </div>
                            </div>
                            {/* position authorized by */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="author-position" className="font-bold">Position</label>
                                <div className="flex">
                                    <input type="text" id="author-position" className="flex-1 border rounded-sm h-9 px-2" placeholder="Masukkan Posisi " />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-b my-6" />

                    <div className=" flex-col space-y-4">
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
                        <Link href={"/admin/purchase-order"} className="bg-red-500 flex justify-center items-center text-white h-10 rounded-sm">Cancel</Link>
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