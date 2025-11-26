"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { HiUserAdd } from "react-icons/hi";
import { Customer, CustomerById, CustomerLocation, getCustomerById, updateCustomerRequest } from "@/lib/customer";
import { useRouter } from "next/navigation";

interface RowDataWorkLocation {
    id?: number;
    workLocation: string;
}

type EditCustomerParams = Promise<{ id: string }>;

export default function EditCustomerPage({ params }: { params: EditCustomerParams }) {

    const { id } = use(params);

    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [customerNo, setCustomerNo] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [telephone, setTelephone] = useState("");
    const [address, setAddress] = useState("");

    const [rowsWorkLocation, setRowsWorkLocation] = useState<RowDataWorkLocation[]>([]);

    // -------------------------------
    // 1. Fetch Customer by ID
    // -------------------------------
    useEffect(() => {
        const fetchData = async () => {
            const res = await getCustomerById(Number(id));

            if (res.success) {
                const c: CustomerById = res.data;

                console.log(res);

                setCustomerNo(c.customer_no);
                setCustomerName(c.name);
                setTelephone(c.phone_number);
                setAddress(c.address);

                // Use c.locations instead of c.customer_locations
                setRowsWorkLocation(
                    (c.locations || []).map((loc: CustomerLocation) => ({
                        id: loc.id,
                        workLocation: loc.location_name,
                    }))
                );
            }

            setLoading(false);
        };

        fetchData();
    }, [id]);


    const addRowWorkLocation = () => {
        setRowsWorkLocation([...rowsWorkLocation, { workLocation: "" }]);
    };

    const updateRowWorkLocation = (index: number, field: 'workLocation', value: string) => {
        const updated = [...rowsWorkLocation];
        updated[index] = { ...updated[index], workLocation: value };
        setRowsWorkLocation(updated);
    };

    const deleteRowWorkLocation = (index: number) => {
        setRowsWorkLocation(rowsWorkLocation.filter((_, i) => i !== index));
    };

    // -------------------------------
    // 2. Handle Edit Submit
    // -------------------------------
    const handleEditCustomer = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            customer_no: customerNo,
            name: customerName,
            phone_number: telephone,
            address: address,
            locations: rowsWorkLocation.map((loc) => ({
                id: loc.id || 0, // Use 0 for new locations if id is undefined
                location_name: loc.workLocation,
                customer_id: parseInt(id), // Parse id to ensure it's a number
                // created_at: loc.created_at || new Date().toISOString(),  // Add created_at
                created_at: new Date().toISOString(),  // Add created_at
                updated_at: new Date().toISOString(),  // Set updated_at to current time
            })),
        };

        const res = await updateCustomerRequest(Number(id), payload);

        if (!res.success) {
            alert("Update failed: " + res.message);
            return;
        }

        alert("Customer updated!");
        router.push("/admin/customer");
    };


    if (loading) return <p className="p-6">Loading...</p>;

    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <HiUserAdd className="w-10 h-10" />
                <h1 className="text-3xl font-normal">Edit Data Customer</h1>
            </div>

            {/* start of form container */}
            <div className="bg-white border rounded-sm px-5 py-6 shadow-xs my-12 ">
                <form onSubmit={handleEditCustomer} className="flex flex-col">
                    {/* customer number */}
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="customer-num" className="font-bold">No</label>
                        <div className="flex">
                            <input
                                type="text"
                                id="customer-num"
                                value={customerNo}
                                onChange={(e) => setCustomerNo(e.target.value)}
                                className="flex-1 border rounded-sm h-9 px-2"
                                placeholder="Add customer number"
                            />
                        </div>
                    </div>

                    {/* customer name */}
                    <div className="flex flex-col space-y-1 mt-4">
                        <label htmlFor="customer-name" className="font-bold">Name</label>
                        <div className="flex">
                            <input
                                type="text"
                                id="customer-name"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="flex-1 border rounded-sm h-9 px-2"
                                placeholder="Add customer name"
                            />
                        </div>
                    </div>

                    {/* section work location */}
                    <h2 className="mt-12 font-bold">Work Location</h2>

                    {/* work location table */}
                    <div>
                        <table className="w-full border-separate border-spacing-y-4 border-spacing-x-4">
                            <tbody>
                                {rowsWorkLocation.map((row, index) => (
                                    <tr key={index}>
                                        <td className="text-center">{index + 1}</td>

                                        <td>
                                            <input
                                                value={row.workLocation}
                                                onChange={(e) => updateRowWorkLocation(index, "workLocation", e.target.value)}
                                                className="border rounded-sm h-10 px-2 w-full p-2"
                                                placeholder="Add work location"
                                            />
                                        </td>

                                        <td className="text-center">
                                            <button
                                                type="button"
                                                className="bg-red-600 w-8 h-8 rounded-sm flex justify-center items-center"
                                                onClick={() => deleteRowWorkLocation(index)}
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
                            onClick={addRowWorkLocation}
                            className="mt-4 px-4 py-2 bg-[#17a2b8] text-white rounded flex justify-center items-center mx-4 cursor-pointer"
                        >
                            + Add Row
                        </div>
                    </div>

                    {/* telephone */}
                    <div className="mt-12 flex-col space-y-4">
                        <label htmlFor="telephone" className="font-bold">Telephone</label>
                        <div className="flex">
                            <input
                                type="text"
                                id="telephone"
                                value={telephone}
                                onChange={(e) => setTelephone(e.target.value)}
                                className="flex-1 border rounded-sm h-9 px-2"
                                placeholder="Add telephone"
                            />
                        </div>

                        {/* office address */}
                        <label htmlFor="office-address" className="font-bold">Office Address</label>
                        <div className="flex">
                            <input
                                type="text"
                                id="office-address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="flex-1 border rounded-sm h-9 px-2"
                                placeholder="Add office address"
                            />
                        </div>
                    </div>

                    <hr className="border-b my-6" />

                    {/* Action buttons */}
                    <div className="ml-auto w-1/5 grid grid-cols-2 space-x-4">
                        <Link href={"/admin/customer"} className="bg-red-500 flex justify-center items-center text-white h-10 rounded-sm">Cancel</Link>
                        <button type="submit" className="bg-[#17a2b8] flex justify-center items-center text-white h-10 rounded-sm">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
