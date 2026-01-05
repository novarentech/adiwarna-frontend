"use client";

import { FiPlus } from "react-icons/fi";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { RiDeleteBinLine } from "react-icons/ri";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { 
    DeliveryNoteItemUpdate, 
    GetbyIdDeliveryNoteItemDetails, 
    getDeliveryNoteById, 
    updateDeliveryNote, 
    UpdateDeliveryNoteRequest 
} from "@/lib/delivery-notes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Customer, getCustomersAllForDropdown } from "@/lib/customer";

export default function SuratJalanEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomerAddress, setSelectedCustomerAddress] = useState("");

    // 1. State Header (Disesuaikan namanya dengan Create Page)
    const [formData, setFormData] = useState({
        dn_no: "",
        date: "",
        customer_id: "",
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

    // 3. Fetch Data Awal (Customers & Delivery Note Detail)
    useEffect(() => {
        const fetchInitialData = async () => {
            setFetching(true);
            
            // Fetch list customer untuk dropdown
            const resCust = await getCustomersAllForDropdown();
            if (resCust.success) {
                setCustomers(resCust.data);
            }

            // Fetch detail Surat Jalan
            const res = await getDeliveryNoteById(Number(id));
            if (res.success && res.data) {
                const d = res.data;
                setFormData({
                    dn_no: d.dn_no, // Menggunakan dn_no sesuai response API
                    date: d.date,
                    customer_id: d.customer_id.toString(),
                    wo_no: d.wo_no,
                    delivered_with: d.delivered_with || "",
                    vehicle_plate: d.vehicle_plate,
                    delivered_by: d.delivered_by,
                    received_by: d.received_by || "",
                    status: d.status,
                    notes: d.notes || ""
                });

                // Set alamat dari object customer yang di-fetch
                setSelectedCustomerAddress(d.customer?.address || "");

                // Map items
                const mappedItems = d.items.map((item : GetbyIdDeliveryNoteItemDetails)  => ({
                    id: item.id,
                    item_name: item.item_name,
                    serial_number: item.serial_number || "",
                    qty: item.qty
                }));
                setItems(mappedItems);
            } else {
                toast.error("Data tidak ditemukan");
                router.push("/admin/surat-jalan");
            }
            setFetching(false);
        };

        if (id) fetchInitialData();
    }, [id, router]);

    // Handler Customer Change (Sama dengan Create)
    const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const custId = e.target.value;
        const cust = customers.find(c => c.id.toString() === custId);

        setFormData({ ...formData, customer_id: custId });
        setSelectedCustomerAddress(cust ? cust.address : "");
    };

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

        const res = await updateDeliveryNote(Number(id), payload);

        if (res.success) {
            toast.success("Surat Jalan berhasil diperbarui!");
            router.push("/admin/surat-jalan");
        } else {
            toast.error("Gagal update: " + res.message);
        }
        setLoading(false);
    };

    if (fetching) return <div className="p-20 text-center">Memuat data surat jalan...</div>;

    return (
        <div className="w-full h-fit px-16 pt-4 pb-16 bg-[#f4f6f9]">
            <h1 className="text-4xl mt-8">Edit Surat Jalan : {formData.dn_no}</h1>
            <div className="bg-white mt-6 w-full h-fit rounded-[10px] p-6">
                <div className="flex flex-row justify-between">
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
                    <h2 className="text-2xl uppercase">Surat Jalan</h2>
                </div>

                <hr className="border-b border-[#e6e6e6] my-6" />

                <form onSubmit={handleSubmit} className="flex flex-col w-full h-fit">
                    <div className="w-full grid grid-cols-2 gap-x-8">
                        {/* Left Side */}
                        <div className="space-y-4">
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="customer_id" className="text-sm">Kepada (Customer/Shipper)</label>
                                <select
                                    id="customer_id"
                                    className="w-full border rounded-sm h-10 px-2 bg-white"
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
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="customer_address" className="text-sm">Address</label>
                                <textarea 
                                    id="customer_address" 
                                    required 
                                    value={selectedCustomerAddress} 
                                    disabled 
                                    className="w-full h-[110px] border p-2 rounded-sm bg-[#e9ecef] border-[#D1D5DC] resize-none" 
                                />
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

                        {/* Right Side */}
                        <div className="space-y-4">
                            <div className="flex flex-col space-y-4">
                                <label htmlFor="dn_no" className="text-sm">No Surat</label>
                                <input id="dn_no" required value={formData.dn_no} onChange={handleInputChange} type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" />
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

                    {/* Items Details */}
                    <div className="flex flex-col mt-6">
                        <div className="w-full flex flex-row justify-between">
                            <h1 className="text-xl font-semibold">Items Details</h1>
                            <div onClick={addItem} className="cursor-pointer bg-[#31C6D4] text-white px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75">
                                <FiPlus className="w-5 h-5 mr-1" /> Add Item
                            </div>
                        </div>
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
                                            <TableCell>
                                                <input required type="text" value={item.item_name} onChange={(e) => handleItemChange(index, "item_name", e.target.value)} className="w-11/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" />
                                            </TableCell>
                                            <TableCell>
                                                <input type="text" value={item.serial_number} onChange={(e) => handleItemChange(index, "serial_number", e.target.value)} className="w-11/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" />
                                            </TableCell>
                                            <TableCell>
                                                <input required type="number" min="1" value={item.qty} onChange={(e) => handleItemChange(index, "qty", parseInt(e.target.value) || 0)} className="w-10/12 h-10 border px-2 rounded-sm border-[#D1D5DC]" />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div onClick={() => removeItem(index)} className="cursor-pointer hover:contrast-75 flex">
                                                    <RiDeleteBinLine className="w-6 h-6 mx-auto text-[#E7000B]" />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4 mt-6">
                        <label htmlFor="notes" className="text-sm">Note</label>
                        <textarea id="notes" value={formData.notes} onChange={handleInputChange} className="w-full h-[110px] border p-2 rounded-sm border-[#D1D5DC] resize-none" placeholder="Masukkan catatan tambahan..." />
                    </div>

                    <div className="w-full grid grid-cols-2 gap-x-8 mt-6">
                        <div className="flex flex-col space-y-4">
                            <label htmlFor="received_by" className="text-sm">Diterima Oleh</label>
                            <input id="received_by" value={formData.received_by} onChange={handleInputChange} type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="Name" />
                        </div>
                        <div className="flex flex-col space-y-4">
                            <label htmlFor="delivered_by" className="text-sm">Diserahkan Oleh</label>
                            <input id="delivered_by" required value={formData.delivered_by} onChange={handleInputChange} type="text" className="w-full h-10 border px-2 rounded-sm border-[#D1D5DC]" placeholder="Name" />
                        </div>
                    </div>

                    <hr className="border-b border-[#e6e6e6] my-6" />

                    <div className="flex flex-row ml-auto gap-x-4">
                        <Link href={"/admin/surat-jalan"} className="border text-black px-5 h-12 flex justify-center items-center rounded-sm hover:bg-gray-100">
                            Cancel
                        </Link>
                        <button type="submit" disabled={loading} className="bg-[#31C6D4] text-white px-5 h-12 flex justify-center items-center rounded-sm hover:contrast-75">
                            {loading ? "Updating..." : "Update Surat Jalan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}