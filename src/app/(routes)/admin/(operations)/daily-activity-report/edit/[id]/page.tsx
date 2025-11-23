"use client";

import { MdWorkHistory } from "react-icons/md";

import Link from "next/link";
import { use, useState } from "react";
import { FaTrash } from "react-icons/fa6";


interface RowDataTeamMember {
    details: string;
    position: string
}

interface RowDataWork {
    workDescription: string;
    equipmentNo: string;
}

type EditDailyActivityParams = Promise<{ id: string }>;

export default function EditDailyActivityReport(
    {
        params,
    }: {
        params: EditDailyActivityParams;
    }
) {
    const actualParams = use(params);
    const id = actualParams.id;

    // bagianTeamMember
    const [rowsDataTeamMember, setRowsDataTeamMember] = useState<RowDataTeamMember[]>([
        { details: "", position: "" },
    ]);

    const addRowDataTeamMember = () => {
        setRowsDataTeamMember([...rowsDataTeamMember, { details: "", position: "" }]);
    };

    const updateRowDataTeamMember = (index: number, field: keyof RowDataTeamMember, value: string) => {
        const updated = [...rowsDataTeamMember];
        updated[index][field] = value;
        setRowsDataTeamMember(updated);
    };

    const deleteRowDataTeamMember = (index: number) => {
        setRowsDataTeamMember(rowsDataTeamMember.filter((_, i) => i !== index));
    };

    // 

    // 
    // bagian worker (di dropdown nanti fetch data employee)
    const [rowsDataWork, setRowsDataWork] = useState<RowDataWork[]>([
        { workDescription: "", equipmentNo: "" },
    ]);

    const addRowDataReport = () => {
        setRowsDataWork([...rowsDataWork, { workDescription: "", equipmentNo: '' }]);
    };

    const updateRowDataReport = (index: number, field: keyof RowDataWork, value: string) => {
        const updated = [...rowsDataWork];
        updated[index][field] = value;
        setRowsDataWork(updated);
    };

    const deleteRowDataReport = (index: number) => {
        setRowsDataWork(rowsDataWork.filter((_, i) => i !== index));
    };

    // 

    const handleEditDailyActivityReport = (e: React.FormEvent) => {

    }



    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <h1 className="text-3xl font-normal">Add Daily Activity  </h1>
            </div>

            {/* start of form container */}
            <div className="bg-white border rounded-sm px-5 py-6 shadow-xs my-12 ">
                {/* start form */}
                <form onSubmit={handleEditDailyActivityReport} className="flex flex-col">
                    {/* seperate into 2 section */}
                    <div className="grid grid-cols-2 space-x-4">
                        {/* left column */}
                        <div className="flex flex-col space-y-4">
                            {/* Ref. AWP W.O. No. */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="ref-awp-wo-no" className="font-bold">Ref. AWP W.O. No.</label>
                                <div className="flex items-center">
                                    <input type="text" id="ref-awp-wo-no" className="flex-1 border rounded-sm h-9 px-2" placeholder="Number" />
                                    <p className="mx-4 font-bold">/AWP-INS/</p>
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
                            {/* customer address */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="location-jobsite" className="font-bold">Location / Jobsite</label>
                                <div className="flex">
                                    {/* ini nanti value nya otomatis ambil dari customer */}
                                    <input type="text" id="location-jobsite" className="flex-1 border rounded-sm h-9 px-2 " />
                                </div>
                            </div>
                        </div>
                        {/* right column */}
                        <div className="flex flex-col space-y-4">
                            {/* Service Contract No./ PO No. */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="Service Contract No./ PO No." className="font-bold">Service Contract No./ PO No.</label>
                                <div className="flex">
                                    <input type="text" id="Service Contract No./ PO No." className="flex-1 border rounded-sm h-9 px-2" />
                                </div>
                            </div>
                            <div className="flex flex-col space-y-4">
                                {/* date */}
                                <div className="flex flex-col space-y-1">
                                    {/* year */}
                                    <label htmlFor="date" className="font-bold">Date</label>
                                    <div className="flex items-center">
                                        <input type="date" id="date" className="flex-1 border rounded-sm h-9 px-2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* team member */}
                    <div className="mt-2">
                        <table className="w-full border-separate border-spacing-y-4 border-spacing-x-4">
                            <thead>
                                <tr className="space-x-1">
                                    <th className="w-[5%]">No</th>
                                    <th className="w-[90%] text-left">Team Member</th>
                                    <th className="w-[5%]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rowsDataTeamMember.map((row, index) => (
                                    <tr key={index} className="">
                                        <td className="text-center">{index + 1}</td>
                                        <td>
                                            <select
                                                name="team-member"
                                                id="team-member"
                                                className="border rounded-sm min-h-12 px-2 w-full p-2">
                                                <option value="" className="">---Choose team member---</option>
                                                {/* ini nanti fetch workers nya (data employee) */}
                                                <option value="test">test</option>
                                            </select>
                                        </td>

                                        <td className="text-center">
                                            <button
                                                className="bg-red-600 w-8 h-8 rounded-sm flex justify-center items-center cursor-pointer"
                                                onClick={() => deleteRowDataTeamMember(index)}
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
                            onClick={addRowDataTeamMember}
                            className="mt-4 px-4 py-2 bg-[#17a2b8] text-white rounded flex justify-center items-center mx-4 cursor-pointer"
                        >
                            + Add row
                        </div>
                    </div>


                    {/* time duration */}
                    <div className="flex flex-col space-y-4 mt-6 w-4/6 mx-auto">
                        {/* ffrom */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="from-duration" className="font-bold">From</label>
                            <div className="flex">
                                <input type="time" name="from-duration" id="from-duration" className="flex-1 border rounded-sm h-9 px-2" placeholder="hh:mm" />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-1">
                                {/* to */}
                                <label htmlFor="to-duration" className="font-bold">to</label>
                                <div className="flex items-center">
                                    <input type="time" id="to-duration" className="flex-1 border rounded-sm h-9 px-2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* bagian work dah pokoknya */}

                    <div className="mt-6">
                        <table className="w-full border-separate border-spacing-y-4 border-spacing-x-4">
                            <thead>
                                <tr className="space-x-1">
                                    <th className="w-[5%]">No</th>
                                    <th className="w-[45%] text-left">Work Description</th>
                                    <th className="w-[45%] text-left">Equipment No</th>
                                    <th className="w-[5%]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rowsDataWork.map((row, index) => (
                                    <tr key={index} className="">
                                        <td className="text-center">{index + 1}</td>

                                        <td className="flex flex-row items-center">

                                            <input
                                                type="type"
                                                value={row.workDescription}
                                                onChange={(e) =>
                                                    updateRowDataReport(index, "workDescription", e.target.value)
                                                }
                                                className="border rounded-sm h-12 px-2 w-full p-2 flex-1"
                                                id="wo-year"
                                                placeholder="Enter work description"
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="text"
                                                value={row.equipmentNo}
                                                onChange={(e) =>
                                                    updateRowDataReport(index, "equipmentNo", e.target.value)
                                                }
                                                className="border rounded-sm h-12 px-2 w-full p-2 flex-1"
                                                id="wo-number"
                                                placeholder="Enter Equipment number"
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

                    {/* prepared by and acnknowledged by */}

                    <div className="grid grid-cols-2 my-3 space-x-4 mt-6">
                        {/* leff */}
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-1">
                                {/* TA No. */}
                                <label htmlFor="prepared-by" className="font-bold">Prepared By</label>
                                <div className="flex items-center">
                                    <input type="text" id="prepared-by" className="flex-1 border rounded-sm h-9 px-2" placeholder="Enter name" />
                                </div>
                            </div>
                            <div className="flex flex-col space-y-1">
                                {/* TA No. */}
                                <label htmlFor="acknowledged-by" className="font-bold">Acknowledged By</label>
                                <div className="flex items-center">
                                    <input type="text" id="acknowledged-by" className="flex-1 border rounded-sm h-9 px-2" placeholder="Enter name" />
                                </div>
                            </div>
                        </div>
                        {/* right */}
                        <div className="flex flex-col space-y-4">
                            {/* position */}
                            <div className="flex flex-col space-y-1">
                                {/* position prepared by */}
                                <label htmlFor="prepared-by-position" className="font-bold">Position</label>
                                <div className="flex items-center">
                                    <input type="text" id="prepared-by-position" className="flex-1 border rounded-sm h-9 px-2" placeholder="Enter position" />
                                </div>
                            </div>
                            <div className="flex flex-col space-y-1">
                                {/* position aknowledge by */}
                                <label htmlFor="aknowledge-by-position" className="font-bold">Position</label>
                                <div className="flex items-center">
                                    <input type="text" id="aknowledge-by-position" className="flex-1 border rounded-sm h-9 px-2" placeholder="Enter position" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-b my-6" />

                    <div className="ml-auto w-1/4 grid grid-cols-2 space-x-4">
                        <Link href={"/admin/daily-activity-report"} className="bg-red-500 flex justify-center items-center text-white h-10 rounded-sm">Cancel</Link>
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