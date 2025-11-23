"use client";

import { MdWorkHistory } from "react-icons/md";

import Link from "next/link";
import { useState } from "react";
import { FaTrash } from "react-icons/fa6";


interface RowDataWorker {
    details: string;
    position: string
}



export default function CreateWorkOrderPage() {

    const [showOther, setShowOther] = useState(false);
    const [otherValue, setOtherValue] = useState("");

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
                <MdWorkHistory className="w-10 h-10" />
                <h1 className="text-3xl font-normal">Add Work Order  </h1>
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
                                <label htmlFor="no-wo-order" className="font-bold">No. Work Order</label>
                                <div className="flex items-center">
                                    <input type="text" id="no-wo-order" className="flex-1 border rounded-sm h-9 px-2" placeholder="Number" />
                                    <p className="mx-4 font-bold">/AWP-INS/JKT</p>
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
                    <div className="mt-2">
                        <table className="w-full border-separate border-spacing-y-4 border-spacing-x-4">
                            <thead>
                                <tr className="space-x-1">
                                    <th className="w-[45%] text-left">Worker's Name</th>
                                    <th className="w-[45%] text-left">Position</th>
                                    <th className="w-[5%]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rowsDataWorker.map((row, index) => (
                                    <tr key={index} className="">
                                        <td>
                                            {/* <input
                                                type="text"
                                                value={row.details}
                                                onChange={(e) =>
                                                    updateRowDataWorker(index, "details", e.target.value)
                                                }
                                                className="border rounded-sm min-h-12 px-2 w-full p-2"
                                                id="Worker-name"
                                                placeholder="Add Worker's Name"
                                            /> */}
                                            <select
                                                name=""
                                                id=""
                                                className="border rounded-sm min-h-12 px-2 w-full p-2">
                                                <option value="" className="">---Choose worker's name---</option>
                                                {/* ini nanti fetch workers nya */}
                                                <option value="test">test</option>
                                            </select>
                                        </td>

                                        <td>
                                            {/* position worker nya nanti otomatis berubah sesuai dengan worker yang dipilih */}
                                            <input
                                                type="text"
                                                value={row.details}
                                                onChange={(e) =>
                                                    updateRowDataWorker(index, "position", e.target.value)
                                                }
                                                className="border rounded-sm min-h-12 px-2 w-full p-2 bg-gray-200"
                                                id="Worker-position"
                                                placeholder="Add Worker's position"
                                                disabled
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
                            + Add Worker
                        </div>



                    </div>

                    <hr className="border-b my-6" />

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

                    {/* Work Location */}
                    <div className="flex flex-col space-y-1 my-3">
                        <label htmlFor="work-location" className="font-bold">Work Location</label>
                        <div className="flex">
                            <select className="flex-1 border rounded-sm h-9 px-2">
                                <option value="" className="font-light" hidden>---Choose work location---</option>
                                <option value="" className="font-light">Test</option>
                                {/* ini nanti fetch customer trs di loop di option*/}
                            </select>
                        </div>
                    </div>


                    {/* Customer's Phone Number */}
                    {/* ini nanti otomatis berubah setelah pilih customer */}
                    <div className="flex flex-col space-y-1 my-3">
                        <label htmlFor="work-location" className="font-bold">Customer's Phone Number</label>
                        <div className="flex">
                            <input type="text" className="flex-1 border rounded-sm h-9 px-2 bg-gray-200" disabled />
                        </div>
                    </div>


                    <hr className="border-b my-6" />

                    <h2 className="font-bold">Scope</h2>

                    <div className="flex flex-col space-y-0.5 mt-2">
                        {/* MPI */}
                        <div className="flex space-x-2">
                            <input type="checkbox" name="mpi" id="mpi" />
                            <label htmlFor="mpi">MPI</label>
                        </div>
                        {/* Penetrant Test */}
                        <div className="flex space-x-2">
                            <input type="checkbox" name="penetrant-test" id="penetrant-test" />
                            <label htmlFor="penetrant-test">Penetrant Test</label>
                        </div>
                        {/* UT Wall Thickness Spot Check */}
                        <div className="flex space-x-2">
                            <input type="checkbox" name="uwtspc" id="uwtspc" />
                            <label htmlFor="uwtspc">UT Wall Thickness Spot Check</label>
                        </div>
                        {/* Load Test */}
                        <div className="flex space-x-2">
                            <input type="checkbox" name="load-test" id="load-test" />
                            <label htmlFor="load-test">Load Test</label>
                        </div>
                        {/* Lifting Gear Inspection */}
                        <div className="flex space-x-2">
                            <input type="checkbox" name="lgi" id="lgi" />
                            <label htmlFor="lgi">Lifting Gear Inspection</label>
                        </div>
                        {/* Treating Iron Inspection */}
                        <div className="flex space-x-2">
                            <input type="checkbox" name="tii" id="tii" />
                            <label htmlFor="tii">Treating Iron Inspection</label>
                        </div>
                        {/* BHA Inspection */}
                        <div className="flex space-x-2">
                            <input type="checkbox" name="bha-inspection" id="bha-inspection" />
                            <label htmlFor="bha-inspection">BHA Inspection</label>
                        </div>
                        {/* Hydrotest/Pressure Testing */}
                        <div className="flex space-x-2">
                            <input type="checkbox" name="HydrotestPressureTesting" id="HydrotestPressureTesting" />
                            <label htmlFor="HydrotestPressureTesting">Hydrotest/Pressure Testing</label>
                        </div>
                        {/* Offshore Container Inspection */}
                        <div className="flex space-x-2">
                            <input type="checkbox" name="oci" id="oci" />
                            <label htmlFor="oci">Offshore Container Inspection</label>
                        </div>
                        {/* PRV Testing */}
                        <div className="flex space-x-2">
                            <input type="checkbox" name="prv-testing" id="prv-testing" />
                            <label htmlFor="prv-testing">PRV Testing</label>
                        </div>
                        {/* Visual Color Code */}
                        <div className="flex space-x-2">
                            <input type="checkbox" name="visualColorCode" id="visualColorCode" />
                            <label htmlFor="visualColorCode">Visual Color Code</label>
                        </div>
                        {/* Witness Leak Test */}
                        <div className="flex space-x-2">
                            <input type="checkbox" name="witnessLeakTest" id="witnessLeakTest" />
                            <label htmlFor="witnessLeakTest">Witness Leak Test</label>
                        </div>
                        {/* Sling and Shackle Inspection */}
                        <div className="flex space-x-2">
                            <input type="checkbox" name="slingandshackle" id="slingandshackle" />
                            <label htmlFor="slingandshackle">Sling and Shackle Inspection</label>
                        </div>
                        {/* Hardness Test                    */}
                        <div className="flex space-x-2">
                            <input type="checkbox" name="hardnessTest" id="hardnessTest" />
                            <label htmlFor="hardnessTest">Hardness Test</label>
                        </div>
                        {/* Spreader Bar Inspection */}
                        <div className="flex space-x-2">
                            <input type="checkbox" name="sbi" id="sbi" />
                            <label htmlFor="sbi">Spreader Bar Inspection</label>
                        </div>
                        {/* Other */}
                        <div className="flex space-x-2">
                            <input type="checkbox" name="other"
                                id="other"
                                checked={showOther}
                                onChange={(e) => setShowOther(e.target.checked)} />
                            <label htmlFor="mpi">Other</label>
                        </div>
                        {showOther && (
                            <div className="flex">
                                <input type="text" id="other-scope" value={otherValue}
                                    onChange={(e) => setOtherValue(e.target.value)} className="w-3/6 border rounded-sm h-9 px-2 bg-white mt-1" placeholder="Please specify other scope" />
                            </div>
                        )}
                    </div>

                    <hr className="border-b my-6" />

                    <div className="ml-auto w-1/4 grid grid-cols-2 space-x-4">
                        <Link href={"/admin/work-order"} className="bg-red-500 flex justify-center items-center text-white h-10 rounded-sm">Cancel</Link>
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