"use client";
import { CreateCustomerBody, createCustomerRequest } from "@/lib/customer";
// import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaTrash } from "react-icons/fa6";
// import { MdEdit } from "react-icons/md";
import { HiUserAdd } from "react-icons/hi";
import { toast } from "sonner";


interface RowDataWorkLocation {
    workLocation: string;
}
export default function CreateCustomerPage() {

    const router = useRouter();

    // bagian ADiwarna Provide
    const [rowsWorkLocation, setRowsWorkLocation] = useState<RowDataWorkLocation[]>([
        { workLocation: "" },
    ]);

    const addRowWorkLocation = () => {
        setRowsWorkLocation([...rowsWorkLocation, { workLocation: "" }]);
    };

    const updateRowWorkLocation = (index: number, field: keyof RowDataWorkLocation, value: string) => {
        const updated = [...rowsWorkLocation];
        updated[index][field] = value;
        setRowsWorkLocation(updated);
    };

    const deleteRowWorkLocation = (index: number) => {
        setRowsWorkLocation(rowsWorkLocation.filter((_, i) => i !== index));
    };

    const [customerNo, setCustomerNo] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const handleCreateCustomer = async (e: React.FormEvent) => {
        e.preventDefault();

        // Convert dynamic rows → array locations
        const customer_locations = rowsWorkLocation
            .filter(row => row.workLocation.trim() !== "")
            .map(row => ({
                location_name: row.workLocation,
            }));

        const payload: CreateCustomerBody = {
            customer_no: customerNo,
            name,
            phone_number: phone,
            address,
            customer_locations,
        };

        const res = await createCustomerRequest(payload);

        if (!res.success) {
            // alert("Failed to create customer: " + res.message);
            toast.error("Failed to create customer: " + res.message);
            return;
        }

        // alert("Customer created!");
        toast.success("Customer created!");
        router.push("/admin/customer");
    };

    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <HiUserAdd className="w-10 h-10" />
                <h1 className="text-3xl font-normal">Add Data Customer  </h1>
            </div>

            {/* start of form container */}
            <div className="bg-white border rounded-sm px-5 py-6 shadow-xs my-12 ">
                {/* start form */}
                <form onSubmit={handleCreateCustomer} className="flex flex-col">
                    {/* no */}
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="customer-num" className="font-bold">No</label>
                        <div className="flex">
                            <input type="text" id="customer-num" className="flex-1 border rounded-sm h-9 px-2" value={customerNo}
                                onChange={(e) => setCustomerNo(e.target.value)} placeholder="add customer number" />
                        </div>
                    </div>
                    {/* Name */}
                    <div className="flex flex-col space-y-1 mt-4">
                        <label htmlFor="customer-name" className="font-bold">Name</label>
                        <div className="flex">
                            <input type="text" id="customer-name" className="flex-1 border rounded-sm h-9 px-2" value={name}
                                onChange={(e) => setName(e.target.value)} placeholder="Add customer name" />
                        </div>
                    </div>

                    {/* section work location*/}
                    <h2 className="mt-12 font-bold">Work Location</h2>
                    {/* worrk location */}
                    <div>
                        <table className="w-full border-separate border-spacing-y-4 border-spacing-x-4">
                            <tbody>
                                {rowsWorkLocation.map((row, index) => (
                                    <tr key={index} className="">
                                        <td className="text-center">{index + 1}</td>

                                        <td>
                                            <input
                                                value={row.workLocation}
                                                onChange={(e) =>
                                                    updateRowWorkLocation(index, "workLocation", e.target.value)
                                                }
                                                className="border rounded-sm h-10 px-2 w-full p-2"
                                                placeholder="Add work location"
                                            />
                                        </td>

                                        <td className="text-center">
                                            <button
                                                className="bg-red-600 w-8 h-8 rounded-sm flex justify-center items-center cursor-pointer"
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

                    <div className="mt-12 flex-col space-y-4">
                        {/* telephone */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="telephone" className="font-bold">Telephone</label>
                            <div className="flex">
                                <input type="text" id="telephone" className="flex-1 border rounded-sm h-9 px-2" value={phone}
                                    onChange={(e) => setPhone(e.target.value)} placeholder="Add telephone" />
                            </div>
                        </div>
                        {/* office address */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="office-address" className="font-bold">office address</label>
                            <div className="flex">
                                <input type="text" id="office-address" className="flex-1 border rounded-sm h-9 px-2" value={address}
                                    onChange={(e) => setAddress(e.target.value)} placeholder="Add office address" />
                            </div>
                        </div>
                    </div>
                    <hr className="border-b my-6" />
                    <div className="ml-auto w-1/5 grid grid-cols-2 space-x-4">
                        <Link href={"/admin/customer"} className="bg-red-500 flex justify-center items-center text-white h-10 rounded-sm">Cancel</Link>
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
