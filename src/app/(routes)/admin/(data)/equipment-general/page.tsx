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

import { FaTrash } from "react-icons/fa6";
import { useEffect, useState } from "react";
// import { IoMdEye } from "react-icons/io";


import { getAllEquipmentGeneral, GetAllEquipmentItem, EquipmentMeta, deleteEquipmentGeneral, getAll999EquipmentGeneral } from "@/lib/equipment-general";

import * as XLSX from "xlsx";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { RiDeleteBinLine } from "react-icons/ri";
import { LiaEdit } from "react-icons/lia";


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
            case 'ok':
                return 'bg-lime-400 text-green-800';
            case 'reject':
                return 'bg-red-500 text-white';
            case 'repair':
                return 'bg-yellow-200 text-yellow-900';
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
            toast.error("Failed to delete: " + res.message);
            return;
        }

        toast.success("Equipment deleted successfully!");
        fetchData();
    };

    const [isCopying, setIsCopying] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [rowCount, setRowCount] = useState(0);

    const handleCopy = async () => {
        setIsCopying(true);
        try {
            const response = await getAll999EquipmentGeneral();

            if (!response.success || !response.data.data) {
                toast.error("Gagal mengambil data");
                return;
            }

            const equipmentData = response.data.data;
            const totalRows = equipmentData.length;

            // 1. Definisikan Header
            const headers = ["ID", "Description", "Merk/Type", "Serial Number", "Duration", "Calibration Date", "Expired Date", "Agency", "Condition"];

            // 2. Buat baris data (Gunakan \t atau Tab agar Excel otomatis memisahkan kolom saat paste)
            // Tips: Excel lebih suka Tab (\t) daripada Koma (,) saat proses Copy-Paste manual
            const csvRows = equipmentData.map((item: any) => {
                return [
                    item.id,
                    item.description,
                    item.merk_type,
                    item.serial_number,
                    item.duration,
                    item.calibration_date,
                    item.expired_date,
                    item.calibration_agency,
                    item.condition,
                ].join("\t"); // Menggunakan Tab
            });

            const fullText = [headers.join("\t"), ...csvRows].join("\n");

            // 3. Gunakan Clipboard API
            await navigator.clipboard.writeText(fullText);

            // 3. Set data untuk modal dan tampilkan
            setRowCount(totalRows);
            setShowModal(true);

        } catch (error) {
            console.error("Copy error:", error);
            toast.error("Gagal menyalin data");
        } finally {
            setIsCopying(false);
        }
    };


    const [isExportingCsv, setIsExportingCsv] = useState(false);

    const handleExportCsv = async () => {
        setIsExportingCsv(true);
        try {
            // 1. Ambil data dari API
            const response = await getAll999EquipmentGeneral();

            if (!response.success || !response.data.data) {
                toast.error("Gagal mengambil data untuk ekspor");
                return;
            }

            const equipmentData = response.data.data;

            // 2. Tentukan Header CSV
            const headers = [
                "ID",
                "Description",
                "Merk/Type",
                "Serial Number",
                "Duration",
                "Calibration Date",
                "Expired Date",
                "Agency",
                "Condition",
            ];

            // 3. Konversi data array of objects ke string CSV
            // Kita gunakan map untuk memastikan setiap kolom terisi dengan benar
            const csvRows = equipmentData.map((item: any) => {
                return [
                    item.id,
                    `"${item.description}"`, // Bungkus dengan kutip jika mengandung koma
                    `"${item.merk_type}"`,
                    `"${item.serial_number}"`,
                    item.duration,
                    item.calibration_date,
                    item.expired_date,
                    item.calibration_agency,
                    item.condition,
                ].join(",");
            });

            // Gabungkan header dan baris dengan baris baru (\n)
            const csvContent = [headers.join(","), ...csvRows].join("\n");

            // 4. Proses Download
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.setAttribute("href", url);
            link.setAttribute("download", `equipment_data_${new Date().getTime()}.csv`);
            link.style.visibility = "hidden";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error("Export error:", error);
            toast.error("Terjadi kesalahan saat mengekspor data");
        } finally {
            setIsExportingCsv(false);
        }
    };

    // export EXCELL
    const [loadingExcel, setLoadingExcel] = useState(false);

    const handleExportExcel = async () => {
        setLoadingExcel(true);
        try {
            // 1. Ambil data dari API
            const response = await getAll999EquipmentGeneral();

            if (!response.success || !response.data.data) {
                toast.error("Gagal mengambil data");
                return;
            }

            const equipmentData = response.data.data;
            setRowCount(equipmentData.length);

            // 2. Mapping data agar header lebih rapi (Opsional tapi disarankan)
            const formattedData = equipmentData.map((item: any) => ({
                "ID": item.id,
                "Description": item.description,
                "Merk/Type": item.merk_type,
                "Serial Number": item.serial_number,
                "Duration": item.duration,
                "Calibration Date": item.calibration_date,
                "Expired Date": item.expired_date,
                "Agency": item.calibration_agency,
                "Condition": item.condition,
            }));

            // 3. Proses konversi ke Excel menggunakan SheetJS
            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Equipment Data");

            // 4. Trigger Download
            // Menghasilkan file: equipment_report_2025-12-22.xlsx
            const fileName = `equipment_report_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(workbook, fileName);

            // 5. Tampilkan Modal Sukses
            // setShowModal(true);
            setTimeout(() => setShowModal(false), 3000);

        } catch (error) {
            console.error("Excel Export error:", error);
            toast.error("Terjadi kesalahan saat membuat file Excel");
        } finally {
            setLoadingExcel(false);
        }
    };

    const [isExportingPdf, setIsExportingPdf] = useState(false);

    // --- HANDLER: PRINT ---
    const handlePrint = async () => {
        const response = await getAll999EquipmentGeneral();
        if (!response.success || !response.data.data) {
            toast.error("Gagal mengambil data untuk print");
            return;
        }

        const data = response.data.data;
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const tableHtml = `
            <html>
                <head>
                    <title>Print Equipment General</title>
                    <style>
                        body { font-family: sans-serif; padding: 20px; }
                        h1 { text-align: center; color: #333; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 11px; }
                        th { background-color: #f4f4f4; }
                        .footer { margin-top: 20px; font-size: 10px; color: #666; }
                        @page { size: landscape; }
                    </style>
                </head>
                <body>
                    <h1>Equipment General Report</h1>
                    <div class="footer">Printed on: ${new Date().toLocaleString('id-ID')}</div>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Description</th>
                                <th>Merk/Type</th>
                                <th>Serial Number</th>
                                <th>Calibration Date</th>
                                <th>Expired Date</th>
                                <th>Agency</th>
                                <th>Condition</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map((item: any, index: number) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${item.description}</td>
                                    <td>${item.merk_type}</td>
                                    <td>${item.serial_number}</td>
                                    <td>${item.calibration_date}</td>
                                    <td>${item.expired_date}</td>
                                    <td>${item.calibration_agency}</td>
                                    <td>${item.condition}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;

        printWindow.document.write(tableHtml);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    // --- HANDLER: PDF ---
    const handleExportPdf = async () => {
        setIsExportingPdf(true);
        try {
            const response = await getAll999EquipmentGeneral();
            if (!response.success || !response.data.data) {
                toast.error("Gagal mengambil data untuk PDF");
                return;
            }

            const data = response.data.data;
            const doc = new jsPDF('l', 'mm', 'a4'); // Landscape

            doc.setFontSize(16);
            doc.text("Equipment General Report", 14, 15);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated: ${new Date().toLocaleString('id-ID')}`, 14, 22);

            const headers = [["No", "Description", "Merk/Type", "Serial Number", "Cal. Date", "Exp. Date", "Agency", "Condition"]];
            const body = data.map((item: any, index: number) => [
                index + 1,
                item.description,
                item.merk_type,
                item.serial_number,
                item.calibration_date,
                item.expired_date,
                item.calibration_agency,
                item.condition
            ]);

            autoTable(doc, {
                head: headers,
                body: body,
                startY: 30,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [23, 162, 184] }, // Warna biru info sesuai tombol Add
                alternateRowStyles: { fillColor: [245, 245, 245] }
            });

            doc.save(`equipment_general_${new Date().getTime()}.pdf`);
        } catch (error) {
            console.error("PDF Export Error:", error);
        } finally {
            setIsExportingPdf(false);
        }
    };


    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9] border">
            {/* Modal Notifikasi */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs">
                    <div className="bg-white rounded-md shadow-2xl p-6 w-80 transform transition-all scale-110 animate-in fade-in zoom-in duration-100">
                        <div className="flex flex-col items-center text-center">
                            {/* Icon Centang */}
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900">Successfully copied!</h3>
                            <p className="text-sm text-gray-600 mt-2">
                                Copied <span className="font-semibold text-blue-600">{rowCount} rows </span> to clipboard
                            </p>

                            <button
                                onClick={() => setShowModal(false)}
                                className="mt-6 w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* title container */}
            <div className="flex flex-row items-center space-x-3 mt-2">
                <ImWrench className="text-black w-10 h-10" />
                <h1 className="text-3xl font-normal">Data Equipment General</h1>
            </div>

            {/* list track record */}
            <div className="bg-white mt-12">
                <div className="py-3 px-4 flex justify-between border rounded-t-sm">
                    <Link href={"/admin/equipment-general/create"} className="bg-[#31C6D4] text-white px-2 h-10 flex justify-center items-center rounded-sm">Add Equipment Data <FiPlus className="w-5 h-5 ml-1" /> </Link>
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
                <div className="flex pr-6 border-x">
                    {/* <div className="bg-[#6c757d] w-full h-[38px] rounded-sm flex flex-row items-center text-white">
                        <button onClick={handleCopy} disabled={isCopying} className="flex-1 h-full hover:brightness-125 bg-[#6c757d] rounded-l-sm">{isCopying ? "Loading..." : "Copy"}</button>
                        <button onClick={handleExportCsv} disabled={isExportingCsv} className="flex-1 h-full hover:brightness-125 bg-[#6c757d]">{isExportingCsv ? "Exporting..." : "CSV"}</button>
                        <button onClick={handleExportExcel} disabled={isExportingExcel} className="flex-1 h-full hover:brightness-125 bg-[#6c757d]">{isExportingExcel ? "Exporting..." : "Excel"}</button>
                        <button onClick={handleExportPdf} disabled={isExportingPdf} className="flex-1 h-full hover:brightness-125 bg-[#6c757d]">{isExportingPdf ? "..." : "PDF"}</button>
                        <button onClick={handlePrint} className="flex-1 h-full hover:brightness-125 bg-[#6c757d] rounded-r-sm">Print</button>
                        <div className="relative">
                            <button
                                type="button"
                                className="flex-2 h-full px-3 bg-[#6c757d]  hover:brightness-125 text-white"
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
                    </div> */}
                    <div className="grid grid-cols-5 gap-x-2 h-10 ml-auto">
                        <button
                            onClick={handleCopy}
                            disabled={isCopying}
                            className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Copy
                        </button>
                        <button
                            onClick={handleExportCsv}
                            disabled={isExportingCsv}
                            className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            CSV
                        </button>
                        <button
                            onClick={handleExportExcel}
                            className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Excel
                        </button>
                        <button
                            onClick={handleExportPdf}
                            disabled={isExportingPdf}
                            className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors">
                            PDF
                        </button>
                        <button
                            onClick={handlePrint}
                            className="border-[#D1D5DC] border flex items-center justify-center px-4 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors">
                            Print
                        </button>
                    </div>
                </div>

                {/* TABLE DATA */}
                <div className="py-5 px-4 flex justify-between border-x">
                    {loading ? (
                        <p>Loading equipment data...</p>
                    ) : (
                        <Table className="z-10">
                            <TableHeader>
                                <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB] border-[#E5E7EB]">
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
                                        <TableRow key={item.id} className="hover:bg-gray-50 border-[#E5E7EB]">
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
                                                <TableCell className="text-center capitalize">{item.calibration_agency}</TableCell>
                                            )}
                                            {columns.kondisi && (
                                                <TableCell className="text-center capitalize">
                                                    <span className={`${getConditionColor(item.condition)} p-1 rounded-full px-2 py-1 font-semibold`}>
                                                        {item.condition}
                                                    </span>
                                                </TableCell>
                                            )}
                                            {columns.action && (
                                                <TableCell className="text-center w-1/12">
                                                    <div className="bg-white w-fit flex space-x-3 items-center mx-auto">
                                                        <Link href={`/admin/equipment-general/edit/${item.id}`} title="Edit">
                                                            {/* <MdEdit className="w-7 h-7 text-green-500" /> */}
                                                            <LiaEdit className="w-6 h-6 text-[#00A63E] hover:opacity-70" />
                                                        </Link>
                                                        {/* Tambahkan logic delete nanti, saat ini hanya tampilan */}
                                                        <div title="Delete">
                                                            {/* <FaTrash className="w-5 h-5 text-red-500 cursor-pointer" onClick={() => handleDelete(item.id)} /> */}
                                                            <RiDeleteBinLine className="w-5 h-5 text-[#E7000B] hover:opacity-70" onClick={() => handleDelete(item.id)} />
                                                        </div>
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