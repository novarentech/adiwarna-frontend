"use client";
import { createEmployee } from "@/lib/employee";
// import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { FaAddressCard } from "react-icons/fa6";
import { toast } from "sonner";

export default function CreateEmployeePage() {

    const router = useRouter();

    const [employeeNo, setEmployeeNo] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [employeePosition, setEmployeePosition] = useState("");

    const [loading, setLoading] = useState(false);

    const handleCreateEmployee = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!employeeNo || !employeeName || !employeePosition) {
            // alert("All fields are required!");
            toast.error("All fields are required!");
            return;
        }

        setLoading(true);

        const payload = {
            employee_no: employeeNo,
            name: employeeName,
            position: employeePosition,
        };

        const res = await createEmployee(payload);

        setLoading(false);

        if (res.success) {
            toast.success("Successfully created employee")
            router.push("/admin/employee");
        } else {
            // alert(res.message || "Failed to create employee");
            toast.error(res.message || "Failed to create employee");
        }
    };

    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <FaAddressCard className="w-10 h-10" />
                <h1 className="text-3xl font-normal">Add Data Employee  </h1>
            </div>

            {/* start of form container */}
            <div className="bg-white border rounded-sm px-5 py-6 shadow-xs my-12 ">
                {/* start form */}
                <form onSubmit={handleCreateEmployee} className="flex flex-col">
                    {/* no */}
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="employee-no" className="font-bold">No</label>
                        <div className="flex">
                            <input id="employee-no"
                                value={employeeNo}
                                onChange={(e) => setEmployeeNo(e.target.value)} type="text" className="flex-1 border rounded-sm h-9 px-2" placeholder="add employee number" />
                        </div>
                    </div>
                    {/* Name */}
                    <div className="flex flex-col space-y-1 mt-4">
                        <label htmlFor="employee-name" className="font-bold">Name</label>
                        <div className="flex">
                            <input value={employeeName}
                                onChange={(e) => setEmployeeName(e.target.value)} type="text" id="employee-name" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add employee name" />
                        </div>
                    </div>
                    {/* Position */}
                    <div className="flex flex-col space-y-1 mt-4">
                        <label htmlFor="employee-position" className="font-bold">Position</label>
                        <div className="flex">
                            <input value={employeePosition}
                                onChange={(e) => setEmployeePosition(e.target.value)} type="text" id="employee-position" className="flex-1 border rounded-sm h-9 px-2" placeholder="Add employee position" />
                        </div>
                    </div>
                    <hr className="border-b my-6" />
                    <div className="ml-auto w-1/4 grid grid-cols-2 space-x-4">
                        <Link href={"/admin/employee"} className="bg-red-500 flex justify-center items-center text-white h-10 rounded-sm">Cancel</Link>
                        <button type="submit" className="bg-[#17a2b8] flex justify-center items-center text-white h-10 rounded-sm">{loading ? "Saving..." : "Save"}</button>
                    </div>
                </form>
                {/* end form */}
            </div>
            {/* end of form container */}

            <div className="h-20 text-transparent">.</div>
        </div>
    )
}
