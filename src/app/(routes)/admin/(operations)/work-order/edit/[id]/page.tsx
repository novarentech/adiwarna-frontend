"use client";

import { MdWorkHistory } from "react-icons/md";
import Link from "next/link";
import { useEffect, useState, use } from "react";
import { FaTrash } from "react-icons/fa6";
import { useRouter } from "next/navigation";

// Import Library functions
import { Customer, getCustomersAllForDropdown } from "@/lib/customer";
import { Employee, getEmployeesAllForDropdown } from "@/lib/employee";
import { getWorkOrderById, updateWorkOrder, UpdateWorkOrderBody } from "@/lib/work-order";

interface RowDataWorker {
    id?: number; // ID Pivot (penting untuk Update)
    employeeId: string;
    details: string;
    position: string;
}

// Definisikan daftar scope hardcoded agar mudah dicek
const SCOPE_OPTIONS = [
    "MPI", "Penetrant Test", "UT Wall Thickness Spot Check", "Load Test",
    "Lifting Gear Inspection", "Treating Iron Inspection", "BHA Inspection",
    "Hydrotest/Pressure Testing", "Offshore Container Inspection", "PRV Testing",
    "Visual Color Code", "Witness Leak Test", "Sling and Shackle Inspection",
    "Hardness Test", "Spreader Bar Inspection"
];

