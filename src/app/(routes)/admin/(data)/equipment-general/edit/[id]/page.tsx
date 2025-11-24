"use client"

import Link from "next/link";
import { use } from "react";
import { MdAddBox } from "react-icons/md";

type EditEmployeeParams = Promise<{ id: string }>;

export default function EditEquipmentGeneral({
    params,
}: {
    params: EditEmployeeParams;
}) {

    const actualParams = use(params);
    const id = actualParams.id;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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
                        <label className="font-bold">Deskripsi</label>
                        <input
                            type="text"
                            className="border rounded-sm h-9 px-2"
                            placeholder="Masukkan deskripsi equipment"
                        />
                    </div>

                    {/* Merk/Type */}
                    <div className="flex flex-col space-y-1 mt-4">
                        <label className="font-bold">Merk/Type</label>
                        <input
                            type="text"
                            className="border rounded-sm h-9 px-2"
                            placeholder="Masukkan merk/type"
                        />
                    </div>

                    {/* Serial Number */}
                    <div className="flex flex-col space-y-1 mt-4">
                        <label className="font-bold">Serial Number</label>
                        <input
                            type="text"
                            className="border rounded-sm h-9 px-2"
                            placeholder="Masukkan serial number"
                        />
                    </div>

                    {/* Tanggal Kalibrasi + Durasi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {/* Tanggal Kalibrasi */}
                        <div className="flex flex-col space-y-1">
                            <label className="font-bold">Tanggal Kalibrasi</label>
                            <input
                                type="date"
                                className="border rounded-sm h-9 px-2"
                            />
                        </div>

                        {/* Durasi */}
                        <div className="flex flex-col space-y-1">
                            <label className="font-bold">Durasi (Kalibrasi Berikutnya)</label>
                            <select className="border rounded-sm h-9 px-2" defaultValue={"placeholder"}>
                                <option value="placeholder" disabled hidden>Pilih Durasi</option>
                                <option value="6 Bulan">6 Bulan</option>
                                <option value="12 Bulan">12 Bulan</option>
                            </select>
                        </div>
                    </div>

                    {/* Lembaga Kalibrasi */}
                    <div className="flex flex-col space-y-1 mt-4">
                        <label className="font-bold">Lembaga Kalibrasi</label>
                        <select className="border rounded-sm h-9 px-2" defaultValue={"placeholder"}>
                            <option value="placeholder" disabled>--- Pilih Lembaga ---</option>
                            <option value="internal">internal</option>
                            <option value="external">external</option>
                        </select>
                    </div>

                    {/* Kondisi */}
                    <div className="flex flex-col space-y-1 mt-4">
                        <label className="font-bold">Kondisi</label>
                        <select className="border rounded-sm h-9 px-2" defaultValue={"placeholder"}>
                            <option value="placeholder" disabled hidden>Pilih Kondisi</option>
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
                            className="bg-[#17a2b8] flex justify-center items-center text-white h-10 rounded-sm"
                        >
                            Save
                        </button>
                    </div>

                </form>
            </div>

            <div className="h-20 text-transparent">.</div>
        </div>
    )
}