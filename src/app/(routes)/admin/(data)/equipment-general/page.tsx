"use client";

import { MdEdit, MdWorkHistory } from "react-icons/md";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { ImWrench } from "react-icons/im";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { FaCircle, FaTrash } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { IoMdEye } from "react-icons/io";

// Asumsi import ini sudah diperbarui untuk menggunakan GetAllEquipmentItem
import { getAllEquipmentGeneral, GetAllEquipmentItem, EquipmentMeta, deleteEquipmentGeneral } from "@/lib/equipment-general";


export default function DataEquipmentGeneral() {

    const columnList = {
        no: "No",
        deskripsi: "Deskripsi",
        merkType: "Merk/Type",
        serialNumber: "Serial Number",
        durasi: "Durasi",
        tanggalKalibrasi: "Tanggal Kalibrasi",
        tanggalExpired: "Tanggal Expired",
        lembagaKalibrasi: "Lembaga Kalibrasi",
        kondisi: "Kondisi",
        action: "Action",
    };

    // --- STATE DATA DAN PAGINATION ---
    const [equipmentItem, setEquipmentItem] = useState<GetAllEquipmentItem[]>([]);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15); // Default 15 (diubah dari 10 di JSX)
    const [meta, setMeta] = useState<EquipmentMeta>({
        current_page: 1,
        last_page: 1,
        // from: 0,
        // to: 0,
        total: 0,
        per_page: 15,
    });
    const [loading, setLoading] = useState(true);

    // State untuk input search sementara
    const [tempSearch, setTempSearch] = useState("");


    // --- FUNGSI FETCH DATA ---
    const fetchData = async () => {
        setLoading(true);
        // Pastikan Anda memanggil API dengan semua parameter yang diperlukan
        const res = await getAllEquipmentGeneral(page, perPage, search);

        if (res.success) {
            setEquipmentItem(res.data.data);
            setMeta(res.meta); // Update semua meta data
        } else {
            setEquipmentItem([]);
            // Reset meta jika gagal
            setMeta({
                current_page: 1, last_page: 1,
                // from: 0, to: 0, 
                total: 0, per_page: perPage
            });
        }

        setLoading(false);
    };

    // --- USE EFFECT: Trigger fetch data saat page, perPage, atau search berubah ---
    // Dipicu saat page, perPage, atau state search yang fix (bukan tempSearch) berubah
    useEffect(() => {
        fetchData();
    }, [page, perPage, search]);

    // --- HANDLERS: SEARCH ---
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Set state search dengan nilai dari input sementara (tempSearch)
        setSearch(tempSearch);
        // Reset page ke 1 setiap kali search baru dilakukan
        setPage(1);
        // Note: fetchData akan dipanggil oleh useEffect setelah state search dan page diperbarui
    };

    // --- HANDLERS: PER PAGE (ENTRIES) ---
    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Set perPage baru
        setPerPage(Number(e.target.value));
        // Reset page ke 1 setiap kali perPage diubah
        setPage(1);
        // Note: fetchData akan dipanggil oleh useEffect
        fetchData();
    };

    // --- HANDLERS: PAGINATION BUTTONS ---
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= meta.last_page) {
            setPage(newPage);
        }
    };


    // --- LOGIC COLUMN VISIBILITY ---
    const [columns, setColumns] = useState(
        Object.fromEntries(Object.keys(columnList).map((key) => [key, true]))
    );

    const [openDropdown, setOpenDropdown] = useState(false);

    // Helper untuk menentukan warna kondisi
    const getConditionColor = (condition: string) => {
        switch (condition) {
            case 'OK':
                return 'bg-green-500';
            case 'Expired':
                return 'bg-red-500';
            case 'Need Repair':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    // // Helper untuk mendapatkan nomor urut
    // const getSequentialNumber = (index: number) => {
    //     // meta.from memberikan nomor awal dari halaman saat ini
    //     return meta.from + index;
    // };


    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this equiment?")) return;

        const res = await deleteEquipmentGeneral(id);

        if (!res.success) {
            alert("Failed to delete: " + res.message);
            return;
        }

        alert("Equipment deleted successfully!");
        fetchData();
    };


    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9] border">
            {/* title container */}
            <div className="flex flex-row items-center space-x-3 mt-2">
                <ImWrench className="text-black w-10 h-10" />
                <h1 className="text-3xl font-normal">Data Equipment General</h1>
            </div>

            {/* list track record */}
            <div className="bg-white mt-12">
                <div className="py-3 px-4 flex justify-between border rounded-t-sm">
                    <Link href={"/admin/equipment-general/create"} className="bg-[#17A2B8] text-white px-2 h-10 flex justify-center items-center rounded-sm">Add Equipment Data <FiPlus className="w-5 h-5 ml-1" /> </Link>
                </div>

                {/* ini untuk nampilin berapa */}
                <div className="flex justify-between py-3 px-4 border-x">
                    <div className="flex flex-row space-x-2 items-center">
                        <p>show</p>
                        <select
                            name="perPage"
                            id="perPage"
                            className="w-14 h-8 border rounded-sm"
                            value={perPage} // Kontrol nilai select
                            onChange={handlePerPageChange} // Handler perubahan
                        >
                            <option value="15">15</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <p>entries</p>
                    </div>

                    <form className="flex flex-row space-x-2 items-center" onSubmit={handleSearchSubmit}>
                        <label htmlFor="search-input">Search :</label>
                        <input
                            type="text"
                            id="search-input"
                            className="flex bg-white border rounded-sm h-9 px-2"
                            value={tempSearch} // Nilai input sementara
                            onChange={(e) => setTempSearch(e.target.value)} // Update state sementara
                        />
                        {/* Optional: Tambahkan tombol submit jika user tidak menggunakan enter */}
                        {/* <button type="submit" className="bg-[#17A2B8] text-white h-9 px-2 rounded-sm">Cari</button> */}
                    </form>
                </div>

                {/* start of copy, csv,, excel, pdf, print, column visibility*/}
                <div className="w-2/6 flex pl-4 border-x">
                    {/* ... Tombol Export/Visibility (tidak diubah) ... */}
                    <div className="bg-[#6c757d] w-full h-[38px] rounded-sm flex flex-row items-center text-white">
                        <button className="flex-1 h-full hover:brightness-125 bg-[#6c757d] rounded-l-sm">Copy</button>
                        <button className="flex-1 h-full hover:brightness-125 bg-[#6c757d]">CSV</button>
                        <button className="flex-1 h-full hover:brightness-125 bg-[#6c757d]">Excel</button>
                        <button className="flex-1 h-full hover:brightness-125 bg-[#6c757d]">PDF</button>
                        <button className="flex-1 h-full hover:brightness-125 bg-[#6c757d] rounded-r-sm">Print</button>
                        <div className="relative">
                            <button
                                type="button" // Tambahkan type="button" untuk mencegah submit form
                                className="flex-2 h-full px-3 bg-[#6c757d] hover:brightness-125 text-white"
                                onClick={() => setOpenDropdown(!openDropdown)}
                            >
                                Column Visibility
                            </button>

                            {openDropdown && (
                                <div className="absolute -right-5 mt-2 bg-white text-black border rounded shadow p-3 z-40 w-48">
                                    {Object.entries(columnList).map(([key, label]) => (
                                        <label key={key} className="flex items-center space-x-0.5 mb-2">
                                            <input
                                                type="checkbox"
                                                checked={columns[key as keyof typeof columns]}
                                                onChange={() =>
                                                    setColumns({ ...columns, [key]: !columns[key as keyof typeof columns] })
                                                }
                                            />
                                            <span>{label}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* TABLE DATA */}
                <div className="py-5 px-4 flex justify-between border-x">
                    {loading ? (
                        <p>Loading equipment data...</p>
                    ) : (
                        <Table className="bg-[#f2f2f2] z-10">
                            <TableHeader>
                                <TableRow className="bg-[#dadada] hover:bg-[#dadada]">
                                    <TableHead className="text-[#212529] font-bold py-6 "><input type="checkbox" /></TableHead>
                                    {columns.no && (<TableHead className="text-[#212529] font-bold text-center">No</TableHead>)}
                                    {columns.deskripsi && (<TableHead className="text-[#212529] font-bold text-center">Deskripsi</TableHead>)}
                                    {columns.merkType && (<TableHead className="text-[#212529] font-bold text-center">Merk/Type</TableHead>)}
                                    {columns.serialNumber && (<TableHead className="text-[#212529] font-bold text-center">Serial Number</TableHead>)}
                                    {columns.durasi && (<TableHead className="text-[#212529] font-bold text-center">Durasi</TableHead>)}
                                    {columns.tanggalKalibrasi && (<TableHead className="text-[#212529] font-bold text-center">Tanggal Kalibrasi</TableHead>)}
                                    {columns.tanggalExpired && (<TableHead className="text-[#212529] font-bold text-center">Tanggal Expired</TableHead>)}
                                    {columns.lembagaKalibrasi && (<TableHead className="text-[#212529] font-bold text-center">Lembaga Kalibrasi</TableHead>)}
                                    {columns.kondisi && (<TableHead className="text-[#212529] font-bold text-center">Kondisi</TableHead>)}
                                    {columns.action && (<TableHead className="text-[#212529] font-bold text-center w-1/12">Action</TableHead>)}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {(equipmentItem).length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={Object.keys(columns).length + 1} className="text-center">
                                            Data Equipment General tidak ditemukan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    (equipmentItem).map((item, index) => (
                                        <TableRow key={item.id} className="hover:bg-gray-100">
                                            <TableCell className="font-medium"><input type="checkbox" /></TableCell>
                                            {columns.no && (
                                                <TableCell className="py-4"><p className="text-sm">
                                                    {/* {getSequentialNumber(index)} */}
                                                    {item.id}
                                                </p></TableCell>
                                            )}
                                            {columns.deskripsi && (
                                                <TableCell className="text-center">{item.description}</TableCell>
                                            )}
                                            {columns.merkType && (
                                                <TableCell className="text-center">{item.merk_type}</TableCell>
                                            )}
                                            {columns.serialNumber && (
                                                <TableCell className="text-center">{item.serial_number}</TableCell>
                                            )}
                                            {columns.durasi && (
                                                <TableCell className="text-center">{item.duration}</TableCell>
                                            )}
                                            {columns.tanggalKalibrasi && (
                                                <TableCell className="text-center">{item.calibration_date}</TableCell>
                                            )}
                                            {columns.tanggalExpired && (
                                                <TableCell className="text-center">{item.expired_date}</TableCell>
                                            )}
                                            {columns.lembagaKalibrasi && (
                                                <TableCell className="text-center">{item.calibration_agency}</TableCell>
                                            )}
                                            {columns.kondisi && (
                                                <TableCell className="text-center">
                                                    <span className={`${getConditionColor(item.condition)} p-1 rounded font-semibold text-white`}>
                                                        {item.condition}
                                                    </span>
                                                </TableCell>
                                            )}
                                            {columns.action && (
                                                <TableCell className="text-center w-1/12">
                                                    <div className="bg-white w-fit flex space-x-3 items-center mx-auto">
                                                        <Link href={`/admin/equipment-general/edit/${item.id}`} title="Edit"><MdEdit className="w-7 h-7 text-green-500" /></Link>
                                                        {/* Tambahkan logic delete nanti, saat ini hanya tampilan */}
                                                        <div title="Delete"><FaTrash className="w-5 h-5 text-red-500 cursor-pointer" onClick={() => handleDelete(item.id)} /></div>
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>

                        </Table>
                    )}
                </div>

                {/* PAGINATION FOOTER */}
                <div className="flex justify-between border-b border-x rounded-b-sm py-3 px-4">
                    {/* Display total entries */}
                    <div>
                        Showing {meta.total > 0 ? `${(meta.current_page - 1) * perPage + 1} to ${Math.min(meta.current_page * perPage, meta.total)}` : "0"} of {meta.total} entries
                    </div>

                    {/* Pagination Controls */}
                    <div className="border flex flex-row h-9 items-center rounded-sm overflow-hidden text-white font-semibold text-sm">

                        {/* Previous Button */}
                        <button
                            className={`h-full flex justify-center items-center px-3 transition-colors ${meta.current_page === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                            onClick={() => handlePageChange(meta.current_page - 1)}
                            disabled={meta.current_page === 1}
                        >
                            Previous
                        </button>

                        {/* Page Number Buttons */}
                        {Array.from({ length: meta.last_page }, (_, index) => index + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                className={`w-10 flex justify-center items-center h-full ${meta.current_page === pageNum ? 'bg-blue-700 text-white' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
                                onClick={() => handlePageChange(pageNum)}
                            >
                                {pageNum}
                            </button>
                        ))}

                        {/* Next Button */}
                        <button
                            className={`h-full flex justify-center items-center px-3 transition-colors ${meta.current_page === meta.last_page || meta.total === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                            onClick={() => handlePageChange(meta.current_page + 1)}
                            disabled={meta.current_page === meta.last_page || meta.total === 0}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}