// Next.js 13+ App Router menerima params sebagai props
export default function EditWorkOrderPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();

    // Unwrapping params (Next.js 15 pattern, atau bisa langsung await di server component)
    // Untuk client component standard:
    const [workOrderId, setWorkOrderId] = useState<number | null>(null);

    // --- STATE DATA MASTER ---
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);

    // --- STATE FORM UTAMA ---
    const [formData, setFormData] = useState({
        work_order_no: "",
        work_order_year: new Date().getFullYear(),
        date: "",
        customer_id: "",
        customer_location_id: "",
    });

    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    // --- STATE LOGIC WORKER ---
    const [rowsDataWorker, setRowsDataWorker] = useState<RowDataWorker[]>([]);

    // --- STATE LOGIC SCOPE ---
    const [selectedScopes, setSelectedScopes] = useState<Set<string>>(new Set());
    const [showOther, setShowOther] = useState(false);
    const [otherValue, setOtherValue] = useState("");

    // --- LOAD DATA ---
    useEffect(() => {
        // Helper untuk unwrap params
        const unwrapParams = async () => {
            const resolvedParams = await params;
            setWorkOrderId(Number(resolvedParams.id));
            return Number(resolvedParams.id);
        };

        const loadAllData = async () => {
            const id = await unwrapParams();
            if (!id) return;

            // 1. Fetch Master Data dulu (Customer & Employee)
            const [custRes, empRes] = await Promise.all([
                getCustomersAllForDropdown(),
                getEmployeesAllForDropdown()
            ]);

            let loadedCustomers: Customer[] = [];
            let loadedEmployees: Employee[] = [];

            if (custRes.success) {
                loadedCustomers = custRes.data.rows || custRes.data;
                setCustomers(loadedCustomers);
            }
            if (empRes.success) {
                loadedEmployees = empRes.data.data || empRes.data;
                setEmployees(loadedEmployees);
            }

            // 2. Fetch Detail Work Order
            const woRes = await getWorkOrderById(id);

            if (woRes.success && woRes.data) {
                const data = woRes.data;

                // A. Set Form Data Dasar
                setFormData({
                    work_order_no: data.work_order_no,
                    work_order_year: data.work_order_year,
                    date: data.date,
                    customer_id: data.customer_id.toString(),
                    customer_location_id: data.customer_location_id.toString(),
                });

                // B. Set Selected Customer (Untuk trigger dropdown location & phone)
                const currentCust = loadedCustomers.find(c => c.id === data.customer_id);
                setSelectedCustomer(currentCust || null);

                // C. Set Workers/Employees
                // Mapping response API ke struktur RowDataWorker
                // Response API: { id: 37, employee_id: 1, name: "...", position: "..." }
                const mappedWorkers: RowDataWorker[] = data.employees.map((emp: any) => ({
                    id: emp.id, // Ini ID Pivot (misal: 37)
                    employeeId: emp.employee_id.toString(), // Ini ID Employee (misal: 1)
                    details: emp.name,
                    position: emp.position
                }));
                setRowsDataWorker(mappedWorkers);

                // D. Set Scopes
                const scopesFromApi = new Set<string>(data.scope_of_work || []);
                setSelectedScopes(scopesFromApi);

                // Cek apakah ada "Other"
                if (scopesFromApi.has("Other")) {
                    setShowOther(true);
                    // Jika API menyimpan text custom scope di field lain, set di sini.
                    // Karena di array cuma string "Other", text input mungkin kosong atau user isi ulang.
                }
            }
        };

        loadAllData();
    }, [params]);

    // --- HANDLERS: WORKER ---
    const addRowDataWorker = () => {
        // Tambah baris baru (id undefined karena belum ada di DB)
        setRowsDataWorker([...rowsDataWorker, { details: "", position: "", employeeId: "" }]);
    };

    const deleteRowDataWorker = (index: number) => {
        setRowsDataWorker(rowsDataWorker.filter((_, i) => i !== index));
    };

    const handleWorkerSelect = (index: number, empId: string) => {
        const updated = [...rowsDataWorker];
        const selectedEmp = employees.find(e => e.id.toString() === empId);

        updated[index].employeeId = empId;
        updated[index].details = selectedEmp ? selectedEmp.name : "";
        updated[index].position = selectedEmp ? selectedEmp.position : "";

        // Note: Jangan hapus updated[index].id jika ada, karena itu ID pivot yg mau diupdate

        setRowsDataWorker(updated);
    };

    // --- HANDLERS: CUSTOMER ---
    const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const custId = e.target.value;
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

    // --- SUBMIT (UPDATE) ---
    const handleUpdateWorkOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!workOrderId) return;

        // 1. Validasi
        if (!formData.work_order_no || !formData.customer_id || !formData.customer_location_id) {
            alert("Please fill in Work Order No, Customer, and Work Location.");
            return;
        }

        // 2. Prepare Scope
        const finalScopes = Array.from(selectedScopes);
        if (showOther && !finalScopes.includes("Other")) {
            finalScopes.push("Other");
        }
        // Jika user uncheck "Other" tapi text input masih ada isi, hapus "Other" dari array
        if (!showOther) {
            const index = finalScopes.indexOf("Other");
            if (index > -1) finalScopes.splice(index, 1);
        }

        // 3. Prepare Employees (Format Update Body)
        // Jika row punya 'id', kirim 'id' (update). Jika tidak, kirim 'employee_id' saja (create baru).
        const finalEmployees = rowsDataWorker
            .filter(row => row.employeeId !== "")
            .map(row => {
                const payload: any = {
                    employee_id: Number(row.employeeId)
                };
                // Jika ini data lama (punya id pivot), sertakan id-nya
                if (row.id) {
                    payload.id = row.id;
                }
                return payload;
            });

        if (finalEmployees.length === 0) {
            alert("Please select at least one worker.");
            return;
        }

        // 4. Construct Body
        const body: UpdateWorkOrderBody = {
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
            const res = await updateWorkOrder(workOrderId, body);
            if (res.success) {
                alert("Work order updated successfully");
                router.push("/admin/work-order");
            } else {
                alert("Failed: " + res.message);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while updating work order.");
        }
    }

    if (!workOrderId) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            <div className="flex flex-row items-center space-x-2 mt-2">
                <MdWorkHistory className="w-10 h-10" />
                <h1 className="text-3xl font-normal">Edit Work Order</h1>
            </div>

            <div className="bg-white border rounded-sm px-5 py-6 shadow-xs my-12 ">
                <form onSubmit={handleUpdateWorkOrder} className="flex flex-col">
                    <div className="grid grid-cols-2 space-x-4">
                        {/* LEFT: NO WO & REF */}
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-1">
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

                        {/* RIGHT: DATE */}
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="date" className="font-bold">Date</label>
                                <div className="flex">
                                    <input
                                        type="date"
                                        id="date"
                                        className="flex-1 border rounded-sm h-9 px-2"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="mt-6" />

                    {/* --- WORKER TABLE --- */}
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
                                    <tr key={index}>
                                        <td>
                                            <select
                                                value={row.employeeId}
                                                onChange={(e) => handleWorkerSelect(index, e.target.value)}
                                                className="border rounded-sm min-h-12 px-2 w-full p-2"
                                                required
                                            >
                                                <option value="" hidden>---Choose worker's name---</option>
                                                {employees.map(e => (
                                                    <option key={e.id} value={e.id}>{e.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
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
                                                type="button"
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
                        <div
                            onClick={addRowDataWorker}
                            className="mt-4 px-4 py-2 bg-[#17a2b8] text-white rounded flex justify-center items-center mx-4 cursor-pointer"
                        >
                            + Add Worker
                        </div>
                    </div>

                    <hr className="border-b my-6" />

                    {/* --- CUSTOMER --- */}
                    <div className="flex flex-col space-y-1 my-3">
                        <label htmlFor="customer" className="font-bold">Customer</label>
                        <div className="flex">
                            <select
                                className="flex-1 border rounded-sm h-9 px-2"
                                value={formData.customer_id}
                                onChange={handleCustomerChange}
                                required
                            >
                                <option value="" hidden>---Choose Customer's Name---</option>
                                {customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* --- WORK LOCATION --- */}
                    <div className="flex flex-col space-y-1 my-3">
                        <label htmlFor="work-location" className="font-bold">Work Location</label>
                        <div className="flex">
                            <select
                                className="flex-1 border rounded-sm h-9 px-2"
                                value={formData.customer_location_id}
                                onChange={(e) => setFormData({ ...formData, customer_location_id: e.target.value })}
                                disabled={!selectedCustomer}
                                required
                            >
                                <option value="" hidden>---Choose work location---</option>
                                {selectedCustomer?.customer_locations?.map((loc) => (
                                    <option key={loc.id} value={loc.id}>{loc.location_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* --- CUSTOMER PHONE --- */}
                    <div className="flex flex-col space-y-1 my-3">
                        <label className="font-bold">Customer's Phone Number</label>
                        <div className="flex">
                            <input
                                type="text"
                                className="flex-1 border rounded-sm h-9 px-2 bg-gray-200"
                                disabled
                                value={selectedCustomer?.phone_number || ""}
                                placeholder="Phone number..."
                            />
                        </div>
                    </div>

                    <hr className="border-b my-6" />

                    {/* --- SCOPE --- */}
                    <h2 className="font-bold">Scope</h2>
                    <div className="flex flex-col space-y-0.5 mt-2">
                        {SCOPE_OPTIONS.map((scopeLabel) => (
                            <div className="flex space-x-2" key={scopeLabel}>
                                <input
                                    type="checkbox"
                                    id={scopeLabel}
                                    onChange={(e) => handleScopeCheckbox(scopeLabel, e.target.checked)}
                                    checked={selectedScopes.has(scopeLabel)}
                                />
                                <label htmlFor={scopeLabel}>{scopeLabel}</label>
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
                        <button type="submit" className="bg-[#17a2b8] flex justify-center items-center text-white h-10 rounded-sm">Update</button>
                    </div>
                </form>
            </div >
            <div className="h-20 text-transparent">.</div>
        </div >
    )
}