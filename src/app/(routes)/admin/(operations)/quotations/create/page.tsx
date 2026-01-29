"use client";
import { Customer, getCustomers, getCustomersAllForDropdown } from "@/lib/customer";
import {
    AdiwarnaPayload,
    ClientPayload,
    createQuotation,
    CreateQuotationPayload,
    QuotationItemPayload
} from "@/lib/quotations";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";

import { toast } from "sonner"; // Import toast

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

    const router = useRouter();

    // CUSTOMER DATA
    const [customers, setCustomers] = useState<Customer[]>([]);

    const [loading, setLoading] = useState(false);

    // FORM DATA
    const [formData, setFormData] = useState({
        ref_no: "",
        ref_year: "",
        customer_id: "",
        subject: "",
        date: "",
        pic_name: "",
        pic_phone: "",
        top: "",
        valid_until: "",
        clause: "",
        workday: "",
        auth_name: "",
        auth_position: "",
        discount: "",
    });

    // Fetch customers
    // Fetch customers
    useEffect(() => {
        const fetchCustomers = async () => {
            const result = await getCustomersAllForDropdown();
            if (result.success && result.data) {
                setCustomers(result.data.rows || result.data);
            }
        };
        fetchCustomers();
    }, []);

    // Form handler
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // -----------------------------
    // TABLE: SCOPE OF WORK
    // -----------------------------
    const [rowsScope, setRowsScope] = useState<RowDataScope[]>([
        { qty: "", unit: "", description: "", unitRate: "" },
    ]);

    const addRowScope = () =>
        setRowsScope(prev => [...prev, { qty: "", unit: "", description: "", unitRate: "" }]);

    const updateRowScope = (i: number, field: keyof RowDataScope, value: string) => {
        const copy = [...rowsScope];
        copy[i][field] = value;
        setRowsScope(copy);
    };

    const deleteRowScope = (i: number) =>
        setRowsScope(prev => prev.filter((_, idx) => idx !== i));

    // -----------------------------
    // TABLE: ADIWARNA PROVIDE
    // -----------------------------
    const [rowsAdiwarna, setRowsAdiwarna] = useState<RowDataAdiwarnaProvide[]>([
        { details: "" },
    ]);

    const addRowAdiwarna = () =>
        setRowsAdiwarna(prev => [...prev, { details: "" }]);

    const updateRowAdiwarna = (i: number, field: keyof RowDataAdiwarnaProvide, value: string) => {
        const copy = [...rowsAdiwarna];
        copy[i][field] = value;
        setRowsAdiwarna(copy);
    };

    const deleteRowAdiwarna = (i: number) =>
        setRowsAdiwarna(prev => prev.filter((_, idx) => idx !== i));

    // -----------------------------
    // TABLE: CLIENT PROVIDE
    // -----------------------------
    const [rowsClient, setRowsClient] = useState<RowDataClientProvide[]>([
        { details: "" },
    ]);

    const addRowClient = () =>
        setRowsClient(prev => [...prev, { details: "" }]);

    const updateRowClient = (i: number, field: keyof RowDataClientProvide, value: string) => {
        const copy = [...rowsClient];
        copy[i][field] = value;
        setRowsClient(copy);
    };

    const deleteRowClient = (i: number) =>
        setRowsClient(prev => prev.filter((_, idx) => idx !== i));

    // -----------------------------
    // SUBMIT HANDLER
    // -----------------------------
    const handleCreateQuotations = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Items
        const items: QuotationItemPayload[] = rowsScope
            .filter(r => r.qty && r.unitRate)
            .map(r => ({
                description: r.description || "N/A",
                quantity: parseFloat(r.qty),
                unit: r.unit,
                rate: parseFloat(r.unitRate),
            }));

        // Adiwarna Provide
        const adiwarnas: AdiwarnaPayload[] = rowsAdiwarna
            .filter(r => r.details)
            .map(r => ({ adiwarna_description: r.details }));

        // Client Provide
        const clients: ClientPayload[] = rowsClient
            .filter(r => r.details)
            .map(r => ({ client_description: r.details }));

        const payload: CreateQuotationPayload = {
            date: formData.date,
            ref_no: formData.ref_no,
            ref_year: parseInt(formData.ref_year),
            customer_id: parseInt(formData.customer_id),
            pic_name: formData.pic_name,
            pic_phone: formData.pic_phone,
            subject: formData.subject,
            top: formData.top,
            valid_until: formData.valid_until,
            clause: formData.clause,
            workday: formData.workday,
            auth_name: formData.auth_name,
            auth_position: formData.auth_position,
            discount: parseFloat(formData.discount) || 0,
            items,
            adiwarnas,
            clients,
        };

        console.log("PAYLOAD:", payload);

        const result = await createQuotation(payload);

        if (result.success) {
            // alert("Quotation berhasil dibuat!");
            toast.success("Successfully created quotation!");
            setLoading(false);
            router.push("/admin/quotations");
        } else {
            // alert(`Gagal: ${result.message}`);
            toast.error("Failed to create: " + result.message);
        }
    };

    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            <div className="flex flex-row items-center space-x-2 mt-2">
                <MdEdit className="w-10 h-10" />
                <h1 className="text-3xl font-normal">Add Quotations</h1>
            </div>

            <div className="bg-white border rounded-sm px-5 py-6 shadow-xs my-12">
                <form onSubmit={handleCreateQuotations} className="flex flex-col">

                    <div className="grid grid-cols-2 space-x-4">
                        <div className="flex flex-col space-y-4">
                            <div>
                                <label className="font-bold">Ref.</label>
                                <div className="flex items-center mt-1">
                                    <input
                                        type="text"
                                        id="ref_no"
                                        required
                                        value={formData.ref_no}
                                        onChange={handleFormChange}
                                        className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2"
                                        placeholder="Add Number"
                                    />
                                    <p className="mx-4 font-bold">/AWS-INS/</p>
                                    <input
                                        type="text"
                                        id="ref_year"
                                        required
                                        value={formData.ref_year}
                                        onChange={handleFormChange}
                                        className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2"
                                        placeholder="Year"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="font-bold">Customer</label>
                                <select
                                    id="customer_id"
                                    required
                                    value={formData.customer_id}
                                    onChange={handleFormChange}
                                    className="flex-1 border border-[#AAAAAA] rounded-sm h-9 py-1.5 px-2 mt-1 block "
                                >
                                    <option value="" hidden>---Choose Customer---</option>
                                    {customers.map(customer => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="font-bold">Subject</label>
                                <input
                                    id="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleFormChange}
                                    className="border border-[#AAAAAA] rounded-sm h-9 px-2 w-full mt-1"
                                    placeholder="Add Subject"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col space-y-4">
                            <div>
                                <label className="font-bold">Date</label>
                                <input
                                    type="date"
                                    id="date"
                                    required
                                    value={formData.date}
                                    onChange={handleFormChange}
                                    className="border border-[#AAAAAA] rounded-sm h-9 px-2 w-full mt-1"
                                />
                            </div>

                            <div>
                                <label className="font-bold">Person in Charge (PIC)</label>
                                <input
                                    type="text"
                                    id="pic_name"
                                    required
                                    value={formData.pic_name}
                                    onChange={handleFormChange}
                                    className="border border-[#AAAAAA] rounded-sm h-9 px-2 w-full mt-1"
                                    placeholder="Add PIC's name"
                                />
                            </div>

                            <div>
                                <label className="font-bold">PIC's Phone Number</label>
                                <input
                                    type="text"
                                    id="pic_phone"
                                    required
                                    value={formData.pic_phone}
                                    onChange={handleFormChange}
                                    className="border border-[#AAAAAA] rounded-sm h-9 px-2 w-full mt-1"
                                    placeholder="Add Phone Number"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12">
                        {/* input table */}
                        <table className="w-full border-separate border-spacing-y-4 border-spacing-x-4">
                            <thead>
                                <tr>
                                    <th className="w-[5%]">No</th>
                                    <th className="w-[10%]">Qty</th>
                                    <th className="w-[10%]">Unit</th>
                                    <th className="w-[50%]">Description</th>
                                    <th className="w-[20%]">Unit Rate</th>
                                    <th className="w-[5%]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rowsScope.map((row, index) => (
                                    <tr key={index}>
                                        <td className="text-center">{index + 1}</td>

                                        <td>
                                            <input
                                                type="number"
                                                required
                                                value={row.qty}
                                                onChange={(e) => updateRowScope(index, "qty", e.target.value)}
                                                className="border border-[#AAAAAA] rounded-sm h-9 px-2 w-full"
                                            />
                                        </td>

                                        <td>
                                            <input
                                                required
                                                value={row.unit}
                                                onChange={(e) => updateRowScope(index, "unit", e.target.value)}
                                                className="border border-[#AAAAAA] rounded-sm h-9 px-2 w-full"
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="text"
                                                required
                                                value={row.description}
                                                onChange={(e) =>
                                                    updateRowScope(index, "description", e.target.value)
                                                }
                                                className="border border-[#AAAAAA] rounded-sm h-9 px-2 w-full"
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="number"
                                                required
                                                value={row.unitRate}
                                                onChange={(e) =>
                                                    updateRowScope(index, "unitRate", e.target.value)
                                                }
                                                className="border border-[#AAAAAA] rounded-sm h-9 px-2 w-full"
                                            />
                                        </td>

                                        <td className="text-center">
                                            <button
                                                type="button"
                                                onClick={() => deleteRowScope(index)}
                                                className="bg-red-600 w-8 h-8 rounded-sm flex justify-center items-center"
                                            >
                                                <FaTrash className="text-white" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                    <button
                        type="button"
                        onClick={addRowScope}
                        className="mt-4 px-4 py-2 bg-[#31C6D4] text-white rounded"
                    >
                        + Add Row
                    </button>

                    <h2 className="mt-10 font-bold">PT Adiwarna To Provide</h2>

                    <table className="w-full border-separate border-spacing-y-4 mt-4">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Details</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowsAdiwarna.map((row, index) => (
                                <tr key={index}>
                                    <td className="text-center">{index + 1}</td>

                                    <td>
                                        <textarea
                                            required
                                            value={row.details}
                                            onChange={(e) =>
                                                updateRowAdiwarna(index, "details", e.target.value)
                                            }
                                            className="border border-[#AAAAAA] rounded-sm p-2 w-full min-h-16"
                                        />
                                    </td>

                                    <td className="text-center">
                                        <button
                                            type="button"
                                            onClick={() => deleteRowAdiwarna(index)}
                                            className="bg-red-600 w-8 h-8 rounded-sm flex justify-center items-center mx-auto"
                                        >
                                            <FaTrash className="text-white" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button
                        type="button"
                        onClick={addRowAdiwarna}
                        className="mt-4 px-4 py-2 bg-[#31C6D4] text-white rounded"
                    >
                        + Add Row
                    </button>

                    <h2 className="mt-10 font-bold">Client To Provide</h2>

                    <table className="w-full border-separate border-spacing-y-4 mt-4">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Details</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {rowsClient.map((row, index) => (
                                <tr key={index}>
                                    <td className="text-center">{index + 1}</td>

                                    <td>
                                        <textarea
                                            required
                                            value={row.details}
                                            onChange={(e) =>
                                                updateRowClient(index, "details", e.target.value)
                                            }
                                            className="border border-[#AAAAAA] rounded-sm p-2 w-full min-h-16"
                                        />
                                    </td>

                                    <td className="text-center">
                                        <button
                                            type="button"
                                            onClick={() => deleteRowClient(index)}
                                            className="bg-red-600 w-8 h-8 rounded-sm flex justify-center items-center mx-auto"
                                        >
                                            <FaTrash className="text-white" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button
                        type="button"
                        onClick={addRowClient}
                        className="mt-4 px-4 py-2 bg-[#31C6D4] text-white rounded"
                    >
                        + Add Row
                    </button>

                    <div className="mt-10 space-y-4">
                        <div className="grid grid-cols-2">
                            <div className="flex flex-col">
                                <label className="font-bold">Terms of Payment</label>
                                <div className="flex flex-row mt-1 items-center">
                                    <input
                                        id="top"
                                        required
                                        className="border border-[#AAAAAA] rounded-sm h-9 px-2 flex-1"
                                        type="text"
                                        value={formData.top}
                                        onChange={handleFormChange}
                                    />
                                    <p className="mx-3 font-bold">Days</p>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="font-bold">Quotation Valid</label>
                                <div className="flex flex-row mt-1 items-center">
                                    <input
                                        id="valid_until"
                                        required
                                        className="border border-[#AAAAAA] rounded-sm h-9 px-2 flex-1"
                                        type="date"
                                        value={formData.valid_until}
                                        onChange={handleFormChange}
                                    />
                                    <p className="ml-3 font-bold">Days</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="font-bold">Clause</label>
                            <input
                                id="clause"
                                required
                                className="border border-[#AAAAAA] rounded-sm h-9 px-2 w-full mt-1"
                                value={formData.clause}
                                onChange={handleFormChange}
                            />
                        </div>

                        <div>
                            <label className="font-bold">Workday</label>
                            <input
                                id="workday"
                                required
                                className="border border-[#AAAAAA] rounded-sm h-9 px-2 w-full mt-1"
                                value={formData.workday}
                                onChange={handleFormChange}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="font-bold">Authorized By</label>
                                <input
                                    id="auth_name"
                                    required
                                    className="border border-[#AAAAAA] rounded-sm h-9 px-2 w-full mt-1"
                                    value={formData.auth_name}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div>
                                <label className="font-bold">Position</label>
                                <input
                                    id="auth_position"
                                    required
                                    className="border border-[#AAAAAA] rounded-sm h-9 px-2 w-full mt-1"
                                    value={formData.auth_position}
                                    onChange={handleFormChange}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="font-bold">Discount</label>
                            <div className="flex flex-row items-center space-x-2">
                                <input
                                    id="discount"
                                    required
                                    className="border border-[#AAAAAA] rounded-sm h-9 px-2 w-1/4 mt-1"
                                    value={formData.discount}
                                    onChange={handleFormChange}
                                />
                                <p>{"(%)"}</p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-b my-6" />

                    <div className="ml-auto w-1/3 grid grid-cols-2 gap-4">
                        <Link
                            href={"/admin/quotations"}
                            className="bg-red-500 text-white h-10 rounded-sm flex items-center justify-center"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            className="bg-[#31C6D4] text-white h-10 rounded-sm"
                        >
                            {loading ? "loading..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
}
