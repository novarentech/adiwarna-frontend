"use client";

import { MdWorkHistory } from "react-icons/md";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { useRouter } from "next/navigation"; // Untuk redirect setelah save

// Import Library functions
import { Customer, getCustomersAllForDropdown } from "@/lib/customer";
import { Employee, getEmployeesAllForDropdown } from "@/lib/employee";
import { createWorkOrder, CreateWorkOrderBody } from "@/lib/work-order";
import { toast } from "sonner";


// Interface untuk baris worker di tabel
interface RowDataWorker {
    employeeId: string;
    details: string; // Nama (hanya untuk display jika perlu, tapi kita pakai select)
    position: string;
}

export default function CreateWorkOrderPage() {
    const router = useRouter();

    // --- STATE DATA MASTER ---
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);

    // --- STATE FORM UTAMA ---
    const [formData, setFormData] = useState({
        work_order_no: "",
        work_order_year: new Date().getFullYear(),
        date: new Date().toISOString().split('T')[0], // Default hari ini (YYYY-MM-DD)
        customer_id: "",
        customer_location_id: "",
    });

    // --- STATE LOGIC CUSTOMER ---
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    // --- STATE LOGIC WORKER ---
    const [rowsDataWorker, setRowsDataWorker] = useState<RowDataWorker[]>([
        { employeeId: "", details: "", position: "" },
    ]);

    // --- STATE LOGIC SCOPE ---
    // Kita simpan scope yang terpilih dalam Set agar unik dan mudah dikelola
    const [selectedScopes, setSelectedScopes] = useState<Set<string>>(new Set());
    const [showOther, setShowOther] = useState(false);
    const [otherValue, setOtherValue] = useState("");

    // --- LOADING INITIAL DATA ---
    useEffect(() => {
        const loadInitialData = async () => {
            // Fetch Customers
            const custRes = await getCustomersAllForDropdown();
            if (custRes.success) {
                // Handle variasi struktur response (sesuai kode awal Anda)
                setCustomers(custRes.data.rows || custRes.data);
            }

            // Fetch Employees
            const empRes = await getEmployeesAllForDropdown();
            if (empRes.success) {
                setEmployees(empRes.data.data || empRes.data);
            }
        };

        loadInitialData();
    }, []);

    // --- HANDLERS: WORKER ---
    const addRowDataWorker = () => {
        setRowsDataWorker([...rowsDataWorker, { employeeId: "", details: "", position: "" }]);
    };

    const deleteRowDataWorker = (index: number) => {
        setRowsDataWorker(rowsDataWorker.filter((_, i) => i !== index));
    };

    // Fungsi update worker saat dropdown berubah
    const handleWorkerSelect = (index: number, empId: string) => {
        const updated = [...rowsDataWorker];
        const selectedEmp = employees.find(e => e.id.toString() === empId);

        updated[index].employeeId = empId;
        updated[index].details = selectedEmp ? selectedEmp.name : "";
        // Otomatis isi position sesuai data employee
        updated[index].position = selectedEmp ? selectedEmp.position : "";

        setRowsDataWorker(updated);
    };

    // --- HANDLERS: CUSTOMER ---
    const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const custId = e.target.value;

        // Cari object customer lengkap berdasarkan ID yang dipilih
        const cust = customers.find(c => c.id.toString() === custId);

        setSelectedCustomer(cust || null);
        setFormData({
            ...formData,
            customer_id: custId,
            customer_location_id: "" // Reset location jika customer berubah
        });
    };

    // --- HANDLERS: SCOPE ---
    const handleScopeCheckbox = (value: string, checked: boolean) => {
        const newScopes = new Set(selectedScopes);
        if (checked) {
            newScopes.add(value);
        } else {
            newScopes.delete(value);
        }
        setSelectedScopes(newScopes);
    };

    // --- SUBMIT ---
    const handleCreateWorkAssignment = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validasi Input Dasar
        if (!formData.work_order_no || !formData.customer_id || !formData.customer_location_id) {
            // alert("Please fill in Work Order No, Customer, and Work Location.");
            toast.error("Please fill in Work Order No, Customer, and Work Location.");
            return;
        }

        // 2. Siapkan Scope of Work array
        const finalScopes = Array.from(selectedScopes);
        if (showOther && otherValue.trim() !== "") {
            finalScopes.push("Other");
        }

        // 3. Siapkan Employees array (filter yang kosong)
        const finalEmployees = rowsDataWorker
            .filter(row => row.employeeId !== "")
            .map(row => ({
                employee_id: Number(row.employeeId)
            }));

        if (finalEmployees.length === 0) {
            // alert("Please select at least one worker.");
            toast.error("Please select at least one worker.");
            return;
        }

        // 4. Construct Request Body
        const body: CreateWorkOrderBody = {
            work_order_no: formData.work_order_no,
            work_order_year: Number(formData.work_order_year),
            date: formData.date,
            customer_id: Number(formData.customer_id),
            customer_location_id: Number(formData.customer_location_id),
            scope_of_work: finalScopes,
            employees: finalEmployees
        };

        // 5. Call API
        try {
            const res = await createWorkOrder(body);
            if (res.success) {
                // alert("Work Order created successfully!");
                toast.success("Work Order created successfully!");
                router.push("/admin/work-order"); // Redirect ke list
            } else {
                // alert("Failed: " + res.message);
                toast.error("Failed: " + res.message);
            }
        } catch (error) {
            console.error(error);
            // alert("An error occurred while creating work order.");
            toast.error("An error occurred while creating work order.");
        }
    }

    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <MdWorkHistory className="w-10 h-10" />
                <h1 className="text-3xl font-normal">Add Work Order</h1>
            </div>

            {/* start of form container */}
            <div className="bg-white border rounded-sm px-5 py-6 shadow-xs my-12 ">
                {/* start form */}
                <form onSubmit={handleCreateWorkAssignment} className="flex flex-col">
                    <div className="grid grid-cols-2 space-x-4">
                        {/* left column */}
                        <div className="flex flex-col space-y-4">
                            {/* REF */}
                            <div className="flex flex-col space-y-1">
                                {/* nomor */}
                                <label htmlFor="no-wo-order" className="font-bold">No. Work Order</label>
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        id="no-wo-order"
                                        className="flex-1 border rounded-sm h-9 px-2"
                                        placeholder="Number"
                                        value={formData.work_order_no}
                                        onChange={(e) => setFormData({ ...formData, work_order_no: e.target.value })}
                                        required
                                    />
                                    <p className="mx-4 font-bold">/AWP-INS/JKT</p>
                                    <input
                                        type="number"
                                        id="year"
                                        className="flex-1 border rounded-sm h-9 px-2"
                                        placeholder="year"
                                        value={formData.work_order_year}
                                        onChange={(e) => setFormData({ ...formData, work_order_year: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* right column */}
                        <div className="flex flex-col space-y-4">
                            {/* Date */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="date" className="font-bold">Date</label>
                                <div className="flex">
                                    <input
                                        type="date"
                                        id="date"
                                        className="flex-1 border rounded-sm h-9 px-2"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="mt-6" />

                    {/* Worker Section */}
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
                                            <select
                                                value={row.employeeId}
                                                onChange={(e) => handleWorkerSelect(index, e.target.value)}
                                                className="border rounded-sm min-h-12 px-2 w-full p-2"
                                                required={index === 0} // Baris pertama wajib
                                            >
                                                <option value="" className="">---Choose worker's name---</option>
                                                {employees.map(e => (
                                                    <option key={e.id} value={e.id}>
                                                        {e.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        <td>
                                            {/* position worker otomatis berubah */}
                                            <input
                                                type="text"
                                                value={row.position}
                                                className="border rounded-sm min-h-12 px-2 w-full p-2 bg-gray-200"
                                                placeholder="Worker's position"
                                                disabled
                                                readOnly
                                            />
                                        </td>

                                        <td className="text-center">
                                            <button
                                                type="button" // Penting agar tidak submit form
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

                    {/* Customer Section */}
                    <div className="flex flex-col space-y-1 my-3">
                        <label htmlFor="customer" className="font-bold">Customer</label>
                        <div className="flex">
                            <select
                                className="flex-1 border rounded-sm h-9 px-2"
                                value={formData.customer_id}
                                onChange={handleCustomerChange}
                                required
                            >
                                <option value="" className="font-light" hidden>---Choose Customer's Name---</option>
                                {customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Work Location - Loop based on selected Customer */}
                    <div className="flex flex-col space-y-1 my-3">
                        <label htmlFor="work-location" className="font-bold">Work Location</label>
                        <div className="flex">
                            <select
                                className="flex-1 border rounded-sm h-9 px-2"
                                value={formData.customer_location_id}
                                onChange={(e) => setFormData({ ...formData, customer_location_id: e.target.value })}
                                disabled={!selectedCustomer} // Disabled jika customer belum dipilih
                                required
                            >
                                <option value="" className="font-light" hidden>---Choose work location---</option>
                                {selectedCustomer?.customer_locations?.map((loc) => (
                                    <option key={loc.id} value={loc.id}>
                                        {loc.location_name}
                                    </option>
                                )) || (
                                        <option value="" disabled>No locations found</option>
                                    )}
                            </select>
                        </div>
                    </div>

                    {/* Customer's Phone Number - Auto populated */}
                    <div className="flex flex-col space-y-1 my-3">
                        <label htmlFor="phone" className="font-bold">Customer's Phone Number</label>
                        <div className="flex">
                            <input
                                type="text"
                                className="flex-1 border rounded-sm h-9 px-2 bg-gray-200"
                                disabled
                                value={selectedCustomer?.phone_number || ""}
                                placeholder="Phone number will appear here..."
                            />
                        </div>
                    </div>

                    <hr className="border-b my-6" />

                    {/* Scope of Work */}
                    <h2 className="font-bold">Scope</h2>

                    <div className="flex flex-col space-y-0.5 mt-2">
                        {[
                            { id: "MPI", label: "MPI" },
                            { id: "Penetrant Test", label: "Penetrant Test" },
                            { id: "UT Wall Thickness Spot Check", label: "UT Wall Thickness Spot Check" },
                            { id: "Load Test", label: "Load Test" },
                            { id: "Lifting Gear Inspection", label: "Lifting Gear Inspection" },
                            { id: "Treating Iron Inspection", label: "Treating Iron Inspection" }, // Note: JSON Anda "Tracking Iron", cek kembali typo
                            { id: "BHA Inspection", label: "BHA Inspection" },
                            { id: "Hydrotest/Pressure Testing", label: "Hydrotest/Pressure Testing" },
                            { id: "Offshore Container Inspection", label: "Offshore Container Inspection" },
                            { id: "PRV Testing", label: "PRV Testing" }, // Note: JSON Anda "PPV Testing", cek kembali
                            { id: "Visual Color Code", label: "Visual Color Code" },
                            { id: "Witness Leak Test", label: "Witness Leak Test" },
                            { id: "Sling and Shackle Inspection", label: "Sling and Shackle Inspection" },
                            { id: "Hardness Test", label: "Hardness Test" },
                            { id: "Spreader Bar Inspection", label: "Spreader Bar Inspection" },
                        ].map((item) => (
                            <div className="flex space-x-2" key={item.id}>
                                <input
                                    type="checkbox"
                                    id={item.id}
                                    onChange={(e) => handleScopeCheckbox(item.id, e.target.checked)}
                                    checked={selectedScopes.has(item.id)}
                                />
                                <label htmlFor={item.id}>{item.label}</label>
                            </div>
                        ))}

                        {/* Other Scope */}
                        <div className="flex space-x-2">
                            <input
                                type="checkbox"
                                id="other"
                                checked={showOther}
                                onChange={(e) => setShowOther(e.target.checked)}
                            />
                            <label htmlFor="other">Other</label>
                        </div>
                        {showOther && (
                            <div className="flex">
                                <input
                                    type="text"
                                    id="other-scope"
                                    value={otherValue}
                                    onChange={(e) => setOtherValue(e.target.value)}
                                    className="w-3/6 border rounded-sm h-9 px-2 bg-white mt-1 border-gray-400"
                                    placeholder="Please specify other scope"
                                />
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