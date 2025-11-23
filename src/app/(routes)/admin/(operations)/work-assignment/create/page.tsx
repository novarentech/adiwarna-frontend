"use client";

import { MdAssignment } from "react-icons/md";

import Link from "next/link";
import { useState } from "react";
import { FaTrash } from "react-icons/fa6";


interface RowDataWorker {
    details: string;
    position: string
}



export default function CreateWorkAssignmentPage() {

    // bagian worker
    const [rowsDataWorker, setRowsDataWorker] = useState<RowDataWorker[]>([
        { details: "", position: "" },
    ]);

    const addRowDataWorker = () => {
        setRowsDataWorker([...rowsDataWorker, { details: "", position: "" }]);
    };

    const updateRowDataWorker = (index: number, field: keyof RowDataWorker, value: string) => {
        const updated = [...rowsDataWorker];
        updated[index][field] = value;
        setRowsDataWorker(updated);
    };

    const deleteRowDataWorker = (index: number) => {
        setRowsDataWorker(rowsDataWorker.filter((_, i) => i !== index));
    };

    const handleCreateWorkAssignment = (e: React.FormEvent) => {
        
    }



    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <MdAssignment className="w-10 h-10" />
                <h1 className="text-3xl font-normal">Add Work Assignment  </h1>
            </div>

            {/* start of form container */}
            <div className="bg-white border rounded-sm px-5 py-6 shadow-xs my-12 ">
                {/* start form */}
                <form onSubmit={handleCreateWorkAssignment} className="flex flex-col">
                    {/* seperate into 3 section */}
                    <div className="grid grid-cols-2 space-x-4">
                        {/* left column */}
                        <div className="flex flex-col space-y-4">
                            {/* REF */}
                            <div className="flex flex-col space-y-1">
                                {/* nomor */}
                                <label htmlFor="no" className="font-bold">No.</label>
                                <div className="flex items-center">
                                    <input type="text" id="no" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add number" />
                                    <p className="mx-4 font-bold">/AWP-INS/</p>
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


                    <hr className="mt-6" />

                    {/* Adiwarna To Provide */}
                    <div className="mt-6">
                        <table className="w-full border-separate border-spacing-y-4 border-spacing-x-4">
                            <thead>
                                <tr className="space-x-1">
                                    <th className="w-[5%]">No</th>
                                    <th className="w-[45%] text-left">Worker's Name</th>
                                    <th className="w-[45%] text-left">Position</th>
                                    <th className="w-[5%]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rowsDataWorker.map((row, index) => (
                                    <tr key={index} className="">
                                        <td className="text-center">{index + 1}</td>

                                        <td>
                                            <input
                                                type="text"
                                                value={row.details}
                                                onChange={(e) =>
                                                    updateRowDataWorker(index, "details", e.target.value)
                                                }
                                                className="border rounded-sm min-h-12 px-2 w-full p-2"
                                                id="Worker-name"
                                                placeholder="Add Worker's Name"
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="text"
                                                value={row.details}
                                                onChange={(e) =>
                                                    updateRowDataWorker(index, "position", e.target.value)
                                                }
                                                className="border rounded-sm min-h-12 px-2 w-full p-2"
                                                id="Worker-position"
                                                placeholder="Add Worker's position"
                                            />
                                        </td>

                                        <td className="text-center">
                                            <button
                                                className="bg-red-600 w-8 h-8 rounded-sm flex justify-center items-center cursor-pointer"
                                                onClick={() => deleteRowDataWorker(index)}
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
                            onClick={addRowDataWorker}
                            className="mt-4 px-4 py-2 bg-[#17a2b8] text-white rounded flex justify-center items-center mx-4 cursor-pointer"
                        >
                            + Add Row
                        </div>



                    </div>

                    <hr className="border-b my-6" />

                    <div className="grid grid-cols-[2fr_1fr_3fr] my-3 space-x-4">
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-1">
                                {/* Ref. AWP WO No. */}
                                <label htmlFor="ref-awp-wo-no" className="font-bold">Ref. AWP WO No.</label>
                                <div className="flex items-center">
                                    <input type="number" id="ref-awp-wo-no" className="flex-1 border rounded-sm h-9 px-2" />
                                    <p className="mx-2 font-bold">/AWP-INS/JKT/</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            {/* quotations valid */}
                            <div className="flex flex-col space-y-1">
                                {/* year */}
                                <label htmlFor="ref-awp-wo-no-year" className="font-bold text-transparent">.</label>
                                <div className="flex items-center">
                                    <input type="text" id="ref-awp-wo-no-year" className="flex-1 border rounded-sm h-9 px-2" placeholder="Year" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            {/* Ref. PO No./Instruction */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="quotations-valid" className="font-bold  ">Ref. PO No./Instruction</label>
                                <div className="flex items-center">
                                    {/* ini nanti fetch dari customerr */}
                                    <input type="text" id="quotations-valid" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add Ref. PO No./Instruction" />
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* customer */}
                    <div className="flex flex-col space-y-1 my-3">
                        <label htmlFor="customer" className="font-bold">Customer</label>
                        <div className="flex">
                            <select className="flex-1 border rounded-sm h-9 px-2">
                                <option value="" className="font-light" hidden>---Choose Customer's Name---</option>
                                <option value="" className="font-light">Test</option>
                                {/* ini nanti fetch customer trs di loop di option*/}
                            </select>
                        </div>
                    </div>


                    <hr className="border-b my-6" />

                    <div className="grid grid-cols-2 space-x-4">
                        {/* left column */}
                        <div className="flex flex-col space-y-4">
                            {/* Work Location */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="worklocation" className="font-bold">Work Location</label>
                                <div className="flex">
                                    <select className="flex-1 border rounded-sm h-9 px-2">
                                        <option value="" className="font-light" hidden>---Choose work location---</option>
                                        <option value="" className="font-light">Test</option>
                                        {/* ini nanti fetch dari customer terus ambil work location */}
                                    </select>
                                </div>
                            </div>
                            {/* scope of work */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="scopeofwork" className="font-bold">Scope of Work</label>
                                <div className="flex">
                                    <input type="text" id="scopeofwork" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add Scope of Work" />
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
                            {/* Estimate Duration */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="estimateduration" className="font-bold">Estimate Duration</label>
                                <div className="flex">
                                    <input type="estimateduration" id="text" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add estimate duration (days)" />
                                </div>
                            </div>
                            {/* Mobilization */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="mobilization" className="font-bold">Mobilization</label>
                                <div className="flex">
                                    <input type="text" id="mobilization" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add Mobilization " />
                                </div>
                            </div>
                            {/* position authorized by */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="author-position" className="font-bold">Position</label>
                                <div className="flex">
                                    <input type="text" id="author-position" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add Postion " />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-b my-6" />

                    <div className="ml-auto w-1/4 grid grid-cols-2 space-x-4">
                        <Link href={"/admin/work-assignment"} className="bg-red-500 flex justify-center items-center text-white h-10 rounded-sm">Cancel</Link>
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