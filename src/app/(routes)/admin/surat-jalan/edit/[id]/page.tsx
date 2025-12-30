"use client";

import { FiPlus } from "react-icons/fi";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { RiDeleteBinLine } from "react-icons/ri";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { DeliveryNoteItemUpdate, getDeliveryNoteById, GetDeliveryNoteGetByIdResponse, updateDeliveryNote, UpdateDeliveryNoteRequest } from "@/lib/delivery-notes";
import { useRouter } from "next/navigation";

export default function SuratJalanEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // 1. State Header
    const [formData, setFormData] = useState({
        delivery_note_no: "",
        date: "",
        customer: "",
        customer_address: "",
        wo_no: "",
        delivered_with: "",
        vehicle_plate: "",
        delivered_by: "",
        received_by: "",
        status: "pending" as "delivered" | "pending" | "cancelled",
        notes: ""
    });

    // 2. State Items
    const [items, setItems] = useState<DeliveryNoteItemUpdate[]>([]);

    // 3. Fetch Data Awal
    useEffect(() => {
        const fetchInitialData = async () => {
            const res: GetDeliveryNoteGetByIdResponse = await getDeliveryNoteById(Number(id));
            if (res.success && res.data) {
                const d = res.data;
                setFormData({
                    delivery_note_no: d.delivery_note_no,
                    date: d.date,
                    customer: d.customer,
                    customer_address: d.customer_address,
                    wo_no: d.wo_no,
                    delivered_with: d.delivered_with || "",
                    vehicle_plate: d.vehicle_plate,
                    delivered_by: d.delivered_by,
                    received_by: d.received_by,
                    status: d.status,
                    notes: d.notes || ""
                });

                // Map items (pastikan serial_number tidak null untuk input)
                const mappedItems = d.items.map(item => ({
                    id: item.id,
                    item_name: item.item_name,
                    serial_number: item.serial_number || "",
                    qty: item.qty
                }));
                setItems(mappedItems);
            } else {
                alert("Data tidak ditemukan");
                router.push("/admin/surat-jalan");
            }
            setFetching(false);
        };

        if (id) fetchInitialData();
    }, [id, router]);

    // Handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleItemChange = (index: number, field: keyof DeliveryNoteItemUpdate, value: string | number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value } as DeliveryNoteItemUpdate;
        setItems(newItems);
    };

    const addItem = () => {
        // Untuk item baru di mode Edit, ID sementara bisa 0 (tergantung spesifikasi backend)
        setItems([...items, { id: 0, item_name: "", serial_number: "", qty: 1 }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload: UpdateDeliveryNoteRequest = {
            ...formData,
            items: items
        };

        console.log(payload)

        const res = await updateDeliveryNote(Number(id), payload);

        if (res.success) {
            alert("Surat Jalan berhasil diperbarui!");
            router.push("/admin/surat-jalan");
        } else {
            alert("Gagal update: " + res.message);
        }
        setLoading(false);
    };

    if (fetching) return <div className="p-20 text-center">Memuat data surat jalan...</div>;

    return (
        <div className="w-full h-fit px-16 pt-4 pb-16 bg-[#f4f6f9]">
            <h1 className="text-4xl mt-8">Edit Surat Jalan : {id}</h1>
            {/* form container */}
            <div className="bg-white mt-6 w-full h-fit rounded-[10px] p-6">
                <div className="flex flex-row justify-between">
                    {/* alamat */}
                    <div className="flex flex-col">
                        <p className="text-lg">PT. ADIWARNA PRATAMA</p>
                        <div className="flex flex-col text-[#4A5565]">
                            <p>GRAHAMAS FATMAWATI B-15</p>
                            <p>CIPETE UTARA, KEBAYORAN BARU</p>
                            <p>JAKARTA SELATAN - 12150</p>
                            <p>Telp. 021-7269032 Fax. 021</p>
                            <p>7253610</p>
                        </div>
                    </div>
                    {/* surat jalan */}
                    <h2 className="text-2xl uppercase">Surat Jalan</h2>
                </div>


                <hr className="border-b border-[#e6e6e6] my-6" />

                <form onSubmit={handleSubmit} className="flex flex-col w-full h-fit">
                    <div className="w-full grid grid-cols-2 gap-x-8">
                        {/* left side */}
                        <div className="space-y-4">
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="customer" className="text-sm">Kepada (Customer/Shipper)</label>
                                <input id="customer" required value={formData.customer} onChange={handleInputChange} type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" />
                            </div>
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="customer_address" className="text-sm">Address</label>
                                <textarea id="customer_address" required value={formData.customer_address} onChange={handleInputChange} className="w-full h-[110px] border p-2 rounded-sm border-[#D1D5DC] resize-none" />
                            </div>
                            <div className="flex flex-col space-y-4 mt-[37px]">
                                <label htmlFor="status" className="text-sm">Status Pengiriman</label>
                                <select id="status" value={formData.status} onChange={handleInputChange} className="w-full h-10 border px-3 rounded-sm border-[#D1D5DC] bg-white">
                                    <option value="pending">Pending</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                        {/* right side */}
                        <div className="space-y-4">
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="delivery_note_no" className="text-sm">No Surat</label>
                                <input id="delivery_note_no" required value={formData.delivery_note_no} onChange={handleInputChange} type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" />
                            </div>
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="date" className="text-sm">Tanggal</label>
                                <input id="date" required value={formData.date} onChange={handleInputChange} type="date" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" />
                            </div>
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="wo_no" className="text-sm">No WO</label>
                                <input id="wo_no" required value={formData.wo_no} onChange={handleInputChange} type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" />
                            </div>
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="delivered_with" className="text-sm">Dalam Dengan</label>
                                <input id="delivered_with" required value={formData.delivered_with} onChange={handleInputChange} type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" />
                            </div>
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="vehicle_plate" className="text-sm">Plat Kendaraan</label>
                                <input id="vehicle_plate" required value={formData.vehicle_plate} onChange={handleInputChange} type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" />
                            </div>
                        </div>
                    </div>


                    {/* item list (nanti bisa add item) */}
                    <div className="flex flex-col mt-6">
                        <div className="w-full flex flex-row justify-between">
                            <h1>Items Details</h1>
                            {/* button nambah item */}
                            <div onClick={addItem} className=" bg-[#31C6D4] text-white px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75">
                                <FiPlus className="w-5 h-5 mr-1" /> Add Item
                            </div>
                        </div>
                        {/* list input mengisi item */}
                        <div className="mt-4 border overflow-hidden rounded-xl">
                            <Table>
                                <TableHeader className="bg-[#F9FAFB]">
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead className="w-2/6 font-bold">Nama Barang</TableHead>
                                        <TableHead className="w-2/6 font-bold">Serial Number</TableHead>
                                        <TableHead className="w-1/6 font-bold">Qty</TableHead>
                                        <TableHead className="font-bold text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="py-6">{index + 1}</TableCell>
                                            <TableCell><input required type="text" value={item.item_name} onChange={(e) => handleItemChange(index, "item_name", e.target.value)} className="w-10/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" /></TableCell>
                                            <TableCell><input type="text" value={item.serial_number} onChange={(e) => handleItemChange(index, "serial_number", e.target.value)} className="w-10/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" /></TableCell>
                                            <TableCell><input required type="number" min="1" value={item.qty} onChange={(e) => handleItemChange(index, "qty", parseInt(e.target.value) || 0)} className="w-8/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" /></TableCell>
                                            <TableCell className="text-center"><div onClick={() => removeItem(index)} className="cursor-pointer hover:contrast-75 flex"><RiDeleteBinLine className="w-6 h-6 mx-auto text-[#E7000B]" /></div></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4 mt-6">
                        <label htmlFor="notes" className="text-sm">Note</label>
                        <textarea id="notes" value={formData.notes} onChange={handleInputChange} className="w-full h-[110px] border p-2 rounded-sm border-[#D1D5DC] resize-none" placeholder="Harapan S/N, RA 219-06207 dan silan S/N, 291905 biaya arca" />
                    </div>

                    <div className="w-full grid grid-cols-2 gap-x-8 mt-6">
                        <div className="flex flex-col space-y-4">
                            <label htmlFor="received_by" className="text-sm">Diterima / Diserahkan Oleh</label>
                            <input id="received_by" required value={formData.received_by} onChange={handleInputChange} type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="Name" />
                        </div>
                        <div className="flex flex-col space-y-4">
                            <label htmlFor="delivered_by" className="text-sm">Diserahkan Oleh PT. Adiwarna Pratama</label>
                            <input id="delivered_by" required value={formData.delivered_by} onChange={handleInputChange} type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="Name" />
                        </div>
                    </div>

                    <hr className="border-b border-[#e6e6e6] my-6" />

                    <div className="flex flex-row ml-auto gap-x-4">
                        <Link href={"/admin/surat-jalan"} className=" border text-black px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75">
                            Cancel
                        </Link>
                        <button type="submit" disabled={loading} className=" bg-[#31C6D4] text-white px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75">
                            {loading ? "Saving..." : "Save Surat Jalan"}
                        </button>
                    </div>
                </form>
            </div>
            {/* form container */}


        </div>
    )
}