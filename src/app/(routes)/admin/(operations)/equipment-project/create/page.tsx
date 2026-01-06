"use client";

import { MdWorkHistory } from "react-icons/md"; // Menggunakan ikon yang sesuai
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { IoIosSearch } from "react-icons/io";

// Import komponen UI Table Anda
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

// Import interfaces dan fungsi utility
// GANTI PATH INI SESUAI STRUKTUR PROJECT ANDA
import { Customer, getCustomerById, getCustomersAllForDropdown } from "@/lib/customer";
import { getAllAvailableEquipment, createEquipmentproject } from "@/lib/equipment-project"; // Asumsi createEquipmentproject & getAllAvailableEquipment ada di sini
import { EquipmentItem, CreateEquipmentProjectPayload } from "@/lib/equipment-project";
import { toast } from "sonner";


interface CustomerLocation {
    id: number,
    customer_id: number,
    location_name: string,
    created_at: string,
    updated_at: string
}


export default function CreateEquipmentProjectPage() {

    const router = useRouter();

    // Data Dropdown
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customersLocation, setCustomersLocation] = useState<CustomerLocation[]>([]);

    // Data Tabel Peralatan Tersedia
    const [availableEquipment, setAvailableEquipment] = useState<EquipmentItem[]>([]);
    const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<number[]>([]);

    // Pagination dan Search untuk Tabel Peralatan
    const [equipmentSearch, setEquipmentSearch] = useState("");
    const [tempEquipmentSearch, setTempEquipmentSearch] = useState("");
    const [equipmentPage, setEquipmentPage] = useState(1);
    const [equipmentLastPage, setEquipmentLastPage] = useState(1);
    const [equipmentPerPage, setEquipmentPerPage] = useState(10); // Sesuai gambar
    const [loadingEquipment, setLoadingEquipment] = useState(true);

    const [loading, setLoading] = useState(false); // Loading untuk submit form

    // State Form Input
    const [formData, setFormData] = useState({
        project_date: "",
        customer_id: "",
        customer_location_id: "",
        prepared_by: "",
        verified_by: "",
    });

    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));

        // Saat Customer berubah, reset Work Location
        if (id === "customer_id") {
            setFormData(prev => ({ ...prev, customer_location_id: "" }));
        }
    };


    // --- FETCH DATA CUSTOMER ---
    useEffect(() => {
        const fetchCustomers = async () => {
            const result = await getCustomersAllForDropdown();
            if (result.success && result.data) {
                // Asumsi data array customers ada di result.data.rows atau langsung di result.data
                setCustomers(result.data.rows || result.data);
            }
        };
        fetchCustomers();
    }, []);

    // --- FETCH CUSTOMER LOCATIONS ---
    useEffect(() => {
        const fetchCustomerDetail = async () => {
            if (!formData.customer_id) {
                setCustomersLocation([]);
                return;
            }

            const result = await getCustomerById(Number(formData.customer_id));

            if (result && result.data) {
                const cust = result.data;
                // Set locations ke state
                setCustomersLocation(cust.locations || []);
            } else {
                setCustomersLocation([]);
            }
        };

        fetchCustomerDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.customer_id]);


    // --- FETCH DATA EQUIPMENT TERSEDIA ---
    const fetchEquipmentData = async () => {
        setLoadingEquipment(true);
        const res = await getAllAvailableEquipment(equipmentPage, equipmentPerPage, equipmentSearch);

        if (res.success) {
            setAvailableEquipment(res.data.data);
            setEquipmentLastPage(res.meta.last_page);
        } else {
            setAvailableEquipment([]);
            setEquipmentLastPage(1);
        }

        setLoadingEquipment(false);
    };

    useEffect(() => {
        fetchEquipmentData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [equipmentPage, equipmentSearch, equipmentPerPage]);

    // Handler search peralatan
    const handleEquipmentSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setEquipmentPage(1);
        setEquipmentSearch(tempEquipmentSearch);
    };


    // --- HANDLER SELEKSI PERALATAN ---
    const handleSelectEquipment = (id: number) => {
        setSelectedEquipmentIds(prev =>
            prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
        );
    };

    const handleSelectAllEquipment = () => {
        const allIds = availableEquipment.map(item => item.id);
        if (selectedEquipmentIds.length === allIds.length) {
            // Deselect all
            setSelectedEquipmentIds([]);
        } else {
            // Select all current page items
            setSelectedEquipmentIds(allIds);
        }
    };


    // --- SUBMIT FORM ---
    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload: CreateEquipmentProjectPayload = {
            project_date: formData.project_date,
            customer_id: parseInt(formData.customer_id),
            customer_location_id: parseInt(formData.customer_location_id),
            prepared_by: formData.prepared_by,
            verified_by: formData.verified_by,
            equipment_ids: selectedEquipmentIds,
        };

        // Validasi Sederhana
        if (!payload.project_date || !payload.customer_id || !payload.customer_location_id || selectedEquipmentIds.length === 0) {
            // alert("Harap isi semua kolom wajib (Customer, Lokasi, Tanggal) dan pilih minimal satu peralatan!");
            toast.error("Harap isi semua kolom wajib (Customer, Lokasi, Tanggal) dan pilih minimal satu peralatan!");
            setLoading(false);
            return;
        }

        console.log("Equipment Project Payload:", payload);

        try {
            const data = await createEquipmentproject(payload); // Pastikan fungsi ini tersedia

            if (!data.success) {
                // alert(`Gagal membuat Equipment Project: ${data.message}`);
                toast.error("Failed to create: " + data.message);
                setLoading(false);
                return;
            }

            // alert("Equipment Project berhasil dibuat!");
            toast.success("Successfully created Equipment Project!");
            setLoading(false);
            router.push("/admin/equipment-project");

        } catch (err) {
            console.error(err);
            // alert("Terjadi kesalahan saat menyimpan data!");
            toast.error("Failed to create: " + err);
            setLoading(false);
        }
    };

    // Helper untuk mendapatkan nomor urut (No.) di tabel Equipment
    const getEquipmentNo = (index: number) => {
        return (equipmentPage - 1) * equipmentPerPage + index + 1;
    }


    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">
            {/* title container */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <MdWorkHistory className="w-10 h-10" />
                <h1 className="text-3xl font-normal">Add Equipment Project</h1>
            </div>

            {/* start of form container */}
            <div className="bg-white border rounded-sm px-5 py-6 shadow-xs my-12 ">
                {/* start form */}
                <form onSubmit={handleCreateProject} className="flex flex-col">

                    {/* SECTION 1: CUSTOMER, LOCATION, DATE, PREPARED/VERIFIED */}
                    <div className="grid grid-cols-2 gap-x-8">
                        {/* Kolom Kiri */}
                        <div className="flex flex-col space-y-4">
                            {/* Customer */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="customer_id" className="font-bold">Customer</label>
                                <select id="customer_id"
                                    value={formData.customer_id}
                                    onChange={handleFormChange}
                                    className="border rounded-sm h-10 px-2 focus:outline-none focus:ring-1 focus:ring-[#17A2B8]"
                                >
                                    <option value="" className="font-light" hidden>---Pilih Customer---</option>
                                    {customers.map(customer => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Project Date */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="project_date" className="font-bold">Project Date</label>
                                <input type="date" id="project_date"
                                    value={formData.project_date}
                                    onChange={(e) => setFormData(prev => ({ ...prev, project_date: e.target.value }))}
                                    className="border rounded-sm h-10 px-2 focus:outline-none focus:ring-1 focus:ring-[#17A2B8]"
                                />
                                <p className="text-sm text-gray-500">Format: mm/dd/yyyy</p>
                            </div>
                            {/* Prepared By */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="prepared_by" className="font-bold">Prepared By</label>
                                <input type="text" id="prepared_by"
                                    value={formData.prepared_by}
                                    onChange={handleFormChange}
                                    className="border rounded-sm h-10 px-2 focus:outline-none focus:ring-1 focus:ring-[#17A2B8]"
                                    placeholder="Prepared By Name"
                                />
                            </div>
                        </div>

                        {/* Kolom Kanan */}
                        <div className="flex flex-col space-y-4">
                            {/* Work Location */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="customer_location_id" className="font-bold">Work Location</label>
                                <select id="customer_location_id"
                                    value={formData.customer_location_id}
                                    onChange={handleFormChange}
                                    disabled={!formData.customer_id || customersLocation.length === 0}
                                    className={`border rounded-sm h-10 px-2 focus:outline-none focus:ring-1 focus:ring-[#17A2B8] ${!formData.customer_id ? 'bg-gray-100 text-gray-500' : ''}`}
                                >
                                    <option value="" className="font-light" hidden>---Pilih Customer Dulu---</option>
                                    {customersLocation.map(location => (
                                        <option key={location.id} value={location.id}>
                                            {location.location_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Verified By */}
                            <div className="flex flex-col space-y-1"> {/* Penyesuaian padding agar sejajar dengan Prepared By */}
                                <label htmlFor="verified_by" className="font-bold">Verified By</label>
                                <input type="text" id="verified_by"
                                    value={formData.verified_by}
                                    onChange={handleFormChange}
                                    className="border rounded-sm h-10 px-2 focus:outline-none focus:ring-1 focus:ring-[#17A2B8]"
                                    placeholder="Verified By Name"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-b my-8" />

                    {/* SECTION 2: PILIH EQUIPMENT TERSEDIA (Tabel) */}
                    <div className="mt-4">
                        <h2 className="text-xl font-bold mb-4">Pilih Equipment Tersedia</h2>

                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2 text-sm">
                                <p>Show</p>
                                <select
                                    name="perPage"
                                    value={equipmentPerPage}
                                    onChange={(e) => {
                                        setEquipmentPerPage(Number(e.target.value));
                                        setEquipmentPage(1);
                                    }}
                                    className="w-16 h-8 border rounded-sm px-1"
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                </select>
                                <p>entries</p>
                            </div>

                            {/* Search Bar untuk Equipment */}
                            <div className="flex flex-row items-center space-x-2">
                                <label htmlFor="search-equipment" className="text-sm">Search:</label>
                                <input value={tempEquipmentSearch}
                                    onChange={(e) => setTempEquipmentSearch(e.target.value)}
                                    id="search-equipment"
                                    type="text"
                                    className="w-[200px] rounded-sm h-8 border px-2 placeholder:text-sm"
                                    placeholder="Search Equipment..." />
                                <div onClick={handleEquipmentSearch} className="h-8 w-8 flex items-center justify-center rounded-sm bg-gray-100 border cursor-pointer"><IoIosSearch className="w-4 h-4 text-gray-600" /></div>
                            </div>
                        </div>

                        {/* Tabel Peralatan */}
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[#f2f2f2] hover:bg-[#f2f2f2]">
                                        <TableHead className="w-12 text-center">
                                            <input type="checkbox"
                                                checked={selectedEquipmentIds.length > 0 && selectedEquipmentIds.length === availableEquipment.length}
                                                onChange={handleSelectAllEquipment}
                                            />
                                        </TableHead>
                                        <TableHead className="text-[#212529] font-bold w-12 text-center">No.</TableHead>
                                        <TableHead className="text-[#212529] font-bold">Description</TableHead>
                                        <TableHead className="text-[#212529] font-bold">Merk/Type</TableHead>
                                        <TableHead className="text-[#212529] font-bold">Serial Number</TableHead>
                                        <TableHead className="text-[#212529] font-bold w-32">Calibration Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loadingEquipment ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8">
                                                Loading available equipment...
                                            </TableCell>
                                        </TableRow>
                                    ) : availableEquipment.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8">
                                                No equipment found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        availableEquipment.map((item, index) => (
                                            <TableRow key={item.id} className="even:bg-white odd:bg-[#fafafa]">
                                                <TableCell className="text-center w-12">
                                                    <input type="checkbox"
                                                        checked={selectedEquipmentIds.includes(item.id)}
                                                        onChange={() => handleSelectEquipment(item.id)}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-center text-sm w-12">{getEquipmentNo(index)}</TableCell>
                                                <TableCell className="text-sm">{item.description}</TableCell>
                                                <TableCell className="text-sm">{item.merk_type}</TableCell>
                                                <TableCell className="text-sm">{item.serial_number}</TableCell>
                                                <TableCell className="text-sm w-32">{new Date(item.calibration_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination Equipment */}
                        <div className="flex justify-between items-center py-3 text-sm px-2">
                            <span>
                                Showing {((equipmentPage - 1) * equipmentPerPage) + 1} to {Math.min(equipmentPage * equipmentPerPage, equipmentLastPage * equipmentPerPage)} of {equipmentLastPage * equipmentPerPage} entries
                            </span>
                            <div className="flex space-x-2">
                                <button
                                    disabled={equipmentPage <= 1 || loadingEquipment}
                                    onClick={() => setEquipmentPage(p => p - 1)}
                                    className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 text-sm"
                                    type="button"
                                >
                                    Previous
                                </button>
                                {/* Ini bisa diubah menjadi list button angka page jika mau, saat ini hanya Prev/Next */}
                                <span className="px-3 py-1 border rounded bg-[#17A2B8] text-white">
                                    {equipmentPage}
                                </span>
                                <button
                                    disabled={equipmentPage >= equipmentLastPage || loadingEquipment}
                                    onClick={() => setEquipmentPage(p => p + 1)}
                                    className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 text-sm"
                                    type="button"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>

                    <hr className="border-b my-6" />

                    {/* ACTION BUTTONS */}
                    <div className="ml-auto w-1/4 grid grid-cols-2 space-x-4">
                        <Link href={"/admin/equipment-project"} className="bg-red-500 flex justify-center items-center text-white h-10 rounded-sm hover:bg-red-600 transition">Cancel</Link>
                        <button type="submit" disabled={loading} className="bg-[#17a2b8] flex justify-center items-center text-white h-10 rounded-sm hover:bg-[#1593A5] transition disabled:opacity-50">
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
                {/* end form */}
            </div >
            {/* end of form container */}

            <div className="h-20 text-transparent" >.</div>
        </div >
    )
}