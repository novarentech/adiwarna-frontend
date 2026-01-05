"use client";

import Link from "next/link";
import { useState } from "react";
import { MdAddBox } from "react-icons/md";
import { useRouter } from "next/navigation"; // Import useRouter untuk redirect

// Import interface dan fungsi API yang baru
import { createEquipmentGeneral, CreateEquipmentPayload } from "@/lib/equipment-general";
import { toast } from "sonner";


export default function CreateEquipmentGeneral() {
    const router = useRouter();

    // State untuk menyimpan semua input form
    const [formData, setFormData] = useState({
        description: "",
        merk_type: "",
        serial_number: "",
        calibration_date: "",
        duration_months: 12, // Default 12
        calibration_agency: "external", // Default external
        condition: "ok", // Default ok
    });

    // State untuk validasi/loading
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handler universal untuk input teks dan tanggal
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Khusus untuk duration_months, pastikan value adalah number
        if (name === "duration_months") {
            setFormData({ ...formData, [name]: Number(value) as 6 | 12 });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // 1. Validasi Sederhana
        if (!formData.description || !formData.serial_number || !formData.calibration_date || !formData.duration_months) {
            toast.error("Harap lengkapi semua field yang diperlukan (Deskripsi, Serial Number, Tanggal Kalibrasi, Durasi).");
            setIsSubmitting(false);
            return;
        }

        // 2. Siapkan Payload
        const payload: CreateEquipmentPayload = {
            description: formData.description,
            merk_type: formData.merk_type,
            serial_number: formData.serial_number,
            calibration_date: formData.calibration_date,
            // Pastikan nilai duration_months adalah 6 atau 12 (Number)
            duration_months: formData.duration_months as 6 | 12,
            calibration_agency: formData.calibration_agency as "internal" | "external",
            condition: formData.condition as "ok" | "repair" | "reject",
        };

        // 3. Panggil API
        try {
            const res = await createEquipmentGeneral(payload);

            if (res.success) {
                toast.success("Data Equipment General berhasil dibuat!");
                // Redirect ke halaman list setelah berhasil
                router.push("/admin/equipment-general");
            } else {
                toast.error("Gagal membuat data equipment: " + res.message);
            }
        } catch (error) {
            console.error("Submission Error:", error);
            toast.error("Terjadi kesalahan saat menyimpan data.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full h-full px-4 py-4 bg-[#f4f6f9]">

            {/* Title */}
            <div className="flex flex-row items-center space-x-2 mt-2">
                <MdAddBox className="text-black w-10 h-10" />
                <h1 className="text-3xl font-normal">Add Data Equipment</h1>
            </div>

            {/* Form Container */}
            <div className="bg-white border rounded-sm px-5 py-6 shadow-xs my-12">
                <form onSubmit={handleSubmit} className="flex flex-col">

                    {/* Deskripsi */}
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="description" className="font-bold">Deskripsi</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            className="border rounded-sm h-9 px-2"
                            placeholder="Masukkan deskripsi equipment"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Merk/Type */}
                    <div className="flex flex-col space-y-1 mt-4">
                        <label htmlFor="merk_type" className="font-bold">Merk/Type</label>
                        <input
                            type="text"
                            id="merk_type"
                            name="merk_type"
                            className="border rounded-sm h-9 px-2"
                            placeholder="Masukkan merk/type"
                            value={formData.merk_type}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Serial Number */}
                    <div className="flex flex-col space-y-1 mt-4">
                        <label htmlFor="serial_number" className="font-bold">Serial Number</label>
                        <input
                            type="text"
                            id="serial_number"
                            name="serial_number"
                            className="border rounded-sm h-9 px-2"
                            placeholder="Masukkan serial number"
                            value={formData.serial_number}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Tanggal Kalibrasi + Durasi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {/* Tanggal Kalibrasi */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="calibration_date" className="font-bold">Tanggal Kalibrasi</label>
                            <input
                                type="date"
                                id="calibration_date"
                                name="calibration_date"
                                className="border rounded-sm h-9 px-2"
                                value={formData.calibration_date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Durasi */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="duration_months" className="font-bold">Durasi (Kalibrasi Berikutnya)</label>
                            <select
                                id="duration_months"
                                name="duration_months"
                                className="border rounded-sm h-9 px-2"
                                value={formData.duration_months}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="" disabled hidden>Pilih Durasi</option>
                                <option value={6}>6 Bulan</option>
                                <option value={12}>12 Bulan</option>
                            </select>
                        </div>
                    </div>

                    {/* Lembaga Kalibrasi */}
                    <div className="flex flex-col space-y-1 mt-4">
                        <label htmlFor="calibration_agency" className="font-bold">Lembaga Kalibrasi</label>
                        <select
                            id="calibration_agency"
                            name="calibration_agency"
                            className="border rounded-sm h-9 px-2"
                            value={formData.calibration_agency}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="" disabled hidden>--- Pilih Lembaga ---</option>
                            <option value="internal">internal</option>
                            <option value="external">external</option>
                        </select>
                    </div>

                    {/* Kondisi */}
                    <div className="flex flex-col space-y-1 mt-4">
                        <label htmlFor="condition" className="font-bold">Kondisi</label>
                        <select
                            id="condition"
                            name="condition"
                            className="border rounded-sm h-9 px-2"
                            value={formData.condition}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="" disabled hidden>Pilih Kondisi</option>
                            <option value="ok">OK</option>
                            <option value="repair">Repair</option>
                            <option value="reject">Reject (junk)</option>
                        </select>
                    </div>

                    <hr className="border-b my-6" />

                    {/* Buttons */}
                    <div className="ml-auto w-full md:w-1/4 grid grid-cols-2 gap-4">
                        <Link
                            href="/admin/equipment-general"
                            className="bg-red-500 flex justify-center items-center text-white h-10 rounded-sm"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            className="bg-[#17a2b8] flex justify-center items-center text-white h-10 rounded-sm disabled:bg-gray-400"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>

                </form>
            </div>

            <div className="h-20 text-transparent">.</div>
        </div>
    );
}