"use client";

import { MdAddShoppingCart, MdAssignment } from "react-icons/md";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { getWorkAssignmentById, updateWorkAssignment } from "@/lib/work-assignment";
import { Customer, getCustomerById, getCustomersAllForDropdown } from "@/lib/customer";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RowDataWorker {
    details: string;
    position: string;
    id?: number;
}

interface CustomerLocation {
    id: number;
    customer_id: number;
    location_name: string;
    created_at: string;
    updated_at: string;
}

type EditWokAssignmentParams = Promise<{ id: string }>;

export default function EditWorkAssignmentPage({
    params,
}: {
    params: EditWokAssignmentParams;
}) {
    const actualParams = use(params);
    const id = actualParams.id;

    const router = useRouter();

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customersLocation, setCustomersLocation] = useState<CustomerLocation[]>([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        assignment_no: "",
        assignment_year: "",
        date: "",
        ref_no: "",
        ref_year: "",
        customer_id: "",
        customer_location_id: "",
        ref_po_no_instruction: "",
        scope: "",
        estimation: "",
        mobilization: "",
        auth_name: "",
        auth_pos: "",
    });

    const [rowsDataWorker, setRowsDataWorker] = useState<RowDataWorker[]>([]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;

        if (id === "date") {
            const year = new Date(value).getFullYear().toString();
            setFormData(prev => ({ ...prev, [id]: value, assignment_year: year }));
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };

    // Fetch customers untuk dropdown
    useEffect(() => {
        const fetchCustomers = async () => {
            const result = await getCustomersAllForDropdown();
            if (result.success && result.data) {
                setCustomers(result.data.rows || result.data);
            }
        };
        fetchCustomers();
    }, []);

    // Fetch detail Work Assignment by ID
    useEffect(() => {
        if (!id) return;

        const fetchWorkAssignment = async () => {
            const res = await getWorkAssignmentById(id);
            if (res.success && res.data) {
                const data = res.data;
                setFormData({
                    assignment_no: data.assignment_no,
                    assignment_year: String(data.assignment_year),
                    date: data.date.split("T")[0],
                    ref_no: data.ref_no,
                    ref_year: String(data.ref_year),
                    customer_id: String(data.customer.id),
                    customer_location_id: data.customer_location_id ? String(data.customer_location_id) : "",
                    ref_po_no_instruction: data.ref_po_no_instruction || "",
                    scope: data.scope,
                    estimation: data.estimation,
                    mobilization: data.mobilization,
                    auth_name: data.auth_name,
                    auth_pos: data.auth_pos,
                });

                setRowsDataWorker(
                    data.workers.map(w => ({
                        id: w.id,
                        details: w.worker_name,
                        position: w.position,
                    }))
                );
            }
        };

        fetchWorkAssignment();
    }, [id]);

    // Fetch customer location jika customer_id berubah
    useEffect(() => {
        const fetchCustomerDetail = async () => {
            if (!formData.customer_id) return;
            const result = await getCustomerById(Number(formData.customer_id));
            if (result && result.data) {
                setCustomersLocation(result.data.locations || []);
            } else {
                setCustomersLocation([]);
            }
        };
        fetchCustomerDetail();
    }, [formData.customer_id]);

    const addRowDataWorker = () => {
        setRowsDataWorker([...rowsDataWorker, { details: "", position: "" }]);
    };

    const updateRowDataWorker = <K extends keyof RowDataWorker>(
        index: number,
        field: K,
        value: RowDataWorker[K] // automatically matches type
    ) => {
        const updated = [...rowsDataWorker];
        updated[index][field] = value;
        setRowsDataWorker(updated);
    };

    const deleteRowDataWorker = (index: number) => {
        setRowsDataWorker(rowsDataWorker.filter((_, i) => i !== index));
    };

    // Update Work Assignment
    const handleUpdateWorkAssignment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const workers = rowsDataWorker.map(w => ({
            id: w.id,
            worker_name: w.details,
            position: w.position,
        }));

        const payload = {
            ...formData,
            assignment_year: parseInt(formData.assignment_year),
            ref_year: parseInt(formData.ref_year),
            customer_id: parseInt(formData.customer_id),
            customer_location_id: parseInt(formData.customer_location_id),
            workers,
        };

        try {
            const data = await updateWorkAssignment(id, payload);
            if (!data.success) {
                // alert(`Gagal: ${data.message}`);
                toast.error(`Failed to Update: ${data.message}`);
                setLoading(false);
                return;
            }

            // alert("Work Assignment berhasil diperbarui!");
            toast.success("Successfully updated Work Assignment!");
            router.push("/admin/work-assignment");
        } catch (err) {
            console.error(err);
            toast.error(`Failed to Update: ${err}`);
            setLoading(false);
        }
    };


    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <MdAssignment className="w-10 h-10" />
                <h1 className="text-3xl font-normal">Edit Work Assignment  </h1>
            </div>

            {/* start of form container */}
            <div className="bg-white border rounded-sm px-5 py-6 shadow-xs my-12 ">
                {/* start form */}
                <form onSubmit={handleUpdateWorkAssignment} className="flex flex-col">
                    {/* seperate into 3 section */}
                    <div className="grid grid-cols-2 space-x-4">
                        {/* left column */}
                        <div className="flex flex-col space-y-4">
                            {/* REF */}
                            <div className="flex flex-col space-y-1">
                                {/* nomor */}
                                <label htmlFor="assignment_no" className="font-bold">No. <span className="text-red-500">*</span></label>
                                <div className="flex items-center">
                                    <input type="text" id="assignment_no" required value={formData.assignment_no}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" placeholder="Add number" />
                                    <p className="mx-4 font-bold">/AWP-INS/</p>
                                    <input type="text" id="assignment_year" required disabled value={formData.assignment_year}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2 bg-gray-100 cursor-not-allowed" placeholder="year" />
                                </div>
                            </div>
                        </div>
                        {/* right column */}
                        <div className="flex flex-col space-y-4">
                            {/* Date */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="date" className="font-bold">Date <span className="text-red-500">*</span></label>
                                <div className="flex">
                                    <input type="date" id="date" required value={formData.date}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" />
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
                                    <th className="w-[45%] text-left">Worker's Name <span className="text-red-500">*</span></th>
                                    <th className="w-[45%] text-left">Position <span className="text-red-500">*</span></th>
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
                                                required
                                                value={row.details}
                                                onChange={(e) =>
                                                    updateRowDataWorker(index, "details", e.target.value)
                                                }
                                                className="border border-[#AAAAAA] rounded-sm min-h-12 px-2 w-full p-2"
                                                id="Worker-name"
                                                placeholder="Add Worker's Name"
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="text"
                                                required
                                                value={row.position}
                                                onChange={(e) =>
                                                    updateRowDataWorker(index, "position", e.target.value)
                                                }
                                                className="border border-[#AAAAAA] rounded-sm min-h-12 px-2 w-full p-2"
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
                            className="mt-4 px-4 py-2 bg-[#31C6D4] text-white rounded flex justify-center items-center mx-4 cursor-pointer"
                        >
                            + Add Row
                        </div>



                    </div>

                    <hr className="border-b my-6" />

                    <div className="grid grid-cols-[2fr_1fr_3fr] my-3 space-x-4">
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-1">
                                {/* Ref. AWP WO No. */}
                                <label htmlFor="ref_no" className="font-bold">Ref. AWP WO No. <span className="text-red-500">*</span></label>
                                <div className="flex items-center">
                                    <input type="text" id="ref_no" required value={formData.ref_no}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" />
                                    <p className="mx-2 font-bold">/AWP-INS/JKT/</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            {/* quotations valid */}
                            <div className="flex flex-col space-y-1">
                                {/* year */}
                                <label htmlFor="ref_year" className="font-bold text-transparent">.</label>
                                <div className="flex items-center">
                                    <input type="text" id="ref_year" required value={formData.ref_year}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" placeholder="Year" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            {/* Ref. PO No./Instruction */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="ref_po_no_instruction" className="font-bold  ">Ref. PO No./Instruction <span className="text-red-500">*</span></label>
                                <div className="flex items-center">
                                    {/* ini nanti fetch dari customerr */}
                                    <input type="text" id="ref_po_no_instruction" required value={formData.ref_po_no_instruction}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" placeholder="Add Ref. PO No./Instruction" />
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* customer */}
                    <div className="flex flex-col space-y-1 my-3">
                        <label htmlFor="customer" className="font-bold">Customer <span className="text-red-500">*</span></label>
                        <div className="flex">
                            <select id="customer_id" required
                                value={formData.customer_id}
                                onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2">
                                <option value="" className="font-light" hidden>---Choose Customer's Name---</option>
                                {customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>


                    <hr className="border-b my-6" />

                    <div className="grid grid-cols-2 space-x-4">
                        {/* left column */}
                        <div className="flex flex-col space-y-4">
                            {/* Work Location */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="worklocation" className="font-bold">Work Location <span className="text-red-500">*</span></label>
                                <div className="flex">
                                    <select id="customer_location_id" required
                                        value={formData.customer_location_id}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2">
                                        <option value="" className="font-light" hidden>---Choose work location---</option>
                                        {customersLocation.map(location => (
                                            <option key={location.id} value={location.id}>
                                                {location.location_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {/* scope of work */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="scope" className="font-bold">Scope of Work <span className="text-red-500">*</span></label>
                                <div className="flex">
                                    <input type="text" id="scope" required value={formData.scope}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" placeholder="Add Scope of Work" />
                                </div>
                            </div>
                            {/* author */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="auth_name" className="font-bold">Authorized By <span className="text-red-500">*</span></label>
                                <div className="flex">
                                    <input type="text" id="auth_name" required value={formData.auth_name}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" placeholder="Masukkan nama" />
                                </div>
                            </div>
                        </div>
                        {/* right column */}
                        <div className="flex flex-col space-y-4">
                            {/* Estimate Duration */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="estimation" className="font-bold">Estimate Duration <span className="text-red-500">*</span></label>
                                <div className="flex">
                                    <input type="text" value={formData.estimation} required
                                        onChange={handleFormChange} id="estimation" className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" placeholder="Add estimate duration (days)" />
                                </div>
                            </div>
                            {/* Mobilization */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="mobilization" className="font-bold">Mobilization <span className="text-red-500">*</span></label>
                                <div className="flex">
                                    <input type="text" id="mobilization" required value={formData.mobilization}
                                        onChange={handleFormChange} maxLength={255} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" placeholder="Add Mobilization " />
                                </div>
                            </div>
                            {/* position authorized by */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="auth_pos" className="font-bold">Position <span className="text-red-500">*</span></label>
                                <div className="flex">
                                    <input type="text" id="auth_pos" required value={formData.auth_pos}
                                        onChange={handleFormChange} className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2" placeholder="Add Postion " />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-b my-6" />

                    <div className="ml-auto w-1/4 grid grid-cols-2 space-x-4">
                        <Link href={"/admin/work-assignment"} className="bg-red-500 flex justify-center items-center text-white h-10 rounded-sm">Cancel</Link>
                        <button type="submit" className="bg-[#31C6D4] flex justify-center items-center text-white h-10 rounded-sm">Save</button>
                    </div>
                </form>
                {/* end form */}
            </div >
            {/* end of form container */}

            <div className="h-20 text-transparent" >.</div>
        </div >
    )
}