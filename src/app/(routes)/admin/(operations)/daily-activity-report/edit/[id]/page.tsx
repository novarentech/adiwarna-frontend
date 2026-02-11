"use client";

"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa6";

import { Customer, getCustomersAllForDropdown } from "@/lib/customer";
import { Employee, getEmployeesAllForDropdown } from "@/lib/employee";

import {
    updateDailyActivity,
    getDailyActivityById,
    UpdateDailyActivityPayload,
} from "@/lib/daily-activities";

interface EditTeamRow {
    id?: number;
    employee_id: string;
}

interface EditWorkRow {
    id?: number;
    description: string;
    equipment_no: string;
}

type EditableWorkFields = "description" | "equipment_no";

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

    const router = useRouter();;

    const [loading, setLoading] = useState(false);

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);

    // FORM DATA (general info)
    const [formData, setFormData] = useState({
        po_no: "",
        po_year: "",
        ref_no: "",
        customer_id: "",
        date: "",
        location: "",
        time_from: "",
        time_to: "",
        prepared_name: "",
        prepared_pos: "",
        acknowledge_name: "",
        acknowledge_pos: "",
    });

    // TEAM MEMBERS
    const [members, setMembers] = useState<EditTeamRow[]>([]);

    // WORK DESCRIPTIONS
    const [descriptions, setDescriptions] = useState<EditWorkRow[]>([]);

    // ===========================
    // LOAD INITIAL DATA
    // ===========================
    useEffect(() => {
        const load = async () => {
            const custRes = await getCustomersAllForDropdown();
            if (custRes.success) setCustomers(custRes.data.rows || custRes.data);

            const empRes = await getEmployeesAllForDropdown();
            if (empRes.success) setEmployees(empRes.data.data || empRes.data);

            // Load existing daily activity
            const daily = await getDailyActivityById(Number(id));
            if (daily.success && daily.data) {
                const d = daily.data;

                console.log(d);

                setFormData({
                    po_no: d.po_no,
                    po_year: d.po_year,
                    ref_no: d.ref_no,
                    customer_id: d.customer.id.toString(),
                    date: d.date,
                    location: d.location,
                    time_from: d.time_from.slice(0, 5), // "08:00:00" → "08:00"
                    time_to: d.time_to.slice(0, 5),     // "17:30:00" → "17:30"
                    prepared_name: d.prepared_name,
                    prepared_pos: d.prepared_pos,
                    acknowledge_name: d.acknowledge_name,
                    acknowledge_pos: d.acknowledge_pos,
                });

                setMembers(
                    d.members.map(m => ({
                        id: m.id,
                        employee_id: m.employee_id.toString(),
                    }))
                );

                setDescriptions(
                    d.descriptions.map(desc => ({
                        id: desc.id,
                        description: desc.description,
                        equipment_no: desc.equipment_no,
                    }))
                );
            }
        };

        load();
    }, [id]);

    // ===========================
    // FORM HANDLERS
    // ===========================
    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // TEAM MEMBER ROWS
    const addMemberRow = () => {
        setMembers([...members, { employee_id: "" }]);
    };

    const updateMemberRow = (index: number, value: string) => {
        const updated = [...members];
        updated[index].employee_id = value;
        setMembers(updated);
    };

    const deleteMemberRow = (index: number) => {
        setMembers(members.filter((_, i) => i !== index));
    };

    // WORK DESCRIPTION ROWS
    const addWorkRow = () => {
        setDescriptions([...descriptions, { description: "", equipment_no: "" }]);
    };

    // const updateWorkRow = (index: number, field: keyof EditWorkRow, value: string) => {
    //     const updated = [...descriptions];
    //     updated[index][field] = value;
    //     setDescriptions(updated);
    // };

    const updateWorkRow = (
        index: number,
        field: EditableWorkFields,
        value: string
    ) => {
        const updated = [...descriptions];
        updated[index][field] = value;
        setDescriptions(updated);
    };

    const deleteWorkRow = (index: number) => {
        setDescriptions(descriptions.filter((_, i) => i !== index));
    };

    // ===========================
    // SUBMIT UPDATE
    // ===========================
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload: UpdateDailyActivityPayload = {
            po_no: formData.po_no,
            po_year: parseInt(formData.po_year),
            ref_no: formData.ref_no,
            customer_id: Number(formData.customer_id),
            date: formData.date,
            location: formData.location,
            time_from: formData.time_from,
            time_to: formData.time_to,

            members: members.map(m => ({
                ...(m.id ? { id: m.id } : {}),
                employee_id: Number(m.employee_id),
            })),


            descriptions: descriptions.map(d => ({
                ...(d.id ? { id: d.id } : {}),
                description: d.description,
                equipment_no: d.equipment_no,
            })),

            prepared_name: formData.prepared_name,
            prepared_pos: formData.prepared_pos,
            acknowledge_name: formData.acknowledge_name,
            acknowledge_pos: formData.acknowledge_pos,
        };

        console.log(payload)

        const result = await updateDailyActivity(Number(id), payload);

        if (result.success) {
            alert("Daily Activity updated successfully!");
            router.push("/admin/daily-activity-report");
        } else {
            alert("Failed: " + result.message);
        }

        setLoading(false);
    };
    // ==========================
    // LOADING STATE
    // ==========================
    if (loading) return <p className="p-6">Loading...</p>;



    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <h1 className="text-3xl font-normal">Edit Daily Activity  </h1>
            </div>

            {/* start of form container */}
            <div className="bg-white border rounded-sm px-5 py-6 shadow-xs my-12 ">
                {/* start form */}
                <form onSubmit={handleUpdate} className="flex flex-col">
                    {/* seperate into 2 section */}
                    <div className="grid grid-cols-2 space-x-4">
                        {/* left column */}
                        <div className="flex flex-col space-y-4">
                            {/* Ref. AWP W.O. No. */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="po_no" className="font-bold">Ref. AWP W.O. No. <span className="text-red-500">*</span></label>
                                <div className="flex items-center">
                                    <input type="text" id="po_no" required value={formData.po_no}
                                        onChange={handleFormChange} className="flex-1 border rounded-sm h-9 px-2" placeholder="Number" />
                                    <p className="mx-4 font-bold">/AWP-INS/</p>
                                    <input type="text" id="po_year" required value={formData.po_year}
                                        onChange={handleFormChange} className="flex-1 border rounded-sm h-9 px-2" placeholder="year" />
                                </div>
                            </div>
                            {/* customer */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="customer" className="font-bold">Customer <span className="text-red-500">*</span></label>
                                <div className="flex">
                                    <select id="customer_id" required value={formData.customer_id}
                                        onChange={handleFormChange} className="flex-1 border rounded-sm h-9 px-2">
                                        <option value="" className="font-light" hidden>---Choose Customer's Name---</option>
                                        {customers.map(customer => (
                                            <option key={customer.id} value={customer.id}>
                                                {customer.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {/* customer address */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="location" className="font-bold">Location / Jobsite <span className="text-red-500">*</span></label>
                                <div className="flex">
                                    {/* ini nanti value nya otomatis ambil dari customer */}
                                    <input type="text" id="location" required value={formData.location}
                                        onChange={handleFormChange} className="flex-1 border rounded-sm h-9 px-2 " />
                                </div>
                            </div>
                        </div>
                        {/* right column */}
                        <div className="flex flex-col space-y-4">
                            {/* Service Contract No./ PO No. */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="ref_no" className="font-bold">Service Contract No./ PO No. <span className="text-red-500">*</span></label>
                                <div className="flex">
                                    <input type="text" id="ref_no" required value={formData.ref_no}
                                        onChange={handleFormChange} className="flex-1 border rounded-sm h-9 px-2" />
                                </div>
                            </div>
                            <div className="flex flex-col space-y-4">
                                {/* date */}
                                <div className="flex flex-col space-y-1">
                                    {/* year */}
                                    <label htmlFor="date" className="font-bold">Date <span className="text-red-500">*</span></label>
                                    <div className="flex items-center">
                                        <input type="date" id="date" required value={formData.date}
                                            onChange={handleFormChange} className="flex-1 border rounded-sm h-9 px-2" />
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
                                    <th className="w-[90%] text-left">Team Member <span className="text-red-500">*</span></th>
                                    <th className="w-[5%]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map((m, index) => (
                                    <tr key={index} className="">
                                        <td className="text-center">{index + 1}</td>
                                        <td>
                                            <select
                                                name="employee_id"
                                                id="employee_id"
                                                value={m.employee_id}
                                                onChange={(e) =>
                                                    updateMemberRow(index, e.target.value)
                                                }
                                                required
                                                className="border rounded-sm min-h-12 px-2 w-full p-2">
                                                <option value="" className="">---Choose team member---</option>
                                                {employees.map(e => (
                                                    <option key={e.id} value={e.id}>
                                                        {e.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        <td className="text-center">
                                            <button
                                                className="bg-red-600 w-8 h-8 rounded-sm flex justify-center items-center cursor-pointer"
                                                onClick={() => deleteMemberRow(index)}
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
                            onClick={addMemberRow}
                            className="mt-4 px-4 py-2 bg-[#17a2b8] text-white rounded flex justify-center items-center mx-4 cursor-pointer"
                        >
                            + Add row
                        </div>
                    </div>


                    {/* time duration */}
                    <div className="flex flex-col space-y-4 mt-6 w-4/6 mx-auto">
                        {/* ffrom */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="time_from" className="font-bold">From <span className="text-red-500">*</span></label>
                            <div className="flex">
                                <input type="time" name="from-duration" id="time_from" required value={formData.time_from}
                                    onChange={handleFormChange} className="flex-1 border rounded-sm h-9 px-2" placeholder="hh:mm" />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-1">
                                {/* to */}
                                <label htmlFor="time_to" className="font-bold">to <span className="text-red-500">*</span></label>
                                <div className="flex items-center">
                                    <input type="time" id="time_to" required value={formData.time_to}
                                        onChange={handleFormChange} className="flex-1 border rounded-sm h-9 px-2" />
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
                                    <th className="w-[45%] text-left">Work Description <span className="text-red-500">*</span></th>
                                    <th className="w-[45%] text-left">Equipment No <span className="text-red-500">*</span></th>
                                    <th className="w-[5%]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {descriptions.map((d, index) => (
                                    <tr key={index} className="">
                                        <td className="text-center">{index + 1}</td>

                                        <td className="flex flex-row items-center">

                                            <input
                                                type="type"
                                                value={d.description}
                                                onChange={(e) =>
                                                    updateWorkRow(index, "description", e.target.value)
                                                }
                                                className="border rounded-sm h-12 px-2 w-full p-2 flex-1"
                                                id="wo-year"
                                                placeholder="Enter work description"
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="text"
                                                value={d.equipment_no}
                                                onChange={(e) =>
                                                    updateWorkRow(index, "equipment_no", e.target.value)
                                                }
                                                className="border rounded-sm h-12 px-2 w-full p-2 flex-1"
                                                id="wo-number"
                                                placeholder="Enter Equipment number"
                                            />
                                        </td>

                                        <td className="text-center">
                                            <button
                                                className="bg-red-600 w-8 h-8 rounded-sm flex justify-center items-center cursor-pointer"
                                                onClick={() => deleteWorkRow(index)}
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
                            onClick={addWorkRow}
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
                                <label htmlFor="prepared_name" className="font-bold">Prepared By <span className="text-red-500">*</span></label>
                                <div className="flex items-center">
                                    <input type="text" id="prepared_name" required value={formData.prepared_name}
                                        onChange={handleFormChange} className="flex-1 border rounded-sm h-9 px-2" placeholder="Enter name" />
                                </div>
                            </div>
                            <div className="flex flex-col space-y-1">
                                {/* TA No. */}
                                <label htmlFor="acknowledge_name" className="font-bold">Acknowledged By <span className="text-red-500">*</span></label>
                                <div className="flex items-center">
                                    <input type="text" id="acknowledge_name" required value={formData.acknowledge_name}
                                        onChange={handleFormChange} className="flex-1 border rounded-sm h-9 px-2" placeholder="Enter name" />
                                </div>
                            </div>
                        </div>
                        {/* right */}
                        <div className="flex flex-col space-y-4">
                            {/* position */}
                            <div className="flex flex-col space-y-1">
                                {/* position prepared by */}
                                <label htmlFor="prepared_pos" className="font-bold">Position <span className="text-red-500">*</span></label>
                                <div className="flex items-center">
                                    <input type="text" id="prepared_pos" required value={formData.prepared_pos}
                                        onChange={handleFormChange} className="flex-1 border rounded-sm h-9 px-2" placeholder="Enter position" />
                                </div>
                            </div>
                            <div className="flex flex-col space-y-1">
                                {/* position aknowledge by */}
                                <label htmlFor="acknowledge_pos" className="font-bold">Position <span className="text-red-500">*</span></label>
                                <div className="flex items-center">
                                    <input type="text" id="acknowledge_pos" required value={formData.acknowledge_pos}
                                        onChange={handleFormChange} className="flex-1 border rounded-sm h-9 px-2" placeholder="Enter position" />
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