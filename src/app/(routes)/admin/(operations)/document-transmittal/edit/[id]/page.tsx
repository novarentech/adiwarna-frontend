"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { MdDocumentScanner } from "react-icons/md";
import { useRouter } from "next/navigation";

// Asumsi path import library
import { getCustomersAllForDropdown, Customer } from "@/lib/customer";
import {
    createDocumentTransmittal, // Tetap diimport jika perlu
    getDocumentTransmittalById,
    updateDocTransmittal,
    UpdateDocTransmittalPayload,
    DocumentPayload
} from "@/lib/document-transmittals";
import { toast } from "sonner";


// Perbarui interface untuk memasukkan ID (pivot ID dokumen)
interface RowDataReport {
    id?: number; // ID dokumen jika sudah ada di DB
    wo: number | string;
    year: number | string;
    location: string;
}

type EditDocTransParams = Promise<{ id: string }>;

// Gunakan props params untuk mendapatkan ID
export default function EditDocTransmittalPage({ params }: { params: EditDocTransParams }) {
    const router = useRouter();

    const actualParams = use(params);
    const transmittalId = actualParams.id;

    // --- STATE DATA MASTER ---
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- STATE FORM UTAMA ---
    const [formData, setFormData] = useState({
        name: "",
        ta_no: "",
        date: "",
        customer_id: "",
        customer_district: "",
        pic_name: "",
        report_type: "",
    });

    // --- STATE LOGIC CUSTOMER ---
    const [selectedCustomerAddress, setSelectedCustomerAddress] = useState("");

    // --- STATE BARIS WO ---
    // Diinisialisasi dengan array kosong karena data akan diisi dari API
    const [rowsDataWorkerOrder, setRowsDataWorkerOrder] = useState<RowDataReport[]>([]);

    // --- LOAD INITIAL DATA (CUSTOMERS & TRANSMITTAL) ---
    useEffect(() => {
        if (!transmittalId) return;

        const loadData = async () => {
            setIsLoading(true);

            // 1. Fetch Master Data (Customers)
            const custRes = await getCustomersAllForDropdown();
            let loadedCustomers: Customer[] = [];
            if (custRes.success) {
                loadedCustomers = custRes.data;
                setCustomers(loadedCustomers);
            }

            // 2. Fetch Detail Transmittal
            const transmittalRes = await getDocumentTransmittalById(transmittalId);

            if (transmittalRes.success && transmittalRes.data) {
                const data = transmittalRes.data;

                // A. Set Form Data Utama
                setFormData({
                    name: data.name,
                    ta_no: data.ta_no,
                    date: data.date,
                    customer_id: data.customer.id.toString(),
                    customer_district: data.customer.district || "",
                    pic_name: data.pic_name,
                    report_type: data.report_type,
                });

                // B. Set Alamat Customer
                setSelectedCustomerAddress(data.customer.address || "");

                // C. Set Rows Data WO
                const mappedDocuments: RowDataReport[] = data.documents.map((doc: any) => ({
                    id: doc.id, // ID pivot dokumen, PENTING untuk update
                    wo: doc.wo_number.toString(),
                    year: doc.wo_year.toString(),
                    location: doc.location,
                }));
                setRowsDataWorkerOrder(mappedDocuments);
            } else {
                alert("Failed to load document data.");
                // Redirect jika gagal load data
                router.push("/admin/document-transmittal");
            }
            setIsLoading(false);
        };
        loadData();
    }, [transmittalId, router]); // Dependency transmittalId dan router

    // --- HANDLERS: FORM UTAMA ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    // Handler Customer (Saat Customer diubah, alamat akan ikut berubah)
    const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const custId = e.target.value;
        const cust = customers.find(c => c.id.toString() === custId);

        setFormData({ ...formData, customer_id: custId });
        setSelectedCustomerAddress(cust ? cust.address : "");
    };

    // --- HANDLERS: BARIS WO ---
    const addRowDataReport = () => {
        setRowsDataWorkerOrder([...rowsDataWorkerOrder, { wo: "", year: new Date().getFullYear(), location: "" }]);
    };

    const updateRowDataReport = <K extends keyof RowDataReport>(
        index: number,
        field: K,
        value: RowDataReport[K]
    ) => {
        const updated = [...rowsDataWorkerOrder];
        updated[index][field] = value;
        setRowsDataWorkerOrder(updated);
    };

    const deleteRowDataReport = (index: number) => {
        setRowsDataWorkerOrder(rowsDataWorkerOrder.filter((_, i) => i !== index));
    };

    // --- HANDLER SUBMIT (UPDATE) ---
    const handleUpdateDocumentTransmittal = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validasi Dasar
        if (!formData.name || !formData.ta_no || !formData.customer_id) {
            // alert("Harap lengkapi field Nama, TA No., dan Customer.");
            toast.error("Harap lengkapi field Nama, TA No., dan Customer.");
            return;
        }

        // 2. Siapkan Payload Dokumen (WO List)
        const finalDocuments: DocumentPayload[] = rowsDataWorkerOrder
            // Hanya filter baris yang memiliki WO Number dan Year
            .filter(row => row.wo && row.year)
            .map(row => {
                const docPayload: DocumentPayload = {
                    wo_number: row.wo.toString(),
                    wo_year: Number(row.year),
                    location: row.location || "",
                };

                // PENTING: Jika baris ini memiliki ID (pivot ID), sertakan dalam payload update
                if (row.id) {
                    docPayload.id = row.id;
                }
                return docPayload;
            });

        if (finalDocuments.length === 0) {
            // alert("Harap masukkan setidaknya satu Work Order.");
            toast.error("Harap masukkan setidaknya satu Work Order.");
            return;
        }

        // 3. Construct Final Body
        const body: UpdateDocTransmittalPayload = {
            name: formData.name,
            ta_no: formData.ta_no,
            date: formData.date,
            customer_id: Number(formData.customer_id),
            customer_district: formData.customer_district,
            pic_name: formData.pic_name,
            report_type: formData.report_type,
            documents: finalDocuments,
        };

        // 4. Call API Update
        try {
            const res = await updateDocTransmittal(transmittalId, body);
            if (res.success) {
                // alert("Document Transmittal berhasil diperbarui!");
                toast.success("Document Transmittal updated successfully!");
                router.push("/admin/document-transmittal");
            } else {
                // alert("Gagal memperbarui Document Transmittal: " + res.message);
                toast.error("Failed to update Document Transmittal: " + res.message);
            }
        } catch (error) {
            console.error(error);
            // alert("Terjadi kesalahan saat memproses pembaruan Document Transmittal.");
            toast.error("Terjadi kesalahan saat memproses pembaruan Document Transmittal.");
        }
    }


    if (isLoading) {
        return <div className="p-4">Loading Data...</div>;
    }

    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <MdDocumentScanner className="w-10 h-10" />
                <h1 className="text-3xl font-normal">Edit Document Transmittal ({transmittalId})</h1>
            </div>

            {/* start of form container */}
            <div className="bg-white border rounded-sm px-5 py-6 shadow-xs my-12 ">
                {/* start form */}
                <form onSubmit={handleUpdateDocumentTransmittal} className="flex flex-col">
                    <div className="grid grid-cols-1 space-x-4">
                        <div className="flex flex-col space-y-4">
                            {/* Name */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="name" className="font-bold">Name</label>
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        id="name"
                                        className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2"
                                        placeholder="Add your name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 my-3 space-x-4">
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-1">
                                {/* TA No. */}
                                <label htmlFor="ta_no" className="font-bold">TA No.</label>
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        id="ta_no"
                                        className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2"
                                        placeholder="Number/month/year, ex: 000/VII/2024"
                                        value={formData.ta_no}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            {/* date */}
                            <div className="flex flex-col space-y-1">
                                {/* date */}
                                <label htmlFor="date" className="font-bold">Date</label>
                                <div className="flex items-center">
                                    <input
                                        type="date"
                                        id="date"
                                        className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                    <hr className="my-6" />


                    <div className="grid grid-cols-2 space-x-4 mb-3">
                        {/* left column */}
                        <div className="flex flex-col space-y-4">
                            {/* customer */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="customer_id" className="font-bold">Customer</label>
                                <div className="flex">
                                    <select
                                        id="customer_id"
                                        className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2"
                                        value={formData.customer_id}
                                        onChange={handleCustomerChange}
                                        required
                                    >
                                        <option value="" hidden>---Choose Customer's Name---</option>
                                        {customers.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {/* customer address */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="customer-address" className="font-bold">Customer's Address</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        id="customer-address"
                                        className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2 bg-[#e9ecef]"
                                        disabled
                                        value={selectedCustomerAddress}
                                        placeholder="Address will appear here..."
                                    />
                                </div>
                            </div>
                        </div>
                        {/* right column */}
                        <div className="flex flex-col space-y-4">
                            {/* PIC */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="pic_name" className="font-bold">Person in Charge (PIC)</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        id="pic_name"
                                        className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2"
                                        placeholder="Add PIC'S name"
                                        value={formData.pic_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Customer's District */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="customer_district" className="font-bold">Customer's District</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        id="customer_district"
                                        className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2"
                                        placeholder="Add Customer's District"
                                        value={formData.customer_district}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-b my-6" />

                    <div className="flex flex-col space-y-4">
                        {/* Report Type */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="report_type" className="font-bold">Report Type</label>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    id="report_type"
                                    className="flex-1 border border-[#AAAAAA] rounded-sm h-9 px-2"
                                    placeholder="Add report type"
                                    value={formData.report_type}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* WO LIST */}
                    <div className="mt-6">
                        <table className="w-full border-separate border-spacing-y-4 border-spacing-x-4">
                            <thead>
                                <tr className="space-x-1">
                                    <th className="w-[5%]">No</th>
                                    <th className="w-[60%] text-left">WO</th>
                                    <th className="w-[30%] text-left">Location</th>
                                    <th className="w-[5%]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rowsDataWorkerOrder.map((row, index) => (
                                    <tr key={index}>
                                        <td className="text-center">{index + 1}</td>

                                        <td className="flex flex-row items-center">
                                            <input
                                                type="text"
                                                value={row.wo}
                                                onChange={(e) =>
                                                    updateRowDataReport(index, "wo", e.target.value)
                                                }
                                                className="border border-[#AAAAAA] rounded-sm h-12 px-2 w-full p-2 flex-1"
                                                placeholder="Number"
                                                required
                                            />
                                            <p className="mx-7 font-bold">/AWP-INS/</p>
                                            <input
                                                type="number"
                                                value={row.year}
                                                onChange={(e) =>
                                                    updateRowDataReport(index, "year", Number(e.target.value))
                                                }
                                                className="border border-[#AAAAAA] rounded-sm h-12 px-2 w-full p-2 flex-1"
                                                placeholder="Year"
                                                required
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="text"
                                                value={row.location}
                                                onChange={(e) =>
                                                    updateRowDataReport(index, "location", e.target.value)
                                                }
                                                className="border border-[#AAAAAA] rounded-sm min-h-12 px-2 w-full p-2"
                                                placeholder="Add work location"
                                                required
                                            />
                                        </td>

                                        <td className="text-center">
                                            {rowsDataWorkerOrder.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="bg-red-600 w-8 h-8 rounded-sm flex justify-center items-center cursor-pointer"
                                                    onClick={() => deleteRowDataReport(index)}
                                                >
                                                    <FaTrash className="w-5 h-5 text-white" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Button Add Row */}
                        <div
                            onClick={addRowDataReport}
                            className="mt-4 px-4 py-2 bg-[#31C6D4] text-white rounded flex justify-center items-center mx-4 cursor-pointer"
                        >
                            + Add Row
                        </div>
                    </div>

                    <hr className="border-b my-6" />

                    <div className="ml-auto w-1/4 grid grid-cols-2 space-x-4">
                        <Link href={"/admin/document-transmittal"} className="bg-red-500 flex justify-center items-center text-white h-10 rounded-sm">Cancel</Link>
                        <button type="submit" className="bg-[#31C6D4] flex justify-center items-center text-white h-10 rounded-sm">Update</button>
                    </div>
                </form>
                {/* end form */}
            </div >

            <div className="h-20 text-transparent" >.</div>
        </div >
    )
